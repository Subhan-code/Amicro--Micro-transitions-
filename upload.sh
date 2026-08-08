#!/bin/bash
set -Eeuo pipefail

# Paxel upload script
# ===================
#
# What this does (up to 17 steps):
#   On your machine
#     1. Check Docker is installed and running
#     2. Sign you in (browser-based device auth)
#     3. Pull or build the Paxel Docker image
#
#   Inside the container — file bodies stay local; only aggregate metrics +
#   metadata (paths, commit numstat, session events) are uploaded
#     4. Discover projects and sessions (Claude Code, Codex CLI, Cursor)
#     5. Read your git history
#     6. Parse transcripts
#     7. Summarize each session (cloud Haiku via YC proxy)
#     8. Group git commits by session
#     9. Group sessions into multi-day work streams
#    10. Extract steering traces
#    11. Extract decision exchanges (cloud Haiku)
#    12. Redact code before upload (regex pattern redaction)
#    13. Link decisions to outcomes
#    14. Analyze code quality (L1 deterministic)
#    15. Score episodes across 5 axes (cloud Haiku)
#    16. Assemble your report
#    17. Upload redacted summaries + scores to the server
#
#   Then: opens your results in the browser
#
# Some steps are skipped when there's nothing to do (no new sessions, no
# work streams, no server to upload to). 17 is the ceiling; fewer can run.
#
# What stays on this machine:
#   File bodies (source code contents), full raw transcripts, and raw plan
#   file contents. Diffs never leave — only aggregate line counts do.
# What gets uploaded:
#   Scores, behavioral summaries, narrative outputs, redacted decision
#   records, session metadata (including file paths your agent Read/Edited/
#   Created and bash commands it ran), per-commit numstat (touched paths
#   with added/deleted line counts), git commit metadata (sha, author,
#   date, subject), aggregate velocity/LOC stats, and pipeline telemetry.
#   Transcript excerpts (including snippets of tool calls) flow to Claude
#   through the YC LLM proxy for narrative analysis — the proxy logs
#   request/response to our Postgres for anti-gaming verification. See
#   /data-handling for the field-by-field breakdown.
#
# Caches and re-runs:
#   LLM call results cache in a local Docker volume (paxel-cache-<uid>).
#   Re-running on the same repo (or after a mid-pipeline failure) typically
#   hits 95%+ cache and finishes in minutes instead of re-doing every step.
#   The container itself is --rm — nothing persists inside. Only the LLM
#   cache survives between runs.
#
# After the upload:
#   The server runs one more pass — cohort anomaly detection, cross-session
#   analysis via embeddings, narrative synthesis, and (after 3+ uploads)
#   builder profile updates. That takes ~1-5 minutes after the container
#   finishes. The results page polls automatically.
#
# Review it or ask your agent before running:
#   curl -fsSL 'https://paxel.ycombinator.com/upload/upload.sh' -o paxel-upload.sh && less paxel-upload.sh
#   curl -fsSL 'https://paxel.ycombinator.com/upload/upload.sh' | claude -p "explain what this bash script does"
#   curl -fsSL 'https://paxel.ycombinator.com/upload/upload.sh' | codex exec "walk me through this script"
#
# Usage:
#   upload                                        # Docker mode: analyze locally, upload scores
#   upload --project NAME                         # select project by repo name
#   upload --since 2m                             # sessions from last 2 months (recommended)
#   upload --all                                  # skip auto-detect; analyze every project
#   upload --no-repo                              # skip repo mount (transcripts only)
#   upload --no-sentry                            # disable client-side error reporting for this run
#   upload --clear-cache                          # clear project-remote cache


CACHE_DIR="${HOME}/.paxel/cache"
mkdir -p "$CACHE_DIR"
# Owner-only on the ~/.paxel dirs is the real protection: a 0700 directory
# blocks other users on a shared host from traversing to ANY file inside
# (cache, logs, data, git_metrics.txt, the LLM cache + pending-upload stash on
# the data mount), regardless of each file's own mode. We deliberately do NOT
# tighten the files themselves with a global umask — several are bind-mounted
# read-only into the client container, which runs as uid 1000, so owner-only
# files would become unreadable there on Linux hosts whose uid != 1000.
# Dir-level 0700 keeps container reads working while closing the exposure.
chmod 700 "${HOME}/.paxel" "$CACHE_DIR" 2>/dev/null || true

cleanup_temp_dirs() {
  rm -f "${HOME}/.paxel/git_metrics.txt"
  rm -rf "${HOME}/.paxel/cache/filtered-transcripts-$$"
  rm -rf "${HOME}/.paxel/cache/cursor_extracted-$$"
  rm -rf "${HOME}/.paxel/cache/codex_extracted-$$"
  rm -rf "${HOME}/.paxel/cache/opencode_extracted-$$"
  rm -rf "${HOME}/.paxel/cache/gemini_extracted-$$"
  rm -rf "${HOME}/.paxel/cache/vscode_extracted-$$"
  rm -rf "${HOME}/.paxel/cache/filtered-codex-$$"
  # Use the same helper the scan + bind-mount consult, so a future
  # override of _DOCKER_ALL_SIDECAR_DIR (or a relocation of the path
  # convention) stays consistent across all three call sites.
  if declare -f _docker_all_sidecar_dir >/dev/null 2>&1; then
    rm -rf "$(_docker_all_sidecar_dir)"
  fi
  [ -n "${_RMDC_LOG_FILE:-}" ] && rm -f "$_RMDC_LOG_FILE"
}
trap cleanup_temp_dirs EXIT

# ERR trap: fires only on unhandled command failures (not on explicit `exit N`
# after a user-friendly banner, and not on `|| true`-protected commands).
# Prints exit code, failing command, line number, and a function stack so the
# user has something concrete to send us. `set -E` above propagates this into
# functions and subshells.
_paxel_on_error() {
  local ec=$?
  local failed_line="${BASH_LINENO[0]:-?}"
  local failed_cmd="${BASH_COMMAND:-?}"
  {
    echo ""
    echo "────────────────────────────────────────────────────────"
    echo "Paxel upload hit an unexpected error."
    echo ""
    echo "  exit code: $ec"
    echo "  line:      $failed_line"
    echo "  command:   $failed_cmd"
    if [ "${#FUNCNAME[@]}" -gt 1 ]; then
      echo "  stack:"
      local i=0
      while [ "$i" -lt "${#FUNCNAME[@]}" ]; do
        local fn="${FUNCNAME[$i]:-main}"
        local ln="${BASH_LINENO[$i]:-?}"
        echo "    at ${fn} (line ${ln})"
        i=$((i + 1))
      done
    fi
    echo ""
    echo "Please email paxel@ycombinator.com with the above (and the"
    echo "last ~30 lines of output) so we can fix it."
    echo "────────────────────────────────────────────────────────"
  } >&2
}
trap _paxel_on_error ERR

find "${HOME}/.paxel/cache" -maxdepth 1 -name "filtered-transcripts-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "cursor_extracted-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "codex_extracted-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "opencode_extracted-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "gemini_extracted-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "vscode_extracted-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "filtered-codex-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
find "${HOME}/.paxel/cache" -maxdepth 1 -name "docker-all-sidecar-*" -mmin +1440 -exec rm -rf {} + 2>/dev/null || true
# Sweep stale run logs (timestamped replay-*.log + per-run extract logs) after
# 14 days — they persist for debugging but shouldn't accumulate forever.
find "${HOME}/.paxel/logs" -maxdepth 1 -type f -mtime +14 -exec rm -f {} + 2>/dev/null || true
CACHE_FILE="$CACHE_DIR/transcripts.tar.gz"

UPLOAD_URL="${UPLOAD_URL:-https://paxel.ycombinator.com/upload}"
CLAUDE_DIR="${TRANSCRIPT_DIR:-${CLAUDE_DIR:-$HOME/.claude/projects}}"
CODEX_DIR="${CODEX_DIR:-$HOME/.codex/sessions}"
# >>> paxel-cursor-os-paths (also exercised by dev_upload_spec.bats)
case "$(uname -s)" in
  Darwin)
    CURSOR_DIR="${CURSOR_DIR:-$HOME/Library/Application Support/Cursor/User/workspaceStorage}"
    CURSOR_GLOBAL_DB="${CURSOR_GLOBAL_DB:-$HOME/Library/Application Support/Cursor/User/globalStorage/state.vscdb}"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    # Windows (Git Bash / MSYS2 / Cygwin). Cursor lives under %APPDATA%\Cursor, NOT
    # ~/.config — without this branch every Cursor workspace is skipped on Windows
    # (PAXEL: "28 Cursor workspaces completely skipped", report 2026-06-06). $APPDATA
    # is a native path with backslashes (C:\Users\..\AppData\Roaming); normalize to
    # forward slashes so the MSYS find/sqlite3 read it, and fall back to the
    # HOME-relative location if APPDATA is unset.
    _paxel_appdata="${APPDATA:-$HOME/AppData/Roaming}"
    _paxel_appdata="${_paxel_appdata//\\//}"
    CURSOR_DIR="${CURSOR_DIR:-$_paxel_appdata/Cursor/User/workspaceStorage}"
    CURSOR_GLOBAL_DB="${CURSOR_GLOBAL_DB:-$_paxel_appdata/Cursor/User/globalStorage/state.vscdb}"
    ;;
  *)
    CURSOR_DIR="${CURSOR_DIR:-$HOME/.config/Cursor/User/workspaceStorage}"
    CURSOR_GLOBAL_DB="${CURSOR_GLOBAL_DB:-$HOME/.config/Cursor/User/globalStorage/state.vscdb}"
    # WSL: a user who runs Cursor on the WINDOWS side keeps its data under the mounted
    # Windows %APPDATA% (/mnt/c/Users/<u>/AppData/Roaming/Cursor), NOT the Linux
    # ~/.config — so the default above finds nothing (PAXEL: sutaniese, /mnt/c/dev).
    # Only repoint when the default dir is still in play (no explicit CURSOR_DIR env)
    # AND it has no USABLE data (no state.vscdb under it and no global DB — an empty
    # ~/.config/Cursor from a one-off Linux install must not block the WSL path, per
    # review) AND we're under WSL AND the Windows side has data. Every probe
    # lives inside the `if` condition or is guarded — this block runs at top level
    # under `set -Eeuo pipefail` with the ERR trap armed, so a bare non-zero (e.g.
    # grep finding no "microsoft", the case for every non-WSL Linux user) must never
    # escape. (cmd.exe %APPDATA% would pin the exact current Windows user but adds
    # interop failure modes; the glob is robust for the common single-user box.)
    if [ "$CURSOR_DIR" = "$HOME/.config/Cursor/User/workspaceStorage" ] \
       && [ -z "$(find "$CURSOR_DIR" -maxdepth 2 -name state.vscdb -print -quit 2>/dev/null)" ] \
       && [ ! -f "$CURSOR_GLOBAL_DB" ] \
       && grep -qi microsoft /proc/version 2>/dev/null; then
      for _paxel_win_cursor in /mnt/c/Users/*/AppData/Roaming/Cursor/User; do
        [ -d "$_paxel_win_cursor/workspaceStorage" ] || continue
        CURSOR_DIR="$_paxel_win_cursor/workspaceStorage"
        CURSOR_GLOBAL_DB="$_paxel_win_cursor/globalStorage/state.vscdb"
        # The agent-transcripts tree lives under the Windows user profile
        # (~/.cursor/projects), a sibling of AppData — repoint it alongside the
        # DB paths so a WSL user's current-Cursor sessions are found too.
        if [ -z "${CURSOR_PROJECTS_DIR:-}" ] && [ ! -d "$HOME/.cursor/projects" ] \
           && [ -d "${_paxel_win_cursor%/AppData/*}/.cursor/projects" ]; then
          CURSOR_PROJECTS_DIR="${_paxel_win_cursor%/AppData/*}/.cursor/projects"
        fi
        break
      done
    fi
    ;;
esac
# Current Cursor versions write agent chats as plain JSONL under
# ~/.cursor/projects/<encoded-cwd>/agent-transcripts/ (the SQLite composerData
# rows above stop being written). Same location on every OS ($HOME resolves to
# the user profile on Git Bash). collect_cursor_project_transcripts reads this
# tree; override for the test harness like the other *_DIR vars.
CURSOR_PROJECTS_DIR="${CURSOR_PROJECTS_DIR:-$HOME/.cursor/projects}"
# <<< paxel-cursor-os-paths
# opencode stores sessions in a SQLite DB under the XDG data dir on BOTH macOS
# and Linux (it uses the xdg-basedir convention, not ~/Library on macOS).
# collect_opencode_sessions scans OPENCODE_DIR for opencode*.db (covers channel
# DBs like opencode-beta.db; WAL files end in -wal/-shm and don't match).
# Set OPENCODE_DB to point at a single DB explicitly (used by the test harness).
OPENCODE_DIR="${OPENCODE_DIR:-${XDG_DATA_HOME:-$HOME/.local/share}/opencode}"
# Gemini CLI stores one JSONL transcript per session under ~/.gemini/tmp/<slug>/chats/
# on BOTH macOS and Linux (its home dir is always ~/.gemini — there is no env-var
# override in gemini-cli). Each <slug> dir has a .project_root naming the repo.
# collect_gemini_sessions copies these raw (the server GeminiNormalizer reconstructs
# them). Override GEMINI_DIR to point at a fixture tree (used by the test harness).
GEMINI_DIR="${GEMINI_DIR:-$HOME/.gemini/tmp}"
# Google Antigravity (the agy CLI, the standalone IDE, and the 2.0 hub app) renders
# every conversation to a plaintext transcript at
# ~/.gemini/<surface>/brain/<uuid>/.system_generated/logs/transcript.jsonl, where
# <surface> is antigravity | antigravity-ide | antigravity-cli — all under ~/.gemini
# (no env override in the app). Attribution (workspace path + git remote) lives in
# the sibling ~/.gemini/<surface>/conversations/<uuid>.db (SQLite). collect_antigravity_sessions
# copies the transcript raw with a synthetic meta line (server AntigravityNormalizer
# reconstructs it). Override ANTIGRAVITY_DIR to point at a fixture tree (test harness).
ANTIGRAVITY_DIR="${ANTIGRAVITY_DIR:-$HOME/.gemini}"
# VS Code Copilot stores one big JSON object per chat session under
# <userDataDir>/User/workspaceStorage/<hash>/chatSessions/*.json, with a sibling
# workspace.json naming the workspace folder. The user-data dir differs by OS and
# by channel (stable "Code" vs "Code - Insiders"); Cursor lives under its own
# "Cursor" dir and is a SEPARATE source, so it is NOT included here. VSCODE_DIR is
# a newline-separated LIST of workspaceStorage base dirs the collector iterates;
# override it (single dir or newline list) to point at a fixture tree.
if [ -z "${VSCODE_DIR:-}" ]; then
  case "$(uname -s)" in
    Darwin)
      VSCODE_DIR="$HOME/Library/Application Support/Code/User/workspaceStorage
$HOME/Library/Application Support/Code - Insiders/User/workspaceStorage"
      ;;
    MINGW*|MSYS*|CYGWIN*)
      _paxel_vscode_appdata="${APPDATA:-$HOME/AppData/Roaming}"
      _paxel_vscode_appdata="${_paxel_vscode_appdata//\\//}"
      VSCODE_DIR="$_paxel_vscode_appdata/Code/User/workspaceStorage
$_paxel_vscode_appdata/Code - Insiders/User/workspaceStorage"
      ;;
    *)
      VSCODE_DIR="$HOME/.config/Code/User/workspaceStorage
$HOME/.config/Code - Insiders/User/workspaceStorage"
      ;;
  esac
fi
DRY_RUN="${DRY_RUN:-0}"
PAXEL_SERVER="${PAXEL_SERVER:-https://paxel.ycombinator.com}"
PAXEL_LLM_PROXY="${PAXEL_LLM_PROXY:-https://paxel-llm.ycombinator.com}"
PAXEL_TOKEN_FILE="${HOME}/.paxel/token"
PAXEL_CLIENT_IMAGE="${PAXEL_CLIENT_IMAGE:-ghcr.io/yc-software/paxel-client:latest}"
PAXEL_REPO_ROOT="${PAXEL_REPO_ROOT:-}"
PAXEL_BAKED_TOKEN=""

# Defaults
PROJECT_NAME=""
ALL_PROJECTS=0
SINCE_EPOCH=""
OLDEST_SESSION_EPOCH=""
NO_REPO=0

# Grouped project data (parallel arrays for bash 3.2 compat)
GROUP_REMOTES=()
GROUP_DISPLAYS=()
GROUP_DIRS=()       # pipe-separated dir names per group
GROUP_COUNTS=()     # session count per group
GROUP_DIR_COUNTS=() # workspace count per group

# Selected project dirs (set by auto-detect or interactive selection)
PROJECT_DIRS=()

# Multi-repo mode state
MULTI_REPO_RUNNING=0
MULTI_REPO_MODE=""
MULTI_REPO_SELECTED=0
# Zero-based indices into the CHILD_REPO_* arrays for the selected subset.
# Populated by show_child_repo_menu; consumed by run_selected_child_repos.
MULTI_REPO_SELECTED_LIST=()
CHILD_REPO_DIRS=()
CHILD_REPO_REMOTES=()
CHILD_REPO_NAMES=()
CHILD_REPO_SESSIONS=()
# 1 = repo has only Cursor sessions (no cheap count); picker labels it accordingly.
CHILD_REPO_CURSOR_ONLY=()
CHILD_TRANSCRIPT_DIRS=()
CHILD_CODEX_DIRS=()

# --- Functions ---

# Determine whether to emit ANSI escape codes. Evaluated ONCE here at module
# load so `[ -t 1 ]` sees the script's actual stdout — evaluating inside a
# function via `$(...)` would inherit the subshell's pipe and always be false.
# NO_COLOR (https://no-color.org/) disables color regardless of TTY.
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  _IS_TTY=1
else
  _IS_TTY=0
fi

# Semantic color helpers. Scope is narrow on purpose: decision moments only.
# Informational output stays uncolored so the color itself is a signal —
# "your attention is wanted here."
# Takes a color name and text; returns text unchanged when stdout isn't a tty
# or NO_COLOR is set. osascript/notifier strings and any var that flows into
# non-tty surfaces (logs, telemetry) MUST NOT be wrapped in these helpers —
# wrap only at echo time.
_color() {
  if [ "${_IS_TTY:-0}" != "1" ]; then
    printf '%s' "$2"
    return
  fi
  local code
  case "$1" in
    yellow) code='33' ;;
    green)  code='32' ;;
    *)      printf '%s' "$2"; return ;;
  esac
  printf '\033[%sm%s\033[0m' "$code" "$2"
}

_bold() {
  if [ "${_IS_TTY:-0}" != "1" ]; then
    printf '%s' "$1"
    return
  fi
  printf '\033[1m%s\033[0m' "$1"
}

# Build a copy-pasteable re-run command with flags
rerun_cmd() {
  local flags="$*"
  # Always TOKENLESS. The live API token is never baked into a URL we echo to
  # the terminal — that would put a credential into scrollback, screen-shares,
  # teed logs, CI output, and pasted issue reports (the token-in-query-string
  # form is already known to land in Cloudflare request logs). A re-run picks up
  # the saved token from ${PAXEL_TOKEN_FILE} (chmod 600); a fresh user with no
  # saved token falls through to the normal interactive auth flow.
  echo "curl -fsSL '${PAXEL_SERVER}/upload.sh' | bash -s -- ${flags}"
}

# Env-aware remediation phrase for user-facing messages. Mirrors
# AnthropicClient#rebuild_user_action / #auth_user_action
# (app/models/concerns/anthropic_client.rb:581-598): bin/upload exports
# PAXEL_CLIENT_MODE=dev, so devs get `bin/upload`-style commands; public
# curl|bash runs leave it unset and get copy-pasteable curl commands via
# rerun_cmd.
#
# `reauth` intentionally does NOT delegate to rerun_cmd in prod — a tokenless
# rerun_cmd re-loads the SAVED token (${PAXEL_TOKEN_FILE}), which on an
# AUTH_REQUIRED failure is exactly the credential we want the user to REPLACE.
# The user needs a fresh login from their dashboard.
rerun_phrase() {
  local kind="$1"
  local dev=0
  [ "${PAXEL_CLIENT_MODE:-}" = "dev" ] && dev=1
  case "$kind" in
    fresh)
      if [ "$dev" = 1 ]; then
        echo "Run bin/upload again for a fresh analysis."
      else
        echo "To re-run: $(rerun_cmd)"
      fi
      ;;
    next_upload)
      if [ "$dev" = 1 ]; then
        echo "Will retry on next bin/upload."
      else
        echo "Will retry on your next upload."
      fi
      ;;
    reauth)
      if [ "$dev" = 1 ]; then
        echo "Run bin/upload interactively to refresh your token."
      else
        echo "Re-login on your Paxel dashboard for a fresh upload command; pending uploads will retry on the next run."
      fi
      ;;
    bypass_replay)
      if [ "$dev" = 1 ]; then
        echo "Bypass with bin/upload --no-replay."
      else
        echo "To bypass: $(rerun_cmd --no-replay)"
      fi
      ;;
    *)
      echo "Re-run the upload command from your Paxel dashboard."
      echo "[paxel] internal: rerun_phrase called with unknown kind '$kind'" >&2
      return 2
      ;;
  esac
}

# After a replay-and-exit, hint that re-running analyzes any repo that didn't
# finish. The replay gate runs BEFORE child-repo detection, so when a multi-repo
# run leaves one repo's upload stashed and a sibling crashed mid-analysis (before
# it could stash), the next run replays-and-exits and the crashed sibling is never
# re-picked — the user thinks "re-running fixed it" while a report is still missing.
# Only emitted when this directory actually holds >=2 child repos, so single-repo
# replays stay quiet. Cheap: stat-only on immediate children, no git/cache scan.
multi_repo_replay_hint() {
  local _n=0
  local _c
  for _c in ./*/; do
    [ -d "$_c" ] || continue
    if [ -e "${_c}.git" ] || [ -e "${_c}.jj" ]; then
      _n=$((_n + 1))
      [ "$_n" -ge 2 ] && break
    fi
  done
  [ "$_n" -ge 2 ] || return 0
  echo "[paxel] Multiple repos here — re-run from this directory to analyze any that didn't finish."
}

# Detect a copy-on-write cp flag ONCE: --reflink=auto on GNU coreutils
# (Linux/btrfs+XFS), -c (clonefile) on BSD/macOS+APFS. Both share storage instead
# of byte-copying. --reflink=auto silently falls back to a byte copy when CoW
# isn't possible; macOS `cp -c` does NOT — it errors "clonefile failed:
# Cross-device link" (per file) when the copy crosses a volume boundary. The flag
# is PROBED on a same-volume throwaway, so `-c` can be selected even when the real
# copy will cross volumes (a symlinked ~/.claude subtree on another disk, a
# redirected ~/.paxel); _paxel_cp_transcripts retries without the flag to cover
# that. Probing (vs inferring from `cp --version`) also keeps a flag the local cp
# rejects (pre-coreutils-7.5 GNU, pre-10.12 BSD, BusyBox) from ever reaching the
# real copy. Always returns 0 (never aborts the caller).
_paxel_detect_cp_cow() {
  [ -n "${_PAXEL_CP_COW_DETECTED:-}" ] && return 0
  _PAXEL_CP_COW_DETECTED=1
  _PAXEL_CP_COW_FLAG=""
  local _t
  _t=$(mktemp -d 2>/dev/null) || return 0
  if : > "$_t/probe" 2>/dev/null; then
    if cp --reflink=auto "$_t/probe" "$_t/r" 2>/dev/null; then
      _PAXEL_CP_COW_FLAG="--reflink=auto"   # GNU coreutils
    elif cp -c "$_t/probe" "$_t/c" 2>/dev/null; then
      _PAXEL_CP_COW_FLAG="-c"               # BSD/macOS clonefile
    fi
  fi
  rm -rf "$_t" 2>/dev/null || true
  return 0
}

# Recursively copy a transcript dir, preferring the CoW clone above. Keeps -RLp on
# every path: recurse, DEREF source symlinks (-L — the trees are deliberately
# symlinked, so -a/-al would dangle them and the container would silently drop
# those sessions), preserve mtime (-p, for the container's --since File.mtime
# check). CoW makes 'analyze all' over a multi-GB ~/.claude stop byte-copying every
# repo's sessions. Returns cp's exit status verbatim so callers fail loud (the
# single-repo sites are bare under active errexit; the multi-repo site wraps it in
# `if` and routes failure to failed_repos).
_paxel_cp_transcripts() {
  _paxel_detect_cp_cow
  # Try the CoW clone, then fall back to a plain copy. macOS `cp -c` does not fall
  # back across volumes (the flag was probed same-volume), so a cross-device
  # source/dest would otherwise fail the whole repo. The retry guarantees a correct
  # copy; the plain cp's exit status is returned verbatim so callers still fail loud
  # on a genuine error.
  if [ -n "${_PAXEL_CP_COW_FLAG:-}" ]; then
    cp -RLp "${_PAXEL_CP_COW_FLAG}" "$1" "$2" 2>/dev/null && return 0
    # The CoW clone can fail PART-WAY: macOS `cp -c` creates "$2" and copies some
    # files, then errors per-file on the first cross-device clonefile. Remove the
    # partial dest before the plain retry — otherwise the plain copy sees an existing
    # dir and nests the source under "$2/$(basename "$1")", silently dropping every
    # session. Callers always pass a not-yet-existing "$2".
    rm -rf "$2" 2>/dev/null || true
  fi
  cp -RLp "$1" "$2"
}

# Count JSONL session files in a directory (excludes subagents, _git, _metadata).
# Counts Claude-style JSONLs only (one file per session, flat layout). Codex
# sessions use YYYY/MM/DD subdirs and are counted by the collect_* paths that
# write them into the upload archive.
count_sessions() {
  local dir="$1"
  # Guard a missing dir (e.g. a Codex/Cursor-only user with no ~/.claude/projects):
  # `find` on a nonexistent path exits non-zero, which under `set -Eeuo pipefail`
  # aborts the whole upload (CLIENT-F / kalyanprakash). `|| true` also absorbs a
  # mid-walk permission error on an existing tree.
  [ -d "$dir" ] || { echo 0; return 0; }
  { find "$dir" -name "*.jsonl" -not -name "_*" -not -path "*/_git/*" -not -path "*/subagents/*" -maxdepth 3 2>/dev/null || true; } | wc -l | tr -d ' '
}

count_subagent_sessions() {
  local dir="$1"
  [ -d "$dir" ] || { echo 0; return 0; }
  { find "$dir" -path "*/subagents/*.jsonl" -maxdepth 5 2>/dev/null || true; } | wc -l | tr -d ' '
}

# Returns data size in MB for display
get_data_size() {
  local dir="$1"
  du -sm "$dir" 2>/dev/null | cut -f1 || echo "0"
}

# Estimate client-side pipeline time in minutes from session count.
# Cloud-only model calibrated 2026-04-25 (cloud Haiku via proxy, no Ollama).
# Dominant cost is 3 LLM steps (summarize, decisions, scoring) at 20-thread
# parallelism. ~0.85s/session fresh, near-zero when cached.
# Calibration: 1082 sessions → 947s actual (15m 47s).
#
# Segments (continuous at boundaries):
#   s <= 30:       30 + s*3        overhead dominates (parsing, git, upload)
#   30 < s <= 200: 120 + (s-30)*1  LLM parallelism kicks in
#   s > 200:       290 + (s-200)*1 sustained ~1s/session
#
# SYNC: keep in sync with estimate_processing_time() in results_helper.rb
estimate_time() {
  local s=$1
  local total_secs
  if [ "$s" -le 30 ]; then
    total_secs=$((30 + s * 3))
  elif [ "$s" -le 200 ]; then
    total_secs=$((120 + (s - 30) * 1))
  else
    total_secs=$((290 + (s - 200) * 1))
  fi

  local minutes=$(( (total_secs + 59) / 60 ))
  [ "$minutes" -lt 2 ] && minutes=2
  echo "$minutes"
}

# Print time estimate with session count, data size, and email notice.
# `codex_count` here is standalone Codex (the user invoked `codex` directly).
# `codex_cross_tool_count` is Codex sessions launched by Claude via codex-companion
# (or other tool); the caller folds these into `subagent_count` so the header math
# (Found N sessions + M subagents) does not double-count.
print_estimate() {
  local sessions=$1
  local data_mb=$2
  local claude_count=${3:-0}
  local codex_count=${4:-0}
  local codex_cross_tool_count=${5:-0}
  local project_name=${6:-}
  local subagent_count=${7:-0}
  local total=$((sessions + subagent_count))
  local minutes
  minutes=$(estimate_time "$total")
  ESTIMATED_MINUTES="$minutes"
  echo ""
  local label=""
  if [ -n "$project_name" ]; then
    label=" for ${project_name}"
  fi
  local session_word="sessions"
  [ "$sessions" -eq 1 ] && session_word="session"
  local prefix="Found ${sessions} ${session_word}"
  if [ "$subagent_count" -gt 0 ]; then
    local sub_word="subagent"
    [ "$subagent_count" -gt 1 ] && sub_word="subagents"
    prefix="${prefix} + ${subagent_count} ${sub_word}"
  fi
  prefix="${prefix}${label} (${data_mb}MB)."
  echo "${prefix} Estimated time: ~${minutes} minutes."
  if [ "$claude_count" -gt 0 ]; then
    echo "  Claude Code: ${claude_count} sessions"
  fi
  if [ "$codex_count" -gt 0 ]; then
    echo "  Codex CLI: ${codex_count} sessions"
  fi
  if [ "$codex_cross_tool_count" -gt 0 ]; then
    echo "  Codex launched by Claude: ${codex_cross_tool_count} sessions"
  fi
  echo ""
  echo "  ★  You'll get an email when your report is ready."
  echo ""
}

user_read() {
  read "$@" </dev/tty
}

require_tty() {
  if [ ! -c /dev/tty ]; then
    echo "Error: No terminal available for interactive selection." >&2
    echo "  $(rerun_cmd --project NAME)" >&2
    echo "  $(rerun_cmd --all)" >&2
    exit 1
  fi
}

# Run "$@" with a wall-clock cap so a pathological repo (a single giant or
# minified file makes `git log --numstat` compute an enormous diff) can't hang
# the whole upload forever. Prefers coreutils timeout/gtimeout; on stock macOS
# (neither present) falls back to a portable background-kill. Returns the
# command's exit status; callers append `|| true`, so a timeout degrades to a
# partial/empty metrics file rather than aborting. Override the cap with
# PAXEL_GIT_TIMEOUT. Called in `|| true` context, so set -e / the ERR trap are
# suspended inside the body (no abort on the 124/143 timeout status).
PAXEL_GIT_TIMEOUT="${PAXEL_GIT_TIMEOUT:-120}"
_run_with_timeout() {
  local _secs="$1"; shift
  if command -v timeout >/dev/null 2>&1; then
    timeout "$_secs" "$@"
  elif command -v gtimeout >/dev/null 2>&1; then
    gtimeout "$_secs" "$@"
  else
    "$@" &
    local _cmd_pid=$!
    ( sleep "$_secs"; kill -TERM "$_cmd_pid" 2>/dev/null; sleep 3; kill -KILL "$_cmd_pid" 2>/dev/null ) >/dev/null 2>&1 &
    local _watch_pid=$!
    local _rc=0
    wait "$_cmd_pid" 2>/dev/null || _rc=$?
    kill -TERM "$_watch_pid" 2>/dev/null || true
    wait "$_watch_pid" 2>/dev/null || true
    return "$_rc"
  fi
}

# Parse --since value to epoch threshold
parse_since() {
  local since_str="$1"
  local now_epoch
  now_epoch=$(date +%s)

  # Match relative durations: 6h, 7d, 2w, 1m
  case "$since_str" in
    *h)
      local hours="${since_str%h}"
      echo $(($now_epoch - $hours * 3600))
      ;;
    *d)
      local days="${since_str%d}"
      echo $(($now_epoch - $days * 86400))
      ;;
    *w)
      local weeks="${since_str%w}"
      echo $(($now_epoch - $weeks * 7 * 86400))
      ;;
    *m)
      local months="${since_str%m}"
      echo $(($now_epoch - $months * 30 * 86400))
      ;;
    *)
      # Try as absolute date (YYYY-MM-DD), interpreted as MIDNIGHT local time.
      # GNU `date -d YYYY-MM-DD` already means midnight; BSD `date -j -f "%Y-%m-%d"`
      # (no time component) fills in the CURRENT time-of-day — wrong (the cutoff
      # drifts by up to a day) and non-deterministic — so pin BSD to 00:00:00 with a
      # full format. BSD/GNU syntaxes are mutually incompatible (each exits 1 on the
      # other's flags); GNU is tried first to match the stat-order convention here.
      local epoch
      epoch=$(date -d "$since_str" "+%s" 2>/dev/null) \
        || epoch=$(date -j -f "%Y-%m-%d %H:%M:%S" "$since_str 00:00:00" "+%s" 2>/dev/null)
      if [ -n "$epoch" ]; then
        echo "$epoch"
        return
      fi
      echo "Error: Invalid --since format: $since_str (use 6h, 7d, 2w, 1m, or YYYY-MM-DD)" >&2
      exit 1
      ;;
  esac
}

# Extract human-readable repo name from remote URL
remote_display_name() {
  local remote_url="$1"
  # "git@github.com:example-org/example-repo.git" -> "example-repo"
  # "https://github.com/user/repo.git" -> "repo"
  local name
  name=$(echo "$remote_url" | sed 's/\.git$//' | sed 's|.*[/:]||')
  echo "$name"
}

# Extract real filesystem path from a project directory
get_project_cwd() {
  local project_dir_name="$1"
  local project_dir="$CLAUDE_DIR/$project_dir_name"
  local index_file="$project_dir/sessions-index.json"

  # 1. Try sessions-index.json originalPath
  if [ -f "$index_file" ]; then
    local original_path=""
    if command -v jq &>/dev/null; then
      # Handle both array format and {version, entries} format
      original_path=$(jq -r '
        if type == "array" then
          .[0].originalPath // empty
        elif type == "object" then
          (.entries // [])[0].originalPath // empty
        else empty end
      ' "$index_file" 2>/dev/null || true)
    fi
    if [ -z "$original_path" ]; then
      # grep fallback
      original_path=$(grep -o '"originalPath":"[^"]*"' "$index_file" 2>/dev/null | head -1 | sed 's/"originalPath":"//;s/"$//' || true)
    fi
    if [ -n "$original_path" ]; then
      echo "$original_path"
      return
    fi
  fi

  # 2. Scan first JSONL for cwd field (skip queue-operation lines)
  local first_jsonl
  first_jsonl=$(find "$project_dir" -name "*.jsonl" -maxdepth 1 -size +0 -print -quit 2>/dev/null || true)
  if [ -n "$first_jsonl" ]; then
    local cwd=""
    while IFS= read -r line; do
      # Skip queue-operation lines
      case "$line" in
        *'"type":"queue-operation"'*) continue ;;
      esac
      # Try to extract cwd
      local maybe_cwd
      maybe_cwd=$(echo "$line" | grep -o '"cwd":"[^"]*"' | head -1 | sed 's/"cwd":"//;s/"$//' || true)
      if [ -n "$maybe_cwd" ]; then
        cwd="$maybe_cwd"
        break
      fi
    done < "$first_jsonl"
    if [ -n "$cwd" ]; then
      echo "$cwd"
      return
    fi
  fi

  # 3. Fallback: decode from dir name
  echo ""
}

# Returns 0 when this Codex session should count toward the picker's session
# total (N), 1 when it should count toward the subagent total (M).
#
# Picker semantics deliberately differ from cross_tool_linker.rb#STANDALONE_ORIGINATORS:
# only "Claude Code"-originated Codex sessions are bucketed as cross-tool,
# because CrossToolLinker only assigns triggered_by_id for Claude-origin
# parents (cross_tool_linker.rb:113-127). Cursor / unknown / future launchers
# stay as logical_roots server-side, so the picker must count them as sessions
# to avoid undercounting + the zero-abort path on Cursor-only Codex users.
#
# Implicit accept list (catch-all): "" (empty, pre-detector-fix sessions),
# codex_cli_rs / codex_exec / codex-tui (server STANDALONE_ORIGINATORS),
# codex_cli (v0.92 flat format), Cursor, unknown.
codex_originator_is_standalone() {
  case "$1" in
    "Claude Code") return 1 ;;
    *) return 0 ;;
  esac
}

# Read originator from a Codex JSONL first line. Independent helper — does NOT
# refactor get_codex_session_remote / get_codex_session_cwd, which are on the
# upload-extraction critical path (collect_codex_sessions). Reads
# .payload.originator OR top-level .originator (v0.92 flat format).
get_codex_session_originator() {
  local jsonl_file="$1"
  local first_line=""
  IFS= read -r first_line < "$jsonl_file" 2>/dev/null || true
  [ -z "$first_line" ] && echo "" && return
  if command -v jq >/dev/null 2>&1; then
    # jq <1.7 on Windows emits CRLF like sqlite3.exe; strip the \r $() keeps.
    local _orig
    _orig=$(printf '%s' "$first_line" | jq -r '(.payload // .).originator // empty' 2>/dev/null || echo "")
    printf '%s\n' "${_orig//$'\r'/}"
  else
    # grep fallback — handles both nested and top-level originator since
    # the field key is the same. The trailing `|| true` mirrors sibling
    # helpers (get_codex_session_remote line ~514) and is critical: without
    # it, a Codex JSONL whose first line lacks `"originator":"…"` makes grep
    # exit 1 → pipeline fails under set -o pipefail → _paxel_on_error ERR
    # trap fires → upload aborts. Exact failure mode for jq-absent users
    # with even one malformed/partial session file in ~/.codex/sessions/.
    printf '%s' "$first_line" | grep -o '"originator":"[^"]*"' 2>/dev/null \
      | head -1 | sed 's/.*":"//;s/"$//' || true
  fi
}

# Extract git remote URL from a Codex JSONL file's session_meta (first line).
# Falls through to the session's cwd if repository_url is absent: live cwd
# uses git-remote directly; dead cwd routes through resolve_remote_for_dead_cwd
# so orphan Codex sessions group under their real repo.
get_codex_session_remote() {
  local jsonl_file="$1"
  local first_line=""
  IFS= read -r first_line < "$jsonl_file" 2>/dev/null || true
  [ -z "$first_line" ] && echo "" && return

  local remote=""
  if command -v jq &>/dev/null; then
    remote=$(echo "$first_line" | jq -r '(.payload // .).git.repository_url // empty' 2>/dev/null || true)
    remote=${remote//$'\r'/}  # jq <1.7 on Windows emits CRLF; a \r-only value would skip the cwd fallback
  fi
  if [ -z "$remote" ]; then
    # grep fallback for repository_url
    remote=$(echo "$first_line" | grep -o '"repository_url":"[^"]*"' | sed 's/"repository_url":"//;s/"$//' 2>/dev/null || true)
  fi

  if [ -z "$remote" ]; then
    local cwd
    cwd=$(get_codex_session_cwd "$jsonl_file")
    if [ -n "$cwd" ]; then
      if [ -e "$cwd" ]; then
        remote=$(get_git_remote "$cwd")
      else
        remote=$(resolve_remote_for_dead_cwd "$cwd")
      fi
    fi
  fi

  # Normalize raw repository_url paths (jq/grep above); get_git_remote and
  # resolve_remote_for_dead_cwd already return normalized, so this is a no-op
  # for those branches.
  normalize_remote "$remote"
}

# Extract working directory from a Codex JSONL file's session_meta (first line)
get_codex_session_cwd() {
  local jsonl_file="$1"
  local first_line=""
  IFS= read -r first_line < "$jsonl_file" 2>/dev/null || true
  [ -z "$first_line" ] && echo "" && return

  if command -v jq &>/dev/null; then
    local cwd
    cwd=$(echo "$first_line" | jq -r '(.payload // .).cwd // empty' 2>/dev/null || true)
    cwd=${cwd//$'\r'/}  # jq <1.7 on Windows emits CRLF
    if [ -n "$cwd" ]; then
      echo "$cwd"
      return
    fi
  fi

  # grep fallback
  local cwd
  cwd=$(echo "$first_line" | grep -o '"cwd":"[^"]*"' | sed 's/"cwd":"//;s/"$//' 2>/dev/null || true)
  echo "$cwd"
}

# True (0) when a session's cwd is within scope_cwd (equal, or a descendant). Lets a
# no-remote scoped run (a home/parent-dir auto-detect — C6) keep only the sessions
# actually under that dir (the home SUBTREE), instead of pulling every machine-wide
# orphan. String-prefix on the recorded cwd (cheap, dead-cwd-safe); scope_cwd is
# canonical ($(pwd -P)). Returns 1 (out of scope) when either side is empty. Stays
# inside `case`/explicit returns so it's safe under set -Eeuo pipefail + the ERR trap.
_paxel_cwd_in_scope() {
  local session_cwd="$1" scope="$2"
  [ -n "$scope" ] || return 1
  [ -n "$session_cwd" ] || return 1
  case "$session_cwd" in
    "$scope") return 0 ;;
    "$scope"/*) return 0 ;;
    *) return 1 ;;
  esac
}

# Emit 6 chars of stable hex over $1. Tries md5sum (Linux) then md5 (macOS),
# falls back to "000000" if neither is available. Used to disambiguate
# per-remote / per-workspace bucket directories that share a basename.
stable_hash6() {
  if command -v md5sum >/dev/null 2>&1; then
    printf '%s' "$1" | md5sum | cut -c1-6
  elif command -v md5 >/dev/null 2>&1; then
    printf '%s' "$1" | md5 | cut -c1-6
  else
    echo "000000"
  fi
}

# Compute a stable per-remote bucket dir name for a Codex session.
# Returns "_codex_unattributed" when the remote is empty, otherwise
# "_codex_<slug>_<hash6>" where <slug> is a sanitized repo basename and
# <hash6> is 6 chars of md5 over the raw remote (stable across runs,
# collision-safe across different repos that share a basename).
# codex_bucket_name <remote> [session_cwd] [scope_cwd]
# With a remote → "_codex_<slug>_<hash6(remote)>" (groups by repo). With no remote:
# in a SCOPED run (scope_cwd set + the session cwd in scope) → "_codex_<basename>_
# <hash6(cwd)>" so the no-remote session surfaces as a real cwd-named Project (the
# server reads the sidecar cwd for its path); otherwise (--all machine-wide orphans)
# → "_codex_unattributed" (the dropped catch-all — anti-scatter).
codex_bucket_name() {
  local remote="$1"
  local session_cwd="${2:-}"
  local scope_cwd="${3:-}"
  if [ -n "$remote" ]; then
    local slug
    slug=$(basename "$remote" .git)
    # Sanitize to filesystem-safe chars, collapse runs of '-'
    slug=$(printf '%s' "$slug" | tr -c 'A-Za-z0-9_.-' '-' | sed 's/--*/-/g; s/^-//; s/-$//')
    [ -z "$slug" ] && slug="repo"
    echo "_codex_${slug}_$(stable_hash6 "$remote")"
    return
  fi
  if [ -n "$scope_cwd" ] && [ -n "$session_cwd" ] && _paxel_cwd_in_scope "$session_cwd" "$scope_cwd"; then
    local cslug
    cslug=$(basename "$session_cwd")
    cslug=$(printf '%s' "$cslug" | tr -c 'A-Za-z0-9_.-' '-' | sed 's/--*/-/g; s/^-//; s/-$//')
    [ -z "$cslug" ] && cslug="repo"
    echo "_codex_${cslug}_$(stable_hash6 "$session_cwd")"
    return
  fi
  echo "_codex_unattributed"
}

# ── Cursor IDE helpers ──

# Resolve workspace path from a Cursor workspaceStorage directory.
# Each workspace dir has a workspace.json with a "folder" URI (file:///path/to/project).
get_cursor_workspace_path() {
  local ws_dir="$1"
  local ws_json="$ws_dir/workspace.json"
  [ ! -f "$ws_json" ] && echo "" && return

  if command -v jq &>/dev/null; then
    local folder
    folder=$(jq -r '.folder // empty' "$ws_json" 2>/dev/null || true)
    folder=${folder//$'\r'/}  # jq <1.7 on Windows emits CRLF
    if [ -n "$folder" ]; then
      # Strip file:// prefix
      echo "$folder" | sed 's|^file://||'
      return
    fi
  fi

  # grep fallback
  local folder
  folder=$(grep -o '"folder":"[^"]*"' "$ws_json" | sed 's/"folder":"//;s/"$//' 2>/dev/null || true)
  echo "$folder" | sed 's|^file://||'
}

# ── Cursor agent-transcripts (~/.cursor/projects) helpers ──
#
# Current Cursor versions no longer write chats to state.vscdb's cursorDiskKV
# table (extract_cursor_db reports "Your version of Cursor may store data
# differently"); they write one JSONL transcript per agent session under
# ~/.cursor/projects/<encoded-cwd>/agent-transcripts/. Two layouts exist:
#   flat:   agent-transcripts/<session-id>.jsonl              (current)
#   nested: agent-transcripts/<session-id>/<session-id>.jsonl (older mirror)
# Subagent transcripts live at agent-transcripts/<parent>/subagents/<child>.jsonl
# and are re-laid like Claude/opencode subagent files, never counted as main
# sessions. Transcript lines are near-Anthropic content blocks
# ({"role","message":{"content":[…]}}) plus {"type":"turn_ended"} markers; they
# carry NO tool results and NO timestamps (file mtime is the only time signal),
# so the state.vscdb extraction stays the primary source and wins the
# per-session-id dedupe — this path only adds sessions the DBs don't have.

# Cursor encodes a workspace path into its ~/.cursor/projects dir name by
# collapsing every run of non-alphanumeric characters to a single "-" and
# dropping the leading one (probed on Cursor 3.10: /a/b---c -> a-b-c). The
# encoding is LOSSY ("a---b" and "a-b" collide), so decoding a dir name alone
# can't be authoritative — matching known workspace paths comes first.
cursor_projects_encode() {
  printf '%s' "$1" | sed -E 's|[^A-Za-z0-9]+|-|g; s|^-||; s|-$||'
}

# Minimal %XX decoder for workspace.json folder URIs (spaces arrive as %20).
_cursor_urldecode() {
  case "$1" in
    *%*) printf '%b' "${1//\%/\\x}" 2>/dev/null || printf '%s' "$1" ;;
    *) printf '%s' "$1" ;;
  esac
}

# Map ~/.cursor/projects dir names back to workspace paths by encoding every
# path Cursor's workspaceStorage knows (workspace.json is still written per
# window on current Cursor versions, even though composerData is not) and
# matching the dir name exactly. "enc<TAB>path" lines in a global (bash 3.2 —
# no associative arrays). MEMO CAVEAT: cursor_project_dir_to_workspace is
# always invoked in $(...) subshells, where globals set on a miss die with
# the subshell — every loop that resolves project dirs MUST warm the map by
# calling load_cursor_workspace_map in the PARENT shell first, or the map is
# rebuilt (one jq per workspace.json) per project dir. Same footgun as the
# prescan memo below (grep "must be called as a condition").
_CURSOR_PROJ_MAP=""
_CURSOR_PROJ_MAP_LOADED=0
# Every composerId the state.vscdb extraction has SEEN this collection run
# (recorded pre --since/--project filtering; "|id|id|" set, reset at the top
# of collect_cursor_sessions). The transcripts tree defers to the DBs for any
# id in here — see collect_cursor_project_transcripts.
_CURSOR_DB_SEEN_IDS="|"
load_cursor_workspace_map() {
  [ "$_CURSOR_PROJ_MAP_LOADED" -eq 1 ] && return 0
  _CURSOR_PROJ_MAP_LOADED=1
  [ -d "${CURSOR_DIR:-}" ] || return 0
  local ws_dir p enc tab
  tab=$(printf '\t')
  for ws_dir in "$CURSOR_DIR"/*/; do
    [ -f "${ws_dir}workspace.json" ] || continue
    p=$(get_cursor_workspace_path "${ws_dir%/}")
    [ -z "$p" ] && continue
    p=$(_cursor_urldecode "$p")
    # "/c:/Users/.." (Windows drive path with a leading slash) -> "c:/Users/.."
    # so downstream [ -e ] / git -C checks work under Git Bash. Mirrors
    # _vscode_decode_folder_uri. The ENCODED form is identical either way
    # (the collapse eats "/" and ":" alike), so only the map VALUE needs it.
    case "$p" in
      /[A-Za-z]:/*) p="${p#/}" ;;
    esac
    enc=$(cursor_projects_encode "$p")
    [ -z "$enc" ] && continue
    _CURSOR_PROJ_MAP="${_CURSOR_PROJ_MAP}${enc}${tab}${p}
"
  done
  return 0
}

# Reverse the lossy dir-name encoding by walking the live filesystem: each "-"
# either extends the current path segment ("-", "_", ".") or starts a new one
# ("/"). Prefix candidates that match nothing on disk are pruned, so the
# branching stays cheap. Dead paths can't be decoded this way — those are
# covered by the workspace.json map above.
_cursor_decode_walk() {
  local cur="$1" rest="$2"
  if [ -z "$rest" ]; then
    if [ -d "$cur" ]; then printf '%s\n' "$cur"; return 0; fi
    return 1
  fi
  local head="${rest%%-*}" tail="" sep cand probe
  [ "$rest" != "$head" ] && tail="${rest#*-}"
  for sep in / - _ .; do
    cand="${cur}${sep}${head}"
    probe=""
    for probe in "$cand"*; do break; done
    [ -e "$probe" ] || continue
    if _cursor_decode_walk "$cand" "$tail"; then return 0; fi
  done
  return 1
}

# Resolve a ~/.cursor/projects dir name to its workspace path. Empty output =
# unattributable (numeric window ids, "empty-window", deleted paths that
# workspaceStorage never saw).
cursor_project_dir_to_workspace() {
  local enc="$1"
  [ -z "$enc" ] && return 0
  case "$enc" in
    empty-window) return 0 ;;
    *[!A-Za-z0-9-]*) return 0 ;;
  esac
  # All-digit names are windows that never had a folder open.
  case "$enc" in *[!0-9]*) : ;; *) return 0 ;; esac
  load_cursor_workspace_map
  local hit
  hit=$(printf '%s' "$_CURSOR_PROJ_MAP" | awk -F '\t' -v e="$enc" '$1 == e { print $2; exit }' || true)
  if [ -n "$hit" ]; then
    printf '%s\n' "$hit"
    return 0
  fi
  _cursor_decode_walk "" "$enc" || true
}

# Conductor dead-workspace cache fallback shared by the state.vscdb and
# agent-transcripts paths. resolve_remote_for_dead_cwd short-circuits
# */conductor/workspaces/* and */.conductor/* paths (Conductor recovery needs
# sibling-workspace data, not an ancestor walk); list_projects_grouped's
# backfill_conductor_remotes pre-pass writes sibling remotes into the project
# cache. Scan it for a TRUE sibling (exact parent-dir match — the Claude
# encoding `[/.]→-` is lossy, so a prefix match would conflate sibling
# Conductor projects with shared prefixes like "paxel" vs "paxel-v2").
_cursor_conductor_cache_remote() {
  local ws="$1"
  local _normalized_ws="${ws%/}"
  local _ws_parent=""
  case "$_normalized_ws" in
    */conductor/workspaces/*/*) _ws_parent="${_normalized_ws%/*}" ;;
    */.conductor/*) _ws_parent="${_normalized_ws%%/.conductor/*}/.conductor" ;;
  esac
  [ -z "$_ws_parent" ] && return 0
  local _cache_file="${HOME}/.paxel/cache/project-remotes-v2.tsv"
  [ -f "$_cache_file" ] || return 0
  local _dir _key _rest _row_cwd
  while IFS=$'\t' read -r _dir _key _rest; do
    [ -z "$_key" ] && continue
    case "$_key" in name:*|local:*|unknown) continue ;; esac
    _row_cwd=$(get_project_cwd "$_dir" 2>/dev/null || true)
    [ -z "$_row_cwd" ] && continue
    if [ "${_row_cwd%/*}" = "$_ws_parent" ]; then
      printf '%s\n' "$_key"
      return 0
    fi
  done < "$_cache_file"
  return 0
}

# Resolve the git remote for a Cursor workspace path — live paths via
# get_git_remote (already normalized), dead ones via the recovery resolver
# plus the Conductor cache fallback.
cursor_workspace_remote() {
  local ws="$1"
  [ -z "$ws" ] && return 0
  if [ -e "$ws" ]; then
    get_git_remote "$ws"
    return 0
  fi
  local r
  r=$(resolve_remote_for_dead_cwd "$ws" || true)
  [ -z "$r" ] && r=$(_cursor_conductor_cache_remote "$ws")
  [ -n "$r" ] && printf '%s\n' "$r"
  return 0
}

# Print the MAIN session transcripts under one agent-transcripts dir, covering
# both layouts. Anything under subagents/ is excluded (re-laid per-parent by
# the collector); a nested file that isn't self-named isn't a session.
list_cursor_project_transcripts() {
  local at_dir="$1" f sid pd
  find "$at_dir" -maxdepth 1 -name '*.jsonl' 2>/dev/null || true
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    sid=$(basename "$f" .jsonl)
    pd=$(basename "$(dirname "$f")")
    [ "$pd" = "$sid" ] && printf '%s\n' "$f"
  done < <(find "$at_dir" -mindepth 2 -maxdepth 2 -name '*.jsonl' ! -path '*/subagents/*' 2>/dev/null || true)
  return 0
}

# Cheap main-session count for one project dir's agent-transcripts tree.
# Used by the picker group fold in list_projects_grouped.
cursor_project_transcript_count() {
  list_cursor_project_transcripts "$1" | { grep -c . || true; }
}

# Recover a workspace for transcripts whose project dir can't be mapped
# (numeric window ids, "empty-window"): walk each Shell tool call's
# working_directory up to its git/jj root and adopt the root ONLY if every
# command agrees on it — the same all-must-agree rule as the state.vscdb
# path's fileSelections walk, so a stray cross-repo command can't
# mis-attribute the session.
_cursor_transcript_guess_ws() {
  local f="$1"
  local _cand_root="" _wd _p _prev_p _root
  while IFS= read -r _wd; do
    [ -z "$_wd" ] && continue
    _p="$_wd" _root="" _prev_p=""
    while [ -n "$_p" ] && [ "$_p" != "/" ] && [ "$_p" != "." ] && [ "$_p" != "$_prev_p" ]; do
      if [ -e "$_p/.git" ] || [ -d "$_p/.jj" ]; then _root="$_p"; break; fi
      _prev_p="$_p"
      _p=$(dirname "$_p")
    done
    [ -z "$_root" ] && continue
    if [ -z "$_cand_root" ]; then
      _cand_root="$_root"
    elif [ "$_cand_root" != "$_root" ]; then
      return 0
    fi
  done < <(jq -r -R 'fromjson? | objects | select(.role == "assistant") | .message.content[]? | objects | select(.type == "tool_use") | (.input | objects | .working_directory) // empty | strings' "$f" 2>/dev/null | tr -d '\r' | sort -u || true)
  [ -n "$_cand_root" ] && printf '%s\n' "$_cand_root"
  return 0
}

# Find a session's transcript in the ~/.cursor/projects tree (flat or nested,
# never subagents/). Empty when the tree doesn't have it.
_cursor_mirror_transcript_for_session() {
  local cid="$1"
  [ -n "$cid" ] || return 0
  [ -d "${CURSOR_PROJECTS_DIR:-}" ] || return 0
  case "$cid" in *[!A-Za-z0-9._-]*) return 0 ;; esac
  # depth 3 = flat <enc>/agent-transcripts/<sid>.jsonl,
  # depth 4 = nested <enc>/agent-transcripts/<sid>/<sid>.jsonl
  find "$CURSOR_PROJECTS_DIR" -maxdepth 4 -name "${cid}.jsonl" ! -path '*/subagents/*' -print -quit 2>/dev/null || true
}

# Workspace recovery via the transcript tree, for DB sessions whose
# workspaceIdentifier is null and whose fileSelections walk failed: the
# transcript's project dir NAMES the workspace (map match / decode), and
# failing that the transcript content may (Shell working_directory
# agreement). Called BEFORE extract_cursor_db's selected_remote filter, so
# --project uploads keep the full-fidelity DB extraction instead of losing
# the session (it would otherwise stay unattributed and be filtered out).
_cursor_mirror_ws_for_session() {
  local cid="$1"
  local mf enc ws
  mf=$(_cursor_mirror_transcript_for_session "$cid")
  [ -z "$mf" ] && return 0
  enc="${mf#"${CURSOR_PROJECTS_DIR:-}/"}"
  enc="${enc%%/*}"
  ws=$(cursor_project_dir_to_workspace "$enc" || true)
  [ -z "$ws" ] && ws=$(_cursor_transcript_guess_ws "$mf" || true)
  [ -n "$ws" ] && printf '%s\n' "$ws"
  return 0
}

# Re-lay one session's tree subagent transcripts
# (agent-transcripts/<sid>/subagents/*.jsonl) at
# <bucket_dir>/<sid>/subagents/<child>.jsonl — the layout Claude/opencode/
# Gemini subagent files use, so the server links them as children with zero
# changes. Also runs for sessions the DB extraction already emitted (the DBs
# never carry these children); ws/remote stamp the children's _cursor_meta.
_cursor_relay_subagents() {
  local at_dir="$1" sid="$2" bucket_dir="$3" ws="$4" remote="$5"
  [ -d "$at_dir/$sid/subagents" ] || return 0
  local sub_src sub_sid sub_mtime
  while IFS= read -r sub_src; do
    [ -z "$sub_src" ] && continue
    sub_sid=$(basename "$sub_src" .jsonl)
    case "$sub_sid" in *[!A-Za-z0-9._-]*) continue ;; esac
    [ -f "$bucket_dir/$sid/subagents/${sub_sid}.jsonl" ] && continue
    sub_mtime=$(stat -c %Y "$sub_src" 2>/dev/null || stat -f %m "$sub_src" 2>/dev/null || echo 0)
    mkdir -p "$bucket_dir/$sid/subagents"
    _cursor_emit_project_transcript "$sub_src" "$bucket_dir/$sid/subagents/${sub_sid}.jsonl" \
      "$sub_sid" "$ws" "$remote" "$sub_mtime" \
      || rm -f "$bucket_dir/$sid/subagents/${sub_sid}.jsonl"
  done < <(find "$at_dir/$sid/subagents" -maxdepth 1 -name '*.jsonl' 2>/dev/null || true)
  return 0
}

# Convert one agent-transcripts JSONL into the same canonical Claude-native
# shape extract_cursor_db emits (first line carries _cursor_meta; user turns
# are string-content; assistant turns are content-block arrays), so the
# server-side path — detector fall-through to claude_code, discoverer
# _cursor_meta branch, chunker — needs zero changes. The transcript tool
# names differ from the composerData ones (Shell/StrReplace vs
# run_terminal_command_v2/search_replace), hence the separate toolmap.
# $mtime (epoch seconds) stamps every line: these files carry no timestamps.
_cursor_emit_project_transcript() {
  local src="$1" dest="$2" sid="$3" ws="$4" remote="$5" mtime="$6"
  local out
  out=$(jq -c -Rs \
    --arg cid "$sid" \
    --arg ws "$ws" \
    --arg remote "$remote" \
    --arg mt "$mtime" '
    def toolmap: {
      "Shell":"Bash","Terminal":"Bash",
      "StrReplace":"Edit","MultiStrReplace":"Edit","SearchReplace":"Edit","ApplyPatch":"Edit",
      "Create":"Write",
      "ListDir":"LS"
    };
    def canon($n): if ($n|type)=="string" and ($n|length)>0 then (toolmap[$n] // $n) else "tool" end;
    def remap($name; $p):
      ($p // {}) | (if type=="object" then . else {} end)
      | if ($name=="Read" or $name=="Edit" or $name=="Write") and .path and (has("file_path")|not) then . + {file_path:.path}
        elif $name=="Glob" and .glob_pattern and (has("pattern")|not) then . + {pattern:.glob_pattern}
        else . end;
    def usertext($c):
      (if ($c|type)=="string" then $c
       elif ($c|type)=="array" then ([ $c[]? | objects | select(.type=="text") | (.text // "") | strings ] | join("\n"))
       else "" end)
      | sub("^\\s*<user_query>\\s*"; "") | sub("\\s*</user_query>\\s*$"; "");
    def ablocks($c):
      (if ($c|type)=="array" then $c else [] end)
      | [ .[]? | objects
          | if .type=="text" then (if (((.text // "")|tostring)|length) > 0 then {type:"text", text:.text} else empty end)
            elif .type=="thinking" then (if ((((.thinking // .text) // "")|tostring)|length) > 0 then {type:"thinking", thinking:(.thinking // .text)} else empty end)
            elif .type=="tool_use" then
              (canon(.name)) as $tn
              | ({type:"tool_use", name:$tn, input:remap($tn; .input)} + (if .id then {id:.id} else {} end))
            else empty end ];
    (($mt | tonumber? // 0) | todate) as $ts
    | split("\n")
    # fromjson? drops unparseable lines; `objects` drops valid-JSON scalars/arrays
    # (e.g. a bare "turn_ended" string) — without it one such line aborts the
    # whole slurped program and silently drops the ENTIRE session.
    | [ .[] | fromjson? | objects
        | if (.role=="user") and ((.message|type)=="object") then
            (usertext(.message.content // "")) as $t
            | if ($t|length) > 0 then {type:"user", message:{role:"user", content:$t}, timestamp:$ts} else empty end
          elif (.role=="assistant") and ((.message|type)=="object") then
            (ablocks(.message.content // [])) as $b
            | if ($b|length) > 0 then {type:"assistant", message:{role:"assistant", content:$b}, timestamp:$ts} else empty end
          else empty end ]
    | if length == 0 then empty
      else (.[0] += {_cursor_meta:{composerId:$cid, workspace:$ws, git_remote:$remote, agent_type:"cursor"}}) | .[]
      end
  ' "$src" 2>/dev/null || true)
  [ -z "$out" ] && return 1
  printf '%s\n' "$out" > "$dest"
}

# Collect Cursor sessions from the ~/.cursor/projects agent-transcripts tree.
# Runs AFTER the state.vscdb extraction inside collect_cursor_sessions: the DB
# rows carry tool results these transcripts lack, so when both sources have a
# session (same id — the transcript filename IS the composerId) the DB version
# wins and the transcript is skipped. Needs jq only (no sqlite3).
collect_cursor_project_transcripts() {
  local output_dir="$1"
  local selected_remote="${2:-}"

  [ -d "${CURSOR_PROJECTS_DIR:-}" ] || return 0
  command -v jq &>/dev/null || return 0

  # Warm the workspace map in THIS shell — cursor_project_dir_to_workspace
  # runs in $(...) subshells where a miss-triggered load dies with the
  # subshell, and rebuilding it per project dir is quadratic in jq forks.
  load_cursor_workspace_map

  local proj_dir at_dir enc proj_ws src sid ws remote bucket dest existing mtime
  local ex_ws ex_remote
  for proj_dir in "$CURSOR_PROJECTS_DIR"/*/; do
    [ -d "$proj_dir" ] || continue
    at_dir="${proj_dir%/}/agent-transcripts"
    [ -d "$at_dir" ] || continue
    enc=$(basename "${proj_dir%/}")
    proj_ws=$(cursor_project_dir_to_workspace "$enc" || true)

    while IFS= read -r src; do
      [ -z "$src" ] && continue
      sid=$(basename "$src" .jsonl)
      case "$sid" in *[!A-Za-z0-9._-]*) continue ;; esac

      # Already emitted (by the DB extraction, or by this tree's other
      # layout)? Keep that copy — but still relay tree subagents onto it
      # (the DBs never carry these children). The children's meta comes from
      # the emitted parent's first line so attribution stays consistent.
      existing=$(find "$output_dir" -maxdepth 2 -path "*/_cursor_*/${sid}.jsonl" -print -quit 2>/dev/null || true)
      if [ -n "$existing" ]; then
        ex_ws=$(head -1 "$existing" | jq -r '._cursor_meta.workspace // empty' 2>/dev/null || true)
        ex_remote=$(head -1 "$existing" | jq -r '._cursor_meta.git_remote // empty' 2>/dev/null || true)
        # jq <1.7 on Windows emits CRLF; these stamp the children's _cursor_meta
        ex_ws=${ex_ws//$'\r'/}; ex_remote=${ex_remote//$'\r'/}
        _cursor_relay_subagents "$at_dir" "$sid" "$(dirname "$existing")" "${ex_ws:-}" "${ex_remote:-}"
        continue
      fi

      # The DBs know this session but chose not to emit it (--since window on
      # createdAt, or the --project filter). Their verdict is authoritative —
      # never resurrect a DB-known session as a degraded tree copy.
      case "${_CURSOR_DB_SEEN_IDS:-|}" in *"|${sid}|"*) continue ;; esac

      # --since: no timestamps exist inside these files; mtime is the signal
      # (same semantics as the Codex/Gemini/VS Code collectors).
      mtime=$(stat -c %Y "$src" 2>/dev/null || stat -f %m "$src" 2>/dev/null || echo 0)
      if [ -n "${SINCE_EPOCH:-}" ] && [ "$mtime" -lt "$SINCE_EPOCH" ] 2>/dev/null; then
        continue
      fi

      ws="$proj_ws"
      [ -z "$ws" ] && ws=$(_cursor_transcript_guess_ws "$src" || true)
      remote=""
      [ -n "$ws" ] && remote=$(cursor_workspace_remote "$ws")

      if [ -n "${selected_remote:-}" ]; then
        if [ -z "$remote" ] || [ "$remote" != "${selected_remote:-}" ]; then
          continue
        fi
      fi

      bucket="_cursor_unattributed"
      [ -n "$ws" ] && bucket="_cursor_$(basename "$ws")_$(stable_hash6 "$ws")"

      mkdir -p "$output_dir/$bucket"
      dest="$output_dir/$bucket/${sid}.jsonl"
      if ! _cursor_emit_project_transcript "$src" "$dest" "$sid" "${ws:-}" "${remote:-}" "$mtime"; then
        rm -f "$dest"
        continue
      fi

      # Subagent children are excluded from the main-session count by depth
      # (the count find is -maxdepth 2 over the buckets).
      _cursor_relay_subagents "$at_dir" "$sid" "$output_dir/$bucket" "${ws:-}" "${remote:-}"
    done < <(list_cursor_project_transcripts "$at_dir")
  done
  return 0
}

# Extract Cursor sessions from a state.vscdb SQLite database into canonical JSONL.
# Writes one JSONL file per composer session to $output_dir.
# Requires sqlite3 and jq.
extract_cursor_db() {
  local db_path="$1"
  local output_dir="$2"
  local selected_remote="${3:-}"
  local ws_dir
  ws_dir=$(dirname "$db_path")

  # Return codes: 0 = extracted sessions, 1 = no data (not an error), 2 = real error

  # Validate schema
  local tables
  tables=$(sqlite3 "$db_path" ".tables" 2>/dev/null || true)
  if ! echo "$tables" | grep -q "cursorDiskKV"; then
    echo "  Warning: Could not read Cursor chat data in $(basename "$ws_dir")." >&2
    echo "  Your version of Cursor may store data differently. Skipping." >&2
    return 2
  fi

  # Check for composerData entries
  local composer_count
  composer_count=$(sqlite3 "$db_path" "SELECT COUNT(*) FROM cursorDiskKV WHERE key LIKE 'composerData:%'" 2>/dev/null || echo "0")
  composer_count=${composer_count//$'\r'/}  # Windows sqlite3.exe emits CRLF; $() keeps the \r
  if [ "$composer_count" -eq 0 ] 2>/dev/null; then
    return 1
  fi

  # Resolve workspace path and git remote
  local workspace_path
  workspace_path=$(get_cursor_workspace_path "$ws_dir")
  local git_remote=""
  if [ -n "$workspace_path" ]; then
    if [ -e "$workspace_path" ]; then
      git_remote=$(get_git_remote "$workspace_path")
    else
      # workspace.json's folder points at a deleted path; route through
      # the resolver so the ancestor / sibling-worktree recovery strategies
      # can still attribute sessions. Mirrors the per-session site below
      # (see its comment block for the full rationale).
      git_remote=$(resolve_remote_for_dead_cwd "$workspace_path" || true)
    fi
  fi

  local extracted=0

  # Dump composer rows to temp file to avoid subshell variable loss from piping
  local sqlite_out="$output_dir/.sqlite_dump"
  if ! sqlite3 "$db_path" "SELECT key, value FROM cursorDiskKV WHERE key LIKE 'composerData:%'" > "$sqlite_out"; then
    echo "  Warning: Failed to read Cursor data from $(basename "$(dirname "$db_path")")" >&2
    rm -f "$sqlite_out"
    return 2
  fi

  # Iterate over composer sessions (reading from file, not pipe)
  while IFS='|' read -r key value; do
    [ -z "$value" ] && continue

    local composer_id
    composer_id=$(echo "$value" | jq -r '.composerId // empty' 2>/dev/null || true)
    # jq <1.7 on Windows emits CRLF; a CR-tainted id poisons the output
    # filename AND the bubble key-range below (zero bubbles fetched -> the
    # whole session silently dropped).
    composer_id=${composer_id//$'\r'/}
    [ -z "$composer_id" ] && continue

    # Record the id BEFORE the --since/--project filters: the transcripts
    # tree must treat a DB-known-but-filtered session as settled, not
    # re-emit a degraded tree copy of it (see _CURSOR_DB_SEEN_IDS).
    case "$_CURSOR_DB_SEEN_IDS" in
      *"|${composer_id}|"*) ;;
      *) _CURSOR_DB_SEEN_IDS="${_CURSOR_DB_SEEN_IDS}${composer_id}|" ;;
    esac

    # Filter by --since using createdAt (milliseconds epoch)
    if [ -n "$SINCE_EPOCH" ]; then
      local created_at_ms
      created_at_ms=$(echo "$value" | jq -r '.createdAt // 0' 2>/dev/null || echo "0")
      created_at_ms=${created_at_ms//$'\r'/}  # a \r here is a FATAL arithmetic error
      local created_at_s
      created_at_s=$(( created_at_ms / 1000 )) 2>/dev/null || created_at_s=0
      if [ "$created_at_s" -lt "$SINCE_EPOCH" ] 2>/dev/null; then
        continue
      fi
    fi

    # Resolve per-session workspace from composerData (global DB has mixed workspaces)
    local session_ws=""
    session_ws=$(echo "$value" | jq -r '.workspaceIdentifier.uri.fsPath // empty' 2>/dev/null || true)
    session_ws=${session_ws//$'\r'/}  # a \r fails [ -e ] for a live workspace
    # Recover the workspace when Cursor didn't record workspaceIdentifier.uri.fsPath
    # (common for global-DB sessions that outlived their workspace, so they got
    # silently dropped — PAXEL cursor-missed). Walk each file the session
    # referenced up to its enclosing git/jj root; adopt a root ONLY if every
    # referenced file agrees on it, so a stray cross-repo file selection can't
    # mis-attribute the session to the wrong repo (Opus review).
    if [ -z "$session_ws" ]; then
      local _cand_root="" _agree=1 _c
      while IFS= read -r _c; do
        [ -z "$_c" ] && continue
        # Stop at "/", "." and any idempotent root (Git Bash `dirname C:` == `C:`)
        # so a Windows drive-root path can't spin this walk forever.
        local _p="$_c" _root="" _prev_p=""
        while [ -n "$_p" ] && [ "$_p" != "/" ] && [ "$_p" != "." ] && [ "$_p" != "$_prev_p" ]; do
          if [ -e "$_p/.git" ] || [ -d "$_p/.jj" ]; then _root="$_p"; break; fi
          _prev_p="$_p"
          _p=$(dirname "$_p")
        done
        [ -z "$_root" ] && continue
        if [ -z "$_cand_root" ]; then
          _cand_root="$_root"
        elif [ "$_cand_root" != "$_root" ]; then
          _agree=0
          break
        fi
      done < <(echo "$value" | jq -r '(.context.fileSelections[]?.uri.fsPath // empty), (.allAttachedFileCodeChunksUris[]? | sub("^file://"; ""))' 2>/dev/null | tr -d '\r' || true)
      [ "$_agree" -eq 1 ] && session_ws="$_cand_root"
    fi
    # Current-Cursor fallback: the ~/.cursor/projects transcript tree can
    # name this session's workspace when the DB row can't — its project dir
    # encodes the cwd (and the transcript content carries working
    # directories). Runs before the selected_remote filter below so a
    # --project upload keeps the full-fidelity DB extraction instead of
    # dropping the session as unattributed.
    if [ -z "$session_ws" ]; then
      session_ws=$(_cursor_mirror_ws_for_session "$composer_id")
    fi
    [ -z "$session_ws" ] && session_ws="$workspace_path"

    local session_remote="$git_remote"
    if [ -n "$session_ws" ] && [ "$session_ws" != "$workspace_path" ]; then
      if [ -e "$session_ws" ]; then
        session_remote=$(get_git_remote "$session_ws")
      else
        # session_ws is a non-empty path but not on disk (deleted workspace,
        # moved repo). Ancestor-walk / sibling-worktree recovery via
        # resolve_remote_for_dead_cwd. Non-Conductor scope only — Conductor
        # paths short-circuit inside the resolver. get_git_remote (called
        # inside the resolver on live parents) already normalizes, so the
        # return value matches the normalized $selected_remote directly.
        # Stderr NOT suppressed: the resolver's `[paxel] Recovered remote`
        # log is load-bearing debug signal for users troubleshooting "why
        # didn't my Cursor session match?" — matches other call sites.
        session_remote=$(resolve_remote_for_dead_cwd "$session_ws" || true)
      fi

      # Conductor dead-workspace cache fallback — see
      # _cursor_conductor_cache_remote (shared with the agent-transcripts path).
      if [ -z "$session_remote" ] && [ ! -e "$session_ws" ]; then
        session_remote=$(_cursor_conductor_cache_remote "$session_ws")
      fi
    fi

    # Filter by selected_remote (per-session, not per-DB)
    if [ -n "${selected_remote:-}" ]; then
      if [ -z "$session_remote" ] || [ "$session_remote" != "${selected_remote:-}" ]; then
        continue
      fi
    fi

    # Get bubble IDs from fullConversationHeadersOnly
    local bubble_ids
    bubble_ids=$(echo "$value" | jq -r '.fullConversationHeadersOnly[]? | .bubbleId' 2>/dev/null || true)
    [ -z "$bubble_ids" ] && continue

    # Write to per-workspace subdirectory (use path hash to avoid basename collisions)
    local ws_bucket="_cursor_unattributed"
    if [ -n "$session_ws" ]; then
      ws_bucket="_cursor_$(basename "$session_ws")_$(stable_hash6 "$session_ws")"
    fi
    mkdir -p "$output_dir/$ws_bucket"
    local session_file="$output_dir/$ws_bucket/${composer_id}.jsonl"
    [ -f "$session_file" ] && continue  # dedupe: per-workspace DB wins over global DB
    # Batch the per-bubble work into ONE sqlite3 + ONE jq for the whole session.
    # The per-bubble version ran 2 sqlite3 + 2 jq + 1 date PER bubble; on a large
    # global DB (1.5GB, 1000+ bubbles/session) that was ~5 forks * tens of thousands
    # of bubbles, each sqlite3 re-opening the whole DB — it crawled to an effective
    # hang (PAXEL: Cursor extraction hangs, vanshgupta027). Output is byte-identical
    # to the per-bubble path (validated vs real Cursor DBs). The fallback bare-key
    # lookup (bubbleId:<id> without composer prefix) is preserved below.
    local bubbles_dump="$output_dir/.cursor_bubbles_dump"
    # Fetch all of this composer's bubbles in TWO statements (one per key form), NOT a
    # single OR'd query. Two key forms exist: the modern composer-scoped
    # 'bubbleId:<composer>:<bubble>' and the legacy bare 'bubbleId:<bubble>' (the
    # per-bubble path looked up both). NEITHER statement needs the SQLite JSON1
    # extension — important because a single OR'd json_each query would fail to PREPARE
    # on a JSON1-less sqlite build and, under 2>/dev/null, silently drop the WHOLE
    # session (the old per-bubble path never needed JSON1 — it already had the ids).
    #
    # Modern form: a key RANGE (NOT LIKE/GLOB): LIKE is case-insensitive so SQLite can't
    # use the BINARY UNIQUE index and full-scans the whole DB; a >=/< range uses the
    # index, and ';' (0x3B) is the byte just after ':' (0x3A) so it's the exclusive
    # upper bound for the prefix.
    #
    # Legacy bare keys: build the id list HOST-side from the parsed session headers
    # (jq on the composerData $value we already hold), then look them up with a literal
    # IN(...) — no json_each, so no JSON1 dependency. ' is the SQL string quote,
    # written as a jq escape so no literal ' breaks this bash-single-quoted jq program.
    # Cursor bubble ids are UUIDs (no quotes); the SELECT goes over STDIN (printf is a
    # bash builtin → no argv, and sqlite3 reads SQL from stdin), so a huge id list can't
    # hit ARG_MAX. Both statements stay index-driven (~0.02s even on a 1.5GB DB).
    # (Edge: since all bare ids share one IN(...) statement, a single id carrying a '
    # would make the whole statement a SQL error → 2>/dev/null drops this session's bare
    # keys as a set. Impossible for UUID ids; the modern range path is unaffected.)
    #
    # TAB-separated output, NOT -json: `sqlite3 -json` JSON-encodes the BLOB column in a
    # way that is pathologically slow (~9s to encode one large session's bubbles vs
    # ~0.02s to read them raw) — that, plus per-bubble fork overhead, was the real
    # "hang" (PAXEL: Cursor extraction hangs, vanshgupta027). Cursor stores each bubble
    # value as single-line minified JSON with no embedded tabs/newlines (verified across
    # all bubbles), so 'key<TAB>value' is one safe, parseable line per row. Caveat: a
    # value that ever did carry an embedded TAB/newline would split wrong and that one
    # bubble would be silently dropped (try/fromjson/catch null in the reduce below) —
    # graceful degradation of a single bubble, never a crash or a dropped session.
    sqlite3 -separator "$(printf '\t')" "$db_path" \
      "SELECT key, value FROM cursorDiskKV WHERE key >= 'bubbleId:${composer_id}:' AND key < 'bubbleId:${composer_id};'" \
      > "$bubbles_dump" 2>/dev/null || true
    local bare_in
    bare_in=$(printf '%s' "$value" | jq -r '
      [ (.fullConversationHeadersOnly // [])[]? | .bubbleId | select(. != null)
        | "bubbleId:" + (. | tostring) ]
      | if length == 0 then empty else (map("\u0027" + . + "\u0027") | join(",")) end
    ' 2>/dev/null || true)
    if [ -n "$bare_in" ]; then
      printf 'SELECT key, value FROM cursorDiskKV WHERE key IN (%s);\n' "$bare_in" \
        | sqlite3 -separator "$(printf '\t')" "$db_path" >> "$bubbles_dump" 2>/dev/null || true
    fi
    [ -f "$bubbles_dump" ] || : > "$bubbles_dump"

    local now_iso
    now_iso=$(date -u +%Y-%m-%dT%H:%M:%SZ)

    # composerData ($value) via stdin (avoids ARG_MAX on large sessions); the bubble
    # rows via --rawfile (parsed from the TAB-separated dump in jq below).
    local session_out
    session_out=$(printf '%s' "$value" | jq -c \
      --rawfile brows "$bubbles_dump" \
      --arg cid "$composer_id" \
      --arg ws "${session_ws:-}" \
      --arg remote "${session_remote:-}" \
      --arg now "$now_iso" '
      def toolmap: {
        "run_terminal_command_v2":"Bash","run_terminal_cmd":"Bash",
        "read_file_v2":"Read","read_file":"Read",
        "edit_file_v2":"Edit","edit_file":"Edit","search_replace":"Edit","apply_patch":"Edit","reapply":"Edit",
        "task_v2":"Task",
        "ripgrep_raw_search":"Grep","grep_search":"Grep","grep":"Grep",
        "glob_file_search":"Glob","file_search":"Glob","list_dir":"LS"
      };
      def canon($n): if ($n|type)=="string" and ($n|length)>0 then (toolmap[$n] // $n) else "tool" end;
      def remap($name; $p):
        ($p // {}) | (if type=="object" then . else {} end)
        | del(.streamingContent)
        | if $name=="Read" and .targetFile then . + {file_path:.targetFile}
          elif $name=="Edit" and .relativeWorkspacePath then . + {file_path:.relativeWorkspacePath}
          else . end;
      def tsof($b): (($b.timingInfo.clientEndTime) // ($b.createdAt)) as $t
        | if ($t|type)=="number" then (($t/1000)|floor|todate)
          elif ($t|type)=="string" then (if ($t|test("^[0-9]+$")) then ((($t|tonumber)/1000)|floor|todate) else $t end)
          else $now end;
      def bubble2objs($b):
        tsof($b) as $ts
        | ($b.toolFormerData) as $tfd
        | ($tfd.toolCallId // null) as $tcid
        | (if (($b.type)|tostring)=="2" then "assistant" else "user" end) as $role
        | if $role=="user" and ($tfd==null) then
            (if (($b.text)//"")=="" then empty
             else {type:"user", message:{role:"user", content:($b.text)}, timestamp:$ts} end)
          else
            ( (if (($b.thinking)//"")!="" then [{type:"thinking",thinking:($b.thinking)}] else [] end)
              + (if (($b.text)//"")!="" then [{type:"text",text:($b.text)}] else [] end)
              + (if $tfd then
                   (if (($tfd.params)|type)=="string" then (try (($tfd.params)|fromjson) catch null) else ($tfd.params) end) as $p
                   | (canon($tfd.name)) as $tn
                   | [ ({type:"tool_use", name:$tn, input:remap($tn;$p)} + (if $tcid then {id:$tcid} else {} end)) ]
                 else [] end) ) as $content
            | if ($content|length)==0 then empty
              else
                ( {type:"assistant", message:{role:"assistant", content:$content}, timestamp:$ts} ),
                ( if $tfd and ((($tfd.result)//"")!="") then
                    (if (($tfd.result)|type)=="string" then (try (($tfd.result)|fromjson) catch null) else ($tfd.result) end) as $rj
                    | (if ($rj|type)=="object" then (($rj.output)//($rj.contents)//($rj.result)//($tfd.result)) else ($tfd.result) end) as $rt
                    | {type:"user", message:{role:"user", content:[ ({type:"tool_result", content:(($rt|tostring)[0:4000])} + (if $tcid then {tool_use_id:$tcid} else {} end)) ]}, timestamp:$ts}
                  else empty end )
              end
          end;
      . as $cd
      | ($brows | split("\n") | map(select(length > 0) | split("\t"))) as $rows
      # Build id->bubble. Both key forms normalize to the bare bubble id, so a session
      # carrying BOTH a composer-scoped key and a bare key for the same id must PREFER
      # the scoped row (matching the per-bubble path order). Scoped rows always
      # overwrite; bare rows fill only ids not already present.
      | (reduce $rows[] as $r ({};
          ($r[0]) as $k
          | ($k | sub("^bubbleId:[^:]*:"; "") | sub("^bubbleId:"; "")) as $bid
          | ($k | test("^bubbleId:[^:]+:")) as $scoped
          | if $scoped then .[$bid] = (try ($r[1]|fromjson) catch null)
            elif (.[$bid] == null) then .[$bid] = (try ($r[1]|fromjson) catch null)
            else . end)) as $bmap
      | {composerId:$cid, workspace:$ws, git_remote:$remote, agent_type:"cursor"} as $meta
      | [ ($cd.fullConversationHeadersOnly // [])[]? | .bubbleId | select(. != null) ]
      | [ .[] as $bid | ($bmap[$bid] // null) | select(. != null) | bubble2objs(.) ]
      | if length == 0 then empty
        else (.[0] += {_cursor_meta: $meta}) | .[]
        end
      ' 2>/dev/null || true)

    if [ -n "$session_out" ]; then
      printf '%s\n' "$session_out" >> "$session_file"
      extracted=$((extracted + 1))
    fi
  done < "$sqlite_out"
  rm -f "$sqlite_out"
  rm -f "$output_dir/.cursor_bubbles_dump"

  [ "$extracted" -gt 0 ] && return 0 || return 1
}

# Collect Cursor IDE sessions into the archive tmpdir.
# Discovers all state.vscdb files, extracts sessions matching --since filter,
# and writes canonical JSONL to $tmpdir/_cursor/.
collect_cursor_sessions() {
  local tmpdir="$1"
  local selected_remote="${2:-}"

  # Dependency check. jq gates BOTH sources; sqlite3 gates only the legacy
  # state.vscdb path — the ~/.cursor/projects transcripts are plain JSONL, so
  # a host without sqlite3 (Windows Git Bash) can still read those.
  if ! command -v jq &>/dev/null; then
    echo "  Cursor: jq not found. Install with: brew install jq (macOS), apt install jq (Linux), or winget install jqlang.jq (Windows Git Bash)" >&2
    return 0
  fi
  local _have_sqlite=1
  if ! command -v sqlite3 &>/dev/null; then
    _have_sqlite=0
    if [ -d "$CURSOR_DIR" ] || [ -f "$CURSOR_GLOBAL_DB" ]; then
      if [ -d "${CURSOR_PROJECTS_DIR:-}" ]; then
        echo "  Cursor: sqlite3 not found — reading only ~/.cursor/projects transcripts. For the full history install it: brew install sqlite3 (macOS), apt install sqlite3 (Linux), or winget install sqlite.sqlite (Windows Git Bash)" >&2
      else
        echo "  Cursor: sqlite3 not found. Install with: brew install sqlite3 (macOS), apt install sqlite3 (Linux), or winget install sqlite.sqlite (Windows Git Bash)" >&2
      fi
    fi
  fi

  if [ ! -d "$CURSOR_DIR" ] && [ ! -f "$CURSOR_GLOBAL_DB" ] && [ ! -d "${CURSOR_PROJECTS_DIR:-}" ]; then
    return 0
  fi

  # Warm the workspace map in THIS shell (subshell callers can't persist it)
  # and reset the DB-seen id set for this collection run.
  load_cursor_workspace_map
  _CURSOR_DB_SEEN_IDS="|"

  local cursor_count=0
  local cursor_bytes=0
  local _cursor_errors=0

  # 1. Extract from per-workspace state.vscdb files
  if [ "$_have_sqlite" -eq 1 ] && [ -d "$CURSOR_DIR" ]; then
    while IFS= read -r db_file; do
      [ -z "$db_file" ] && continue
      local _erc=0
      extract_cursor_db "$db_file" "$tmpdir" "$selected_remote" || _erc=$?
      [ "$_erc" -eq 2 ] && _cursor_errors=$((_cursor_errors + 1))
    done < <(find "$CURSOR_DIR" -name "state.vscdb" -maxdepth 2 2>/dev/null)
  fi

  # 2. Extract from globalStorage/state.vscdb (most composer data lives here)
  if [ "$_have_sqlite" -eq 1 ] && [ -f "$CURSOR_GLOBAL_DB" ]; then
    local _erc=0
    extract_cursor_db "$CURSOR_GLOBAL_DB" "$tmpdir" "$selected_remote" || _erc=$?
    [ "$_erc" -eq 2 ] && _cursor_errors=$((_cursor_errors + 1))
  fi

  # 3. Collect ~/.cursor/projects agent transcripts (current Cursor versions
  # stop writing composerData entirely — this is their only source). Runs
  # last so the richer DB extraction wins the per-session-id dedupe.
  collect_cursor_project_transcripts "$tmpdir" "$selected_remote"

  # Count extracted files across all _cursor_* subdirs (main sessions only —
  # subagent files sit deeper than -maxdepth 2)
  cursor_count=$(find "$tmpdir" -maxdepth 2 -path "*/_cursor_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$cursor_count" -gt 0 ]; then
    cursor_bytes=$(find "$tmpdir" -maxdepth 2 -path "*/_cursor_*/*.jsonl" -exec cat {} + 2>/dev/null | wc -c | tr -d ' ')
    local ws_count unattributed_count session_label repo_label unattr_note
    ws_count=$(find "$tmpdir" -maxdepth 1 -type d -name "_cursor_*" ! -name "_cursor_unattributed" 2>/dev/null | wc -l | tr -d ' ')
    unattributed_count=$({ find "$tmpdir/_cursor_unattributed" -maxdepth 1 -name '*.jsonl' 2>/dev/null || true; } | wc -l | tr -d ' ')
    session_label="sessions"
    [ "$cursor_count" -eq 1 ] && session_label="session"
    repo_label="repos"
    [ "$ws_count" -eq 1 ] && repo_label="repo"
    unattr_note=""
    [ "$unattributed_count" -gt 0 ] && unattr_note=", ${unattributed_count} not matched to a repo"
    echo "  Cursor IDE: ${cursor_count} ${session_label} across ${ws_count} ${repo_label}${unattr_note} ($(($cursor_bytes / 1024))KB)" >&2
    # Sessions from the transcripts tree can make the run look clean while a
    # state.vscdb was still unreadable — keep that failure visible (the
    # per-database warnings above carry the detail).
    if [ "$_cursor_errors" -gt 0 ]; then
      echo "  Cursor: ${_cursor_errors} database(s) could not be read — included the ~/.cursor/projects transcripts instead" >&2
    fi

    # Add per-workspace entries to sidecar metadata
    [ ! -f "$tmpdir/_metadata.json" ] && echo '{"directories":{}}' > "$tmpdir/_metadata.json"
    if command -v jq &>/dev/null && [ -f "$tmpdir/_metadata.json" ]; then
      for ws_dir in "$tmpdir"/_cursor_*/; do
        [ -d "$ws_dir" ] || continue
        local bucket_name
        bucket_name=$(basename "$ws_dir")
        local first_file
        first_file=$(find "$ws_dir" -name "*.jsonl" -maxdepth 1 -print -quit 2>/dev/null || true)
        [ -z "$first_file" ] && continue
        local bucket_remote
        bucket_remote=$(head -1 "$first_file" | jq -r '._cursor_meta.git_remote // empty' 2>/dev/null || true)
        local bucket_cwd
        bucket_cwd=$(head -1 "$first_file" | jq -r '._cursor_meta.workspace // empty' 2>/dev/null || true)
        local updated
        updated=$(jq \
          --arg bucket "$bucket_name" \
          --arg remote "${bucket_remote:-}" \
          --arg cwd "${bucket_cwd:-}" \
          '.directories[$bucket] = {"git_remote": $remote, "cwd": $cwd}' \
          "$tmpdir/_metadata.json" 2>/dev/null)
        [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
      done
    fi
  else
    # Clean up empty directories
    rmdir "$tmpdir"/_cursor_* 2>/dev/null || true
  fi

  # If we tried extractions but got zero files, signal failure to caller
  if [ "$cursor_count" -eq 0 ] && [ "$_cursor_errors" -gt 0 ]; then
    echo "  Cursor: extraction failed for $_cursor_errors database(s)" >&2
    return 1
  fi
}

# Collect Codex sessions from $CODEX_DIR (~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl)
# into per-remote buckets at $tmpdir/_codex_<slug>_<hash>/ (or _codex_unattributed/
# for sessions without a repository_url). Writes _metadata.json sidecar entries so
# TranscriptDiscoverer merges each bucket into the Claude project with a matching
# git_remote (one Project per repo, not one per agent).
#
# Signature mirrors collect_cursor_sessions:
#   collect_codex_sessions <output_tmpdir> [selected_remote]
#
# When selected_remote is set (single-project / multi-repo single-child), only
# sessions whose get_codex_session_remote normalizes to selected_remote are
# included — the others belong to different Claude projects and would widen the
# upload's scope beyond what the user asked for.
#
# When selected_remote is empty (--all mode), every Codex session is bucketed by
# its own remote. Sessions without a remote land in _codex_unattributed/.
#
# Reusable from:
#   * run_docker_analysis — produces the dir mounted as /codex_sessions:ro
#     (the container's analyze_local.rake merges _codex_* dirs into
#     transcript_dir, mirroring the Cursor merge).
#   * dev/test archive staging (via collect_all_projects /
#     collect_project_group / collect_single_project) — those paths still
#     have inline Codex logic today; consolidating onto this helper is a
#     separate cleanup (not scoped here to keep the Docker fix minimal).
collect_codex_sessions() {
  local tmpdir="$1"
  local selected_remote="${2:-}"
  # scope_cwd (C6): when set (a no-remote home/parent-dir scoped run) and
  # selected_remote is empty, keep only sessions whose cwd is under scope_cwd —
  # group those by their own recovered remote, and cwd-bucket the remote-less ones.
  local scope_cwd="${3:-}"

  [ -d "$CODEX_DIR" ] || return 0

  local selected_remote_norm=""
  if [ -n "$selected_remote" ]; then
    selected_remote_norm=$(normalize_remote "$selected_remote")
  fi

  local codex_count=0
  while IFS= read -r f; do
    [ -z "$f" ] && continue

    local remote
    remote=$(get_codex_session_remote "$f")
    local scwd=""

    # Scope filter. selected_remote (single specific repo) and scope_cwd (a
    # no-remote dir scope) are alternatives: at most one is set.
    if [ -n "$selected_remote_norm" ]; then
      # Single-project filter: skip sessions whose remote doesn't match.
      local remote_norm
      remote_norm=$(normalize_remote "$remote")
      [ "$remote_norm" != "$selected_remote_norm" ] && continue
    elif [ -n "$scope_cwd" ]; then
      # Scoped no-remote run: keep only sessions whose cwd is under scope_cwd.
      scwd=$(get_codex_session_cwd "$f")
      _paxel_cwd_in_scope "$scwd" "$scope_cwd" || continue
    fi

    # Apply --since filter via file mtime (parity with DRY_RUN archive path
    # at collect_project_group:2616-2620).
    if [ -n "$SINCE_EPOCH" ]; then
      local file_mtime
      file_mtime=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo "0")
      [ "$file_mtime" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
    fi

    local bucket
    bucket=$(codex_bucket_name "$remote" "$scwd" "$scope_cwd")
    mkdir -p "$tmpdir/$bucket"
    cp "$f" "$tmpdir/$bucket/"
    codex_count=$((codex_count + 1))
  done < <(find "$CODEX_DIR" -name "*.jsonl" -maxdepth 6 2>/dev/null)

  if [ "$codex_count" -eq 0 ]; then
    return 0
  fi

  local repo_bucket_count
  repo_bucket_count=$(find "$tmpdir" -maxdepth 1 -type d -name "_codex_*" -not -name "_codex_unattributed" 2>/dev/null | wc -l | tr -d ' ')
  echo "  Codex: ${codex_count} sessions (${repo_bucket_count} repos)" >&2

  # Write per-bucket sidecar so TranscriptDiscoverer reads git_remote + cwd
  # for each Codex bucket and merges it with the matching Claude project.
  # Without jq, skip silently — the bucketed dirs still ship, but each
  # Codex repo becomes its own Project (graceful degradation).
  command -v jq &>/dev/null || return 0
  [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
  local bucket_dir
  for bucket_dir in "$tmpdir"/_codex_*/; do
    [ -d "$bucket_dir" ] || continue
    local bname
    bname=$(basename "$bucket_dir")
    local first_file
    first_file=$(find "$bucket_dir" -name "*.jsonl" -maxdepth 1 -print -quit 2>/dev/null || true)
    [ -z "$first_file" ] && continue
    local bremote
    bremote=$(get_codex_session_remote "$first_file")
    local bcwd
    bcwd=$(get_codex_session_cwd "$first_file")
    local updated
    updated=$(jq \
      --arg bucket "$bname" \
      --arg remote "${bremote:-}" \
      --arg cwd "${bcwd:-}" \
      '.directories[$bucket] = {"git_remote": $remote, "cwd": $cwd}' \
      "$tmpdir/_metadata.json" 2>/dev/null)
    [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
  done
}

# Write one opencode-native JSONL file (meta line + message lines) for a single
# opencode session. Shared by extract_opencode_db's top-level and child
# (subagent) passes. Returns 1 (and removes the file) if the meta line fails.
#   args: <db_path> <session_id> <out_file> <directory> <title> <version> <agent> <model_raw> <git_remote>
_opencode_write_session_jsonl() {
  local db_path="$1" sid="$2" out_file="$3" directory="$4" title="$5" version="$6" agent="$7" model_raw="$8" remote="$9"

  # first_prompt = first user text part. JSON paths are escaped (\$) so bash
  # leaves them literal for sqlite. Truncated server-side; title is the
  # server-side fallback when this is empty.
  local first_prompt
  first_prompt=$(sqlite3 "$db_path" "SELECT json_extract(p.data,'\$.text') FROM part p JOIN message m ON p.message_id=m.id WHERE m.session_id='$sid' AND json_extract(m.data,'\$.role')='user' AND json_extract(p.data,'\$.type')='text' ORDER BY m.time_created, p.time_created LIMIT 1" 2>/dev/null || true)
  first_prompt=${first_prompt//$'\r'/}  # Windows sqlite3.exe emits CRLF; $() keeps the \r

  # Informational model string "<providerID>/<id>" from the session model JSON.
  local model=""
  if [ -n "$model_raw" ]; then
    model=$(printf '%s' "$model_raw" | jq -r 'if type=="object" then ((.providerID // "") + "/" + (.id // "")) else "" end' 2>/dev/null || true)
    model="${model#/}"; model="${model%/}"
  fi

  # Line 1: opencode_session_meta marker.
  if ! jq -cn \
    --arg id "$sid" --arg title "$title" --arg fp "${first_prompt}" \
    --arg dir "$directory" --arg remote "${remote:-}" \
    --arg model "$model" --arg agent "$agent" --arg version "$version" \
    '{type:"opencode_session_meta", id:$id, title:$title, first_prompt:($fp[0:1000]), directory:$dir, git_remote:$remote, model:$model, agent:$agent, version:$version}' \
    > "$out_file" 2>/dev/null; then
    rm -f "$out_file"
    return 1
  fi

  # Message lines: one per message, parts inlined with DB time_created (`t`).
  sqlite3 "$db_path" "SELECT json_object('type','opencode_message','message',json(m.data),'parts',(SELECT json_group_array(json_object('t',p.time_created,'p',json(p.data))) FROM part p WHERE p.message_id=m.id)) FROM message m WHERE m.session_id='$sid' ORDER BY m.time_created" >> "$out_file" 2>/dev/null || true
  return 0
}

# Build a SELECT column expression that tolerates opencode session-table columns
# added across versions. opencode grows the session schema over time (agent +
# model landed 2026-05-01 in the "next_venus" migration; metadata 2026-05-11), so
# a SELECT that hard-references a column dies with "no such column: agent" on any
# older DB -> extract_opencode_db returns 2 -> "extraction failed for N
# database(s)" even though the session is perfectly readable. Given a |-delimited
# column list and a column name, emit COALESCE(<name>,<default>) when present,
# else just <default>. See SESSION_DETECTION.md §3d.
_oc_coalesce_col() {
  local cols="$1" name="$2" default="$3"
  case "$cols" in
    *"|$name|"*) printf 'COALESCE(%s,%s)' "$name" "$default" ;;
    *) printf '%s' "$default" ;;
  esac
}

# Extract opencode sessions from a SQLite DB into "opencode-native" JSONL.
# opencode stores sessions relationally (session/message/part tables, content in
# JSON columns), not as JSONL like Claude/Codex. We dump each top-level session
# to one file per bucket: line 1 is an opencode_session_meta marker (drives
# server-side format detection + the discoverer index + the sidecar), then one
# opencode_message line per message with its parts inlined. Each part carries
# its DB time_created as `t`; the server-side OpencodeNormalizer sorts by `t`
# and converts to canonical (SQLite's json_group_array does NOT reliably sort
# aggregate input, so we deliberately do NOT order parts in SQL).
#
# opencode `task`-tool subagents are child sessions (parent_id set). We emit each
# one at <bucket>/<parent_id>/subagents/<child_id>.jsonl — the SAME layout Claude
# subagents use — so TranscriptDiscoverer + find_jsonl link them as is_subagent
# children with ZERO server changes. Children are only emitted when their parent
# top-level session was extracted (its <bucket>/<parent_id>.jsonl exists), which
# keeps --since / --project scoping consistent.
#
# Buckets are keyed by the session's workspace directory (like Cursor), so two
# opencode workspaces in the same repo don't collide; the sidecar maps each
# bucket to a git_remote and the server collapses same-remote buckets into one
# Project. Requires sqlite3 (with JSON1) + jq.
# Return codes: 0 = extracted sessions, 1 = no data (not an error), 2 = real error.
extract_opencode_db() {
  local db_path="$1"
  local output_dir="$2"
  local selected_remote="${3:-}"

  # Validate schema (opencode 1.x: session/message/part tables).
  local tables
  tables=$(sqlite3 "$db_path" ".tables" 2>/dev/null || true)
  if ! echo "$tables" | grep -q "session" || ! echo "$tables" | grep -q "message" || ! echo "$tables" | grep -q "part"; then
    echo "  Warning: $(basename "$db_path") is not a recognized opencode database. Skipping." >&2
    return 2
  fi

  # JSON1 probe — extraction relies on json_object/json_group_array/json().
  local json_ok
  json_ok=$(sqlite3 "$db_path" "SELECT json_valid('{}')" 2>/dev/null || echo "0")
  # Windows sqlite3.exe emits CRLF; without the strip this probe captured
  # "1\r" != "1" and every opencode DB on Windows was skipped with a bogus
  # "lacks JSON support" warning.
  json_ok=${json_ok//$'\r'/}
  if [ "$json_ok" != "1" ]; then
    echo "  Warning: this sqlite3 build lacks JSON support; cannot read opencode data. Skipping." >&2
    return 2
  fi

  # Probe the session table's actual columns so the SELECTs below degrade across
  # opencode schema versions instead of failing whole-DB (see _oc_coalesce_col).
  # opencode adds session columns over time (agent + model arrived 2026-05-01 in
  # the "next_venus" migration); directory/title/version/time_created — and the
  # id/parent_id structural keys — are baseline since its first SQLite schema.
  # Wrapped in leading/trailing '|' for substring membership tests.
  local oc_cols
  oc_cols=$(sqlite3 "$db_path" "SELECT '|'||COALESCE(group_concat(name,'|'),'')||'|' FROM pragma_table_info('session')" 2>/dev/null || true)
  oc_cols=${oc_cols//$'\r'/}  # Windows sqlite3.exe emits CRLF; $() keeps the \r
  if [ -z "$oc_cols" ] || [ "$oc_cols" = "||" ]; then
    echo "  Warning: could not read the opencode session schema from $(basename "$db_path"). Skipping." >&2
    return 2
  fi

  # Resolve each content column against the probe so older DBs (e.g. pre-agent/model)
  # still read. id + parent_id stay hard-referenced as structural invariants, so the
  # top-level vs subagent split below matches count_opencode_sessions exactly.
  local sel_dir sel_title sel_ver sel_agent sel_model sel_tc
  sel_dir=$(_oc_coalesce_col "$oc_cols" directory "''")
  sel_title=$(_oc_coalesce_col "$oc_cols" title "''")
  sel_ver=$(_oc_coalesce_col "$oc_cols" version "''")
  sel_agent=$(_oc_coalesce_col "$oc_cols" agent "''")
  sel_model=$(_oc_coalesce_col "$oc_cols" model "''")
  sel_tc=$(_oc_coalesce_col "$oc_cols" time_created 0)

  local session_count
  session_count=$(sqlite3 "$db_path" "SELECT COUNT(*) FROM session WHERE parent_id IS NULL" 2>/dev/null || echo "0")
  session_count=${session_count//$'\r'/}  # Windows sqlite3.exe emits CRLF; $() keeps the \r
  [ "$session_count" -eq 0 ] 2>/dev/null && return 1

  local selected_remote_norm=""
  [ -n "$selected_remote" ] && selected_remote_norm=$(normalize_remote "$selected_remote")

  # Dump one JSON object per top-level session. Using json_object avoids
  # separator pitfalls with arbitrary directory/title text; model stays raw
  # text (model_raw) for jq to parse below.
  local sqlite_out="$output_dir/.opencode_sessions.$$"
  if ! sqlite3 "$db_path" "SELECT json_object('id',id,'directory',$sel_dir,'title',$sel_title,'version',$sel_ver,'agent',$sel_agent,'model_raw',$sel_model,'time_created',$sel_tc) FROM session WHERE parent_id IS NULL" > "$sqlite_out" 2>/dev/null; then
    echo "  Warning: failed to read opencode sessions from $(basename "$db_path")" >&2
    rm -f "$sqlite_out"
    return 2
  fi

  local extracted=0
  local row
  while IFS= read -r row; do
    [ -z "$row" ] && continue

    local sid directory title version agent model_raw created_ms
    sid=$(printf '%s' "$row" | jq -r '.id // empty' 2>/dev/null || true)
    sid=${sid//$'\r'/}  # jq <1.7 on Windows emits CRLF; a \r here taints the filename
    [ -z "$sid" ] && continue
    directory=$(printf '%s' "$row" | jq -r '.directory // empty' 2>/dev/null || true)
    directory=${directory//$'\r'/}  # a \r fails [ -e ] for a live directory
    title=$(printf '%s' "$row" | jq -r '.title // empty' 2>/dev/null || true)
    version=$(printf '%s' "$row" | jq -r '.version // empty' 2>/dev/null || true)
    agent=$(printf '%s' "$row" | jq -r '.agent // empty' 2>/dev/null || true)
    model_raw=$(printf '%s' "$row" | jq -r '.model_raw // empty' 2>/dev/null || true)
    created_ms=$(printf '%s' "$row" | jq -r '.time_created // 0' 2>/dev/null || echo "0")
    created_ms=${created_ms//$'\r'/}  # a \r here is a FATAL arithmetic error

    # --since filter (createdAt is milliseconds epoch).
    if [ -n "${SINCE_EPOCH:-}" ]; then
      local created_s=$(( created_ms / 1000 )) 2>/dev/null || created_s=0
      [ "$created_s" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
    fi

    # Resolve remote from the session directory (cwd). Live dir -> get_git_remote;
    # deleted dir -> resolve_remote_for_dead_cwd (ancestor / sibling-worktree
    # walk), then a Conductor dead-workspace cache fallback. Mirrors
    # extract_cursor_db's per-session resolution (see its comment block).
    local session_remote=""
    if [ -n "$directory" ]; then
      if [ -e "$directory" ]; then
        session_remote=$(get_git_remote "$directory")
      else
        session_remote=$(resolve_remote_for_dead_cwd "$directory" || true)
        if [ -z "$session_remote" ]; then
          local _normalized_ws="${directory%/}"
          local _ws_parent=""
          case "$_normalized_ws" in
            */conductor/workspaces/*/*) _ws_parent="${_normalized_ws%/*}" ;;
            */.conductor/*) _ws_parent="${_normalized_ws%%/.conductor/*}/.conductor" ;;
          esac
          if [ -n "$_ws_parent" ]; then
            local _cache_file="${HOME}/.paxel/cache/project-remotes-v2.tsv"
            if [ -f "$_cache_file" ]; then
              local _dir _key _rest _row_cwd
              while IFS=$'\t' read -r _dir _key _rest; do
                [ -z "$_key" ] && continue
                case "$_key" in name:*|local:*|unknown) continue ;; esac
                _row_cwd=$(get_project_cwd "$_dir" 2>/dev/null || true)
                [ -z "$_row_cwd" ] && continue
                if [ "${_row_cwd%/*}" = "$_ws_parent" ]; then
                  session_remote="$_key"
                  break
                fi
              done < "$_cache_file"
            fi
          fi
        fi
      fi
    fi

    # Per-session --project filter.
    if [ -n "$selected_remote_norm" ]; then
      local rn
      rn=$(normalize_remote "$session_remote")
      [ "$rn" != "$selected_remote_norm" ] && continue
    fi

    # Bucket by workspace directory path (md5[:6] keeps same-repo workspaces apart).
    local bucket="_opencode_unattributed"
    if [ -n "$directory" ]; then
      bucket="_opencode_$(basename "$directory")_$(stable_hash6 "$directory")"
    fi
    mkdir -p "$output_dir/$bucket"
    local session_file="$output_dir/$bucket/${sid}.jsonl"
    [ -f "$session_file" ] && continue  # dedupe across multiple DBs

    if _opencode_write_session_jsonl "$db_path" "$sid" "$session_file" "$directory" "$title" "$version" "$agent" "$model_raw" "$session_remote"; then
      extracted=$((extracted + 1))
    fi
  done < "$sqlite_out"
  rm -f "$sqlite_out"

  # Pass 2: child (subagent) sessions, emitted at
  # <bucket>/<parent_id>/subagents/<child_id>.jsonl. A child is bucketed by its
  # own workspace directory (= the parent's, in practice); we only emit it if the
  # parent's top-level file already exists in that bucket (so filtered-out parents
  # don't leave orphan subagents, and grandchildren whose parent is itself a child
  # are skipped). No --since filter on children — they belong to an included parent.
  local child_out="$output_dir/.opencode_children.$$"
  if sqlite3 "$db_path" "SELECT json_object('id',id,'parent_id',COALESCE(parent_id,''),'directory',$sel_dir,'title',$sel_title,'version',$sel_ver,'agent',$sel_agent,'model_raw',$sel_model) FROM session WHERE parent_id IS NOT NULL" > "$child_out" 2>/dev/null; then
    local crow
    while IFS= read -r crow; do
      [ -z "$crow" ] && continue
      local c_sid c_parent c_dir c_title c_ver c_agent c_model_raw
      c_sid=$(printf '%s' "$crow" | jq -r '.id // empty' 2>/dev/null || true)
      c_parent=$(printf '%s' "$crow" | jq -r '.parent_id // empty' 2>/dev/null || true)
      # jq <1.7 on Windows emits CRLF; these three feed paths/filenames.
      c_sid=${c_sid//$'\r'/}; c_parent=${c_parent//$'\r'/}
      [ -z "$c_sid" ] && continue
      [ -z "$c_parent" ] && continue
      c_dir=$(printf '%s' "$crow" | jq -r '.directory // empty' 2>/dev/null || true)
      c_dir=${c_dir//$'\r'/}
      [ -z "$c_dir" ] && continue

      local c_bucket="_opencode_$(basename "$c_dir")_$(stable_hash6 "$c_dir")"
      # Gate on the parent's extracted top-level file existing in this bucket.
      [ -f "$output_dir/$c_bucket/${c_parent}.jsonl" ] || continue

      local sub_dir="$output_dir/$c_bucket/$c_parent/subagents"
      mkdir -p "$sub_dir"
      local child_file="$sub_dir/${c_sid}.jsonl"
      [ -f "$child_file" ] && continue

      c_title=$(printf '%s' "$crow" | jq -r '.title // empty' 2>/dev/null || true)
      c_ver=$(printf '%s' "$crow" | jq -r '.version // empty' 2>/dev/null || true)
      c_agent=$(printf '%s' "$crow" | jq -r '.agent // empty' 2>/dev/null || true)
      c_model_raw=$(printf '%s' "$crow" | jq -r '.model_raw // empty' 2>/dev/null || true)

      # git_remote left empty on children: the discoverer links them to the
      # parent by path, not by remote, so it's unused for subagents.
      if _opencode_write_session_jsonl "$db_path" "$c_sid" "$child_file" "$c_dir" "$c_title" "$c_ver" "$c_agent" "$c_model_raw" ""; then
        extracted=$((extracted + 1))
      fi
    done < "$child_out"
  fi
  rm -f "$child_out"

  [ "$extracted" -gt 0 ] && return 0 || return 1
}

# Collect opencode sessions into the archive/extraction tmpdir. Scans
# OPENCODE_DIR for opencode*.db (or honors an explicit OPENCODE_DB override),
# extracts each, and writes per-bucket sidecar entries so TranscriptDiscoverer
# merges each bucket into the Project with the matching git_remote.
# Signature mirrors collect_cursor_sessions / collect_codex_sessions:
#   collect_opencode_sessions <output_tmpdir> [selected_remote]
collect_opencode_sessions() {
  local tmpdir="$1"
  local selected_remote="${2:-}"

  if ! command -v sqlite3 &>/dev/null; then
    echo "  opencode: sqlite3 not found. Install with: brew install sqlite3 (macOS), apt install sqlite3 (Linux), or winget install sqlite.sqlite (Windows Git Bash)" >&2
    return 0
  fi
  if ! command -v jq &>/dev/null; then
    echo "  opencode: jq not found. Install with: brew install jq (macOS), apt install jq (Linux), or winget install jqlang.jq (Windows Git Bash)" >&2
    return 0
  fi

  # Candidate DBs: a non-empty OPENCODE_DB is AUTHORITATIVE — if it's set we use
  # only it (and warn + bail if it's missing rather than silently scanning the
  # user's real default DBs). Otherwise scan OPENCODE_DIR for every opencode*.db
  # (multi-channel; WAL/shm end in -wal/-shm, not .db).
  local -a dbs=()
  if [ -n "${OPENCODE_DB:-}" ]; then
    if [ -f "${OPENCODE_DB}" ]; then
      dbs+=("$OPENCODE_DB")
    else
      echo "  opencode: OPENCODE_DB set but not found: ${OPENCODE_DB}" >&2
      return 0
    fi
  elif [ -d "$OPENCODE_DIR" ]; then
    local db
    while IFS= read -r db; do
      [ -n "$db" ] && dbs+=("$db")
    done < <(find "$OPENCODE_DIR" -maxdepth 1 -name 'opencode*.db' 2>/dev/null)
  fi
  [ "${#dbs[@]}" -eq 0 ] && return 0

  local _oc_errors=0
  local db
  for db in "${dbs[@]}"; do
    local _erc=0
    extract_opencode_db "$db" "$tmpdir" "$selected_remote" || _erc=$?
    [ "$_erc" -eq 2 ] && _oc_errors=$((_oc_errors + 1))
  done

  local oc_count
  oc_count=$(find "$tmpdir" -maxdepth 2 -path "*/_opencode_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$oc_count" -gt 0 ]; then
    local oc_bytes ws_count
    oc_bytes=$(find "$tmpdir" -maxdepth 2 -path "*/_opencode_*/*.jsonl" -exec cat {} + 2>/dev/null | wc -c | tr -d ' ')
    ws_count=$(find "$tmpdir" -maxdepth 1 -type d -name "_opencode_*" 2>/dev/null | wc -l | tr -d ' ')
    echo "  opencode: ${oc_count} sessions, $(($oc_bytes / 1024))KB (${ws_count} workspaces)" >&2

    [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
    local ws_dir
    for ws_dir in "$tmpdir"/_opencode_*/; do
      [ -d "$ws_dir" ] || continue
      local bucket_name first_file bremote bcwd updated
      bucket_name=$(basename "$ws_dir")
      first_file=$(find "$ws_dir" -name "*.jsonl" -maxdepth 1 -print -quit 2>/dev/null || true)
      [ -z "$first_file" ] && continue
      bremote=$(head -1 "$first_file" | jq -r '.git_remote // empty' 2>/dev/null || true)
      bcwd=$(head -1 "$first_file" | jq -r '.directory // empty' 2>/dev/null || true)
      updated=$(jq \
        --arg bucket "$bucket_name" \
        --arg remote "${bremote:-}" \
        --arg cwd "${bcwd:-}" \
        '.directories[$bucket] = {"git_remote": $remote, "cwd": $cwd}' \
        "$tmpdir/_metadata.json" 2>/dev/null)
      [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
    done

    # The resolver may have logged dead-cwd recoveries during extraction; keep
    # the sidecar's orphan_recovery_count honest (mirrors collect_cursor_sessions).
    if declare -f _refresh_orphan_recovery_count >/dev/null 2>&1; then
      _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
    fi
  else
    rmdir "$tmpdir"/_opencode_* 2>/dev/null || true
  fi

  if [ "$oc_count" -eq 0 ] && [ "$_oc_errors" -gt 0 ]; then
    echo "  opencode: extraction failed for $_oc_errors database(s)" >&2
    return 1
  fi
  return 0
}

# Count top-level opencode sessions for the time estimate + the single-dir
# zero-session guard. With a selected_remote, counts only sessions whose
# workspace directory resolves to that remote (each distinct directory resolved
# once). Prelude display only — no downstream gate beyond avoiding a false
# "No sessions found" abort for an opencode-only user. Echoes 0 on any problem.
count_opencode_sessions() {
  local selected_remote="${1:-}"
  command -v sqlite3 &>/dev/null || { echo 0; return; }
  command -v jq &>/dev/null || { echo 0; return; }

  # Non-empty OPENCODE_DB is authoritative (kept in sync with
  # collect_opencode_sessions): a set-but-missing override counts 0 rather than
  # scanning the user's real DBs.
  local -a dbs=()
  if [ -n "${OPENCODE_DB:-}" ]; then
    if [ -f "${OPENCODE_DB}" ]; then
      dbs+=("$OPENCODE_DB")
    else
      echo 0; return
    fi
  elif [ -d "$OPENCODE_DIR" ]; then
    local db
    while IFS= read -r db; do
      [ -n "$db" ] && dbs+=("$db")
    done < <(find "$OPENCODE_DIR" -maxdepth 1 -name 'opencode*.db' 2>/dev/null)
  fi
  [ "${#dbs[@]}" -eq 0 ] && { echo 0; return; }

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  # --since filter: mirror extract_opencode_db (time_created is a baseline ms-epoch
  # column). Without it the count over-reports sessions older than --since that the
  # extractor drops, which can make an opencode-only repo wrongly visible/selectable.
  local _oc_since=""
  [ -n "${SINCE_EPOCH:-}" ] && _oc_since="AND time_created >= $((SINCE_EPOCH * 1000))"

  local total=0
  local db
  for db in "${dbs[@]}"; do
    sqlite3 "$db" "SELECT 1 FROM session LIMIT 1" >/dev/null 2>&1 || continue
    if [ -z "$sel_norm" ]; then
      local c
      c=$(sqlite3 "$db" "SELECT COUNT(*) FROM session WHERE parent_id IS NULL $_oc_since" 2>/dev/null || echo 0)
      # Windows-native sqlite3.exe emits CRLF even when piped, and $(...) only
      # strips the trailing \n — an unstripped \r in an arithmetic operand
      # aborts the whole upload via the ERR trap (MINGW64 user report,
      # 2026-07-17). Same reason for the tr in the loop below.
      c=${c//$'\r'/}
      [ -n "$c" ] && total=$((total + c)) || true
    else
      # Resolve each distinct workspace directory once, then add the session
      # count for directories whose remote matches.
      local line dir n remote rn
      while IFS=$'\t' read -r dir n; do
        [ -z "$dir" ] && continue
        if [ -e "$dir" ]; then
          remote=$(get_git_remote "$dir")
        else
          remote=$(resolve_remote_for_dead_cwd "$dir" || true)
        fi
        rn=$(normalize_remote "$remote")
        [ "$rn" = "$sel_norm" ] && total=$((total + n))
      done < <(sqlite3 -separator "$(printf '\t')" "$db" "SELECT directory, COUNT(*) FROM session WHERE parent_id IS NULL AND directory IS NOT NULL AND directory <> '' $_oc_since GROUP BY directory" 2>/dev/null | tr -d '\r')
    fi
  done
  echo "$total"
}

# Copy one Gemini CLI chats/ dir into a bucket, keyed by the real sessionId so the
# discoverer's <parent>/subagents/<child> linking lines up. Reads sessionId via sed
# (no jq/sqlite3 dependency — gemini sessions are plain JSONL we copy verbatim; the
# server GeminiNormalizer does all reconstruction). Returns 0 if anything emitted.
_gemini_extract_chats() {
  local chats_dir="$1"
  local bucket_out="$2"
  [ -d "$chats_dir" ] || return 1
  mkdir -p "$bucket_out"
  local emitted=0

  # Top-level sessions: session-<ISO>-<short>.jsonl. Name the copy by the full
  # sessionId from the header (the filename only carries an 8-char prefix), so the
  # subagent dirs below — named by the parent's full sessionId — match the parent
  # file's basename, which is how TranscriptDiscoverer pairs parent <-> subagent.
  local f sid dest fm
  for f in "$chats_dir"/session-*.jsonl; do
    [ -f "$f" ] || continue
    # --since filter via file mtime (portable: GNU stat -c, then BSD stat -f).
    # Parity with the Codex/Cursor/opencode collectors. Only top-level sessions
    # are filtered; an included parent's subagents come along (the gate below
    # requires the parent's file to exist).
    if [ -n "${SINCE_EPOCH:-}" ]; then
      fm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo "0")
      [ "$fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
    fi
    sid=$(sed -n '1s/.*"sessionId":"\([^"]*\)".*/\1/p' "$f" 2>/dev/null || true)
    [ -z "$sid" ] && continue  # fail-closed: never emit a stray _gemini_/.jsonl
    dest="$bucket_out/${sid}.jsonl"
    [ -f "$dest" ] && continue  # dedupe across slug dirs
    cp "$f" "$dest" && emitted=$((emitted + 1))
  done

  # Subagents: chats/<parentSessionId>/<childSessionId>.jsonl -> re-laid at
  # <bucket>/<parentSessionId>/subagents/<childSessionId>.jsonl (the Claude layout
  # the discoverer links). Gated on the parent's top-level file existing, so a
  # filtered-out parent leaves no orphan subagents (mirrors extract_opencode_db).
  local pdir parent cf c_sid sub_dir cdest
  for pdir in "$chats_dir"/*/; do
    [ -d "$pdir" ] || continue
    parent=$(basename "$pdir")
    [ -f "$bucket_out/${parent}.jsonl" ] || continue
    sub_dir="$bucket_out/$parent/subagents"
    for cf in "$pdir"*.jsonl; do
      [ -f "$cf" ] || continue
      c_sid=$(sed -n '1s/.*"sessionId":"\([^"]*\)".*/\1/p' "$cf" 2>/dev/null || true)
      [ -z "$c_sid" ] && c_sid=$(basename "$cf" .jsonl)
      [ -z "$c_sid" ] && continue
      mkdir -p "$sub_dir"
      cdest="$sub_dir/${c_sid}.jsonl"
      [ -f "$cdest" ] && continue
      cp "$cf" "$cdest" && emitted=$((emitted + 1))
    done
  done

  [ "$emitted" -gt 0 ] && return 0 || return 1
}

# Write the per-bucket remote into the sidecar so TranscriptDiscoverer merges the
# bucket onto the matching repo Project. jq-OPTIONAL: without jq the sessions still
# upload and analyze — they just attribute to a bucket-named Project instead of
# collapsing onto the git remote (the discoverer's no-sidecar fallback).
_gemini_write_sidecar() {
  local tmpdir="$1" bucket="$2" remote="${3:-}" cwd="${4:-}"
  command -v jq >/dev/null 2>&1 || return 0
  [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
  local updated
  updated=$(jq --arg bucket "$bucket" --arg remote "$remote" --arg cwd "$cwd" \
    '.directories[$bucket] = {"git_remote": $remote, "cwd": $cwd}' \
    "$tmpdir/_metadata.json" 2>/dev/null)
  [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
}

# Collect Gemini CLI sessions into the archive/extraction tmpdir. Each
# ~/.gemini/tmp/<slug>/ dir is one project (its .project_root names the repo);
# we resolve the remote, bucket as _gemini_<basename>_<hash>, copy sessions +
# subagents, and write a sidecar entry. Signature mirrors collect_opencode_sessions:
#   collect_gemini_sessions <output_tmpdir> [selected_remote]
# No sqlite3/jq hard dependency (extraction is sed/cp).
collect_gemini_sessions() {
  local tmpdir="$1"
  local selected_remote="${2:-}"
  [ -d "$GEMINI_DIR" ] || return 0

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  local slug_dir
  for slug_dir in "$GEMINI_DIR"/*/; do
    [ -d "${slug_dir}chats" ] || continue

    local project_root=""
    [ -f "${slug_dir}.project_root" ] && project_root=$(head -1 "${slug_dir}.project_root" 2>/dev/null || true)
    project_root=${project_root//$'\r'/}  # CRLF-edited file: a \r fails [ -e ]

    # Resolve remote from the project root: live -> get_git_remote, deleted ->
    # ancestor/sibling-worktree recovery (mirrors the SQLite collectors).
    local session_remote=""
    if [ -n "$project_root" ]; then
      if [ -e "$project_root" ]; then
        session_remote=$(get_git_remote "$project_root")
      else
        session_remote=$(resolve_remote_for_dead_cwd "$project_root" || true)
      fi
    fi

    # Per-project filter.
    if [ -n "$sel_norm" ]; then
      local rn
      rn=$(normalize_remote "$session_remote")
      [ "$rn" != "$sel_norm" ] && continue
    fi

    local bucket="_gemini_unattributed"
    [ -n "$project_root" ] && bucket="_gemini_$(basename "$project_root")_$(stable_hash6 "$project_root")"

    _gemini_extract_chats "${slug_dir}chats" "$tmpdir/$bucket" || true

    if [ -n "$(find "$tmpdir/$bucket" -maxdepth 1 -name '*.jsonl' -print -quit 2>/dev/null)" ]; then
      _gemini_write_sidecar "$tmpdir" "$bucket" "$session_remote" "$project_root"
    fi
  done

  local g_count
  g_count=$(find "$tmpdir" -maxdepth 2 -path "*/_gemini_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$g_count" -gt 0 ]; then
    local g_bytes ws_count
    g_bytes=$(find "$tmpdir" -path "*/_gemini_*/*.jsonl" -exec cat {} + 2>/dev/null | wc -c | tr -d ' ')
    ws_count=$(find "$tmpdir" -maxdepth 1 -type d -name "_gemini_*" 2>/dev/null | wc -l | tr -d ' ')
    echo "  Gemini CLI: ${g_count} sessions, $(($g_bytes / 1024))KB (${ws_count} workspaces)" >&2
    if declare -f _refresh_orphan_recovery_count >/dev/null 2>&1; then
      _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
    fi
  else
    rmdir "$tmpdir"/_gemini_* 2>/dev/null || true
  fi
  return 0
}

# Count top-level Gemini sessions for the time estimate + zero-session guard.
# With a selected_remote, counts only slug dirs whose .project_root resolves to it.
# Prelude display only. Echoes 0 on any problem. No jq/sqlite3 needed.
count_gemini_sessions() {
  local selected_remote="${1:-}"
  [ -d "$GEMINI_DIR" ] || { echo 0; return; }

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  local total=0 slug_dir
  for slug_dir in "$GEMINI_DIR"/*/; do
    [ -d "${slug_dir}chats" ] || continue
    if [ -n "$sel_norm" ]; then
      local project_root="" remote rn
      [ -f "${slug_dir}.project_root" ] && project_root=$(head -1 "${slug_dir}.project_root" 2>/dev/null || true)
      project_root=${project_root//$'\r'/}  # CRLF-edited file: a \r fails [ -e ]
      [ -z "$project_root" ] && continue
      if [ -e "$project_root" ]; then
        remote=$(get_git_remote "$project_root")
      else
        remote=$(resolve_remote_for_dead_cwd "$project_root" || true)
      fi
      rn=$(normalize_remote "$remote")
      [ "$rn" != "$sel_norm" ] && continue
    fi
    # Count top-level sessions, honoring --since via file mtime (parity with the
    # extraction filter above, so the estimate matches what actually uploads).
    local c=0 sf fm
    while IFS= read -r sf; do
      [ -z "$sf" ] && continue
      if [ -n "${SINCE_EPOCH:-}" ]; then
        fm=$(stat -c %Y "$sf" 2>/dev/null || stat -f %m "$sf" 2>/dev/null || echo "0")
        [ "$fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
      fi
      c=$((c + 1))
    done < <(find "${slug_dir}chats" -maxdepth 1 -name 'session-*.jsonl' 2>/dev/null)
    total=$((total + c))
  done
  echo "$total"
}

# --- Antigravity (Google) --------------------------------------------------
# Antigravity renders every conversation to a plaintext transcript.jsonl under
# ~/.gemini/<surface>/brain/<uuid>/.system_generated/logs/ and stores attribution
# (workspace URI + captured git remote, both plaintext) in the sibling
# ~/.gemini/<surface>/conversations/<uuid>.db SQLite blob trajectory_metadata_blob.
# We copy the transcript raw with a synthetic antigravity_session_meta line 1; the
# server AntigravityNormalizer does the step->canonical conversion. sqlite3 is
# REQUIRED for attribution (like Cursor/opencode); strings extracts the plaintext
# substrings out of the blob (avoids protobuf decoding).

# Sidecar writer — identical body to _gemini_write_sidecar (jq-optional).
_antigravity_write_sidecar() {
  local tmpdir="$1" bucket="$2" remote="${3:-}" cwd="${4:-}"
  command -v jq >/dev/null 2>&1 || return 0
  [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
  local updated
  updated=$(jq --arg bucket "$bucket" --arg remote "$remote" --arg cwd "$cwd" \
    '.directories[$bucket] = {"git_remote": $remote, "cwd": $cwd}' \
    "$tmpdir/_metadata.json" 2>/dev/null)
  [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
}

# Read the workspace URI (first file://) + captured git remote out of a
# conversations/<uuid>.db trajectory_metadata_blob. Echoes "<cwd>\t<remote_raw>"
# (either field may be empty). Uses writefile so we read ONLY that blob (the
# whole-db dump would also surface per-step file paths, not the workspace root).
# `tr` splits on the blob's non-printable field separators — deliberately NOT
# `strings`, which is binutils and absent from Windows Git Bash.
_antigravity_db_attribution() {
  local db="$1"
  [ -f "$db" ] || { printf '\t'; return 0; }
  command -v sqlite3 >/dev/null 2>&1 || { printf '\t'; return 0; }
  local blob cwd_uri remote_raw
  blob=$(mktemp 2>/dev/null) || { printf '\t'; return 0; }
  sqlite3 "$db" "SELECT writefile('$blob', data) FROM trajectory_metadata_blob LIMIT 1;" >/dev/null 2>&1 || true
  cwd_uri=$(LC_ALL=C tr -c '[:print:]' '\n' < "$blob" 2>/dev/null | grep -aoE 'file:///[^"[:cntrl:]]+' | head -1 || true)
  remote_raw=$(LC_ALL=C tr -c '[:print:]' '\n' < "$blob" 2>/dev/null | grep -aoE 'git@[^"[:cntrl:] ]+|(https|ssh)://[^"[:cntrl:] ]+' | head -1 || true)
  rm -f "$blob"
  # Trim trailing whitespace: a printable run can still end in a stray space.
  cwd_uri="${cwd_uri%"${cwd_uri##*[![:space:]]}"}"
  printf '%s\t%s' "$(_vscode_decode_folder_uri "$cwd_uri")" "$remote_raw"
}

# Best-effort first_prompt: the first USER_INPUT step's <USER_REQUEST> text.
_antigravity_first_prompt() {
  local transcript="$1"
  grep -m1 '"type":"USER_INPUT"' "$transcript" 2>/dev/null \
    | perl -ne 'print "$1" if /<USER_REQUEST>\\n(.*?)\\n<\/USER_REQUEST>/' 2>/dev/null \
    | cut -c1-200 || true
}

# Fallback workspace when the .db has none (missing/unreadable/no sqlite3): the
# first run_command's Cwd, else the GENERIC "workspace access" note. Both carry the
# absolute workspace root; Cwd args are double-JSON-encoded ("Cwd":"\"/path\"").
_antigravity_transcript_cwd() {
  local transcript="$1" cwd=""
  cwd=$(grep -m1 '"Cwd"' "$transcript" 2>/dev/null \
    | perl -ne 'print "$1" if /"Cwd":"\\"([^\\"]+)\\""/' 2>/dev/null || true)
  if [ -z "$cwd" ]; then
    cwd=$(grep -m1 'read and write access to the following workspace' "$transcript" 2>/dev/null \
      | perl -ne 'print "$1" if /workspace\(s\):\\n- ([^\\"]+)/' 2>/dev/null || true)
  fi
  printf '%s' "$cwd"
}

# Best-effort session model: the first USER_SETTINGS_CHANGE "Model Selection"
# note (e.g. "... from None to Gemini 3.5 Flash (Medium). No need to comment").
# Feeds models_used server-side; empty when the session never records one.
_antigravity_session_model() {
  local transcript="$1"
  grep -m1 'Model Selection' "$transcript" 2>/dev/null \
    | perl -ne 'print "$1" if /changed setting `Model Selection` from .*? to (.+?)\.(?: No need| |\\n)/' 2>/dev/null \
    | cut -c1-100 || true
}

# Collect Antigravity sessions into the archive/extraction tmpdir. Iterates the
# three surface dirs' brain/<uuid> trees, resolves the remote (captured in the .db,
# else from the workspace cwd), buckets as _antigravity_<basename(cwd)>_<hash6>, and
# copies each transcript raw with a synthetic meta line 1.
#   collect_antigravity_sessions <output_tmpdir> [selected_remote]
# sqlite3 required for attribution; without it sessions still upload unattributed.
collect_antigravity_sessions() {
  local tmpdir="$1"
  local selected_remote="${2:-}"
  [ -d "$ANTIGRAVITY_DIR" ] || return 0

  if ! command -v sqlite3 >/dev/null 2>&1; then
    echo "  Antigravity: sqlite3 not found — using transcript-based repo matching (captured git remotes unavailable). For best results install: brew install sqlite3 (macOS), apt install sqlite3 (Linux), or winget install sqlite.sqlite (Windows Git Bash)" >&2
  fi

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  local surface brain_dir uuid transcript db attrib cwd remote_raw session_remote bucket out_file fm
  for surface in antigravity antigravity-ide antigravity-cli; do
    [ -d "$ANTIGRAVITY_DIR/$surface/brain" ] || continue
    for brain_dir in "$ANTIGRAVITY_DIR/$surface/brain"/*/; do
      transcript="${brain_dir}.system_generated/logs/transcript.jsonl"
      [ -f "$transcript" ] || continue
      uuid=$(basename "$brain_dir")
      [ -z "$uuid" ] && continue  # fail-closed: never emit a stray bucket file

      # --since filter via transcript mtime (portable: GNU stat -c, then BSD stat -f).
      if [ -n "${SINCE_EPOCH:-}" ]; then
        fm=$(stat -c %Y "$transcript" 2>/dev/null || stat -f %m "$transcript" 2>/dev/null || echo "0")
        [ "$fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
      fi

      db="$ANTIGRAVITY_DIR/$surface/conversations/${uuid}.db"
      attrib=$(_antigravity_db_attribution "$db")
      cwd="${attrib%%$'\t'*}"
      remote_raw="${attrib#*$'\t'}"
      # No workspace in the .db (missing/unreadable/no sqlite3) -> parse it from the
      # transcript's own tool args so attribution still works.
      [ -z "$cwd" ] && cwd=$(_antigravity_transcript_cwd "$transcript")

      # Prefer the captured remote; else resolve from the workspace cwd (live ->
      # get_git_remote, dead -> resolve_remote_for_dead_cwd + Conductor cache).
      session_remote=""
      if [ -n "$remote_raw" ]; then
        session_remote=$(normalize_remote "$remote_raw")
      elif [ -n "$cwd" ]; then
        if [ -e "$cwd" ]; then
          session_remote=$(get_git_remote "$cwd")
        else
          session_remote=$(resolve_remote_for_dead_cwd "$cwd" || true)
          if [ -z "$session_remote" ]; then
            local _normalized_ws="${cwd%/}" _ws_parent=""
            case "$_normalized_ws" in
              */conductor/workspaces/*/*) _ws_parent="${_normalized_ws%/*}" ;;
              */.conductor/*) _ws_parent="${_normalized_ws%%/.conductor/*}/.conductor" ;;
            esac
            if [ -n "$_ws_parent" ]; then
              local _cache_file="${HOME}/.paxel/cache/project-remotes-v2.tsv"
              if [ -f "$_cache_file" ]; then
                local _dir _key _rest _row_cwd
                while IFS=$'\t' read -r _dir _key _rest; do
                  [ -z "$_key" ] && continue
                  case "$_key" in name:*|local:*|unknown) continue ;; esac
                  _row_cwd=$(get_project_cwd "$_dir" 2>/dev/null || true)
                  [ -z "$_row_cwd" ] && continue
                  if [ "${_row_cwd%/*}" = "$_ws_parent" ]; then
                    session_remote="$_key"
                    break
                  fi
                done < "$_cache_file"
              fi
            fi
          fi
        fi
      fi

      # Per-session --project / selected_remote filter.
      if [ -n "$sel_norm" ]; then
        local rn
        rn=$(normalize_remote "$session_remote")
        [ "$rn" != "$sel_norm" ] && continue
      fi

      bucket="_antigravity_unattributed"
      [ -n "$cwd" ] && bucket="_antigravity_$(basename "$cwd")_$(stable_hash6 "$cwd")"
      mkdir -p "$tmpdir/$bucket"
      out_file="$tmpdir/$bucket/${uuid}.jsonl"
      [ -f "$out_file" ] && continue  # dedupe across surfaces

      local first_prompt session_model
      first_prompt=$(_antigravity_first_prompt "$transcript")
      session_model=$(_antigravity_session_model "$transcript")
      if command -v jq >/dev/null 2>&1; then
        jq -cn --arg id "$uuid" --arg fp "$first_prompt" --arg remote "${session_remote:-}" \
          --arg cwd "${cwd:-}" --arg surface "$surface" --arg model "$session_model" \
          '{type:"antigravity_session_meta", session_id:$id, first_prompt:$fp, model:$model, git_remote:$remote, cwd:$cwd, surface:$surface}' \
          > "$out_file" 2>/dev/null || { rm -f "$out_file"; continue; }
      else
        # jq-free fallback: minimal valid JSON (first_prompt/model omitted to dodge escaping).
        printf '{"type":"antigravity_session_meta","session_id":"%s","first_prompt":"","model":"","git_remote":"%s","cwd":"%s","surface":"%s"}\n' \
          "$uuid" "${session_remote:-}" "${cwd:-}" "$surface" > "$out_file"
      fi
      cat "$transcript" >> "$out_file"
      # Fail-closed: drop a body-less write.
      [ -s "$out_file" ] || { rm -f "$out_file"; continue; }

      _antigravity_write_sidecar "$tmpdir" "$bucket" "$session_remote" "$cwd"
    done
  done

  local a_count
  a_count=$(find "$tmpdir" -maxdepth 2 -path "*/_antigravity_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$a_count" -gt 0 ]; then
    local a_bytes ws_count
    a_bytes=$(find "$tmpdir" -path "*/_antigravity_*/*.jsonl" -exec cat {} + 2>/dev/null | wc -c | tr -d ' ')
    ws_count=$(find "$tmpdir" -maxdepth 1 -type d -name "_antigravity_*" 2>/dev/null | wc -l | tr -d ' ')
    echo "  Antigravity: ${a_count} sessions, $(($a_bytes / 1024))KB (${ws_count} workspaces)" >&2
    if declare -f _refresh_orphan_recovery_count >/dev/null 2>&1; then
      _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
    fi
  else
    rmdir "$tmpdir"/_antigravity_* 2>/dev/null || true
  fi
  return 0
}

# Count Antigravity sessions for the time estimate + zero-session guard. Prelude
# display only; echoes 0 on any problem. sqlite3 only needed for the remote filter.
count_antigravity_sessions() {
  local selected_remote="${1:-}"
  [ -d "$ANTIGRAVITY_DIR" ] || { echo 0; return; }

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  local total=0 surface brain_dir transcript db attrib cwd remote_raw remote rn uuid fm
  local seen_uuids="|"
  for surface in antigravity antigravity-ide antigravity-cli; do
    [ -d "$ANTIGRAVITY_DIR/$surface/brain" ] || continue
    for brain_dir in "$ANTIGRAVITY_DIR/$surface/brain"/*/; do
      transcript="${brain_dir}.system_generated/logs/transcript.jsonl"
      [ -f "$transcript" ] || continue
      # Cross-surface dedupe by uuid (parity with collect's out_file dedupe).
      uuid=$(basename "$brain_dir")
      case "$seen_uuids" in *"|${uuid}|"*) continue ;; esac
      if [ -n "${SINCE_EPOCH:-}" ]; then
        fm=$(stat -c %Y "$transcript" 2>/dev/null || stat -f %m "$transcript" 2>/dev/null || echo "0")
        [ "$fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
      fi
      if [ -n "$sel_norm" ]; then
        db="$ANTIGRAVITY_DIR/$surface/conversations/${uuid}.db"
        attrib=$(_antigravity_db_attribution "$db")
        cwd="${attrib%%$'\t'*}"
        remote_raw="${attrib#*$'\t'}"
        [ -z "$cwd" ] && cwd=$(_antigravity_transcript_cwd "$transcript")
        if [ -n "$remote_raw" ]; then
          remote=$(normalize_remote "$remote_raw")
        elif [ -n "$cwd" ] && [ -e "$cwd" ]; then
          remote=$(get_git_remote "$cwd")
        else
          remote=$(resolve_remote_for_dead_cwd "$cwd" 2>/dev/null || true)
        fi
        rn=$(normalize_remote "$remote")
        [ "$rn" != "$sel_norm" ] && continue
      fi
      seen_uuids="${seen_uuids}${uuid}|"
      total=$((total + 1))
    done
  done
  echo "$total"
}

# Write the per-bucket remote into the sidecar so TranscriptDiscoverer merges the
# bucket onto the matching repo Project. Mirrors _gemini_write_sidecar. jq is
# REQUIRED for vscode extraction overall, so by the time this is called jq exists;
# the guard stays for symmetry + a clean no-op if it somehow doesn't.
_vscode_write_sidecar() {
  local tmpdir="$1" bucket="$2" remote="${3:-}" cwd="${4:-}"
  command -v jq >/dev/null 2>&1 || return 0
  [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
  local updated
  updated=$(jq --arg bucket "$bucket" --arg remote "$remote" --arg cwd "$cwd" \
    '.directories[$bucket] = {"git_remote": $remote, "cwd": $cwd}' \
    "$tmpdir/_metadata.json" 2>/dev/null)
  [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
}

# Decode a VS Code workspace.json `.folder` URI (a file:// URI) into a filesystem
# path. Strips the file:// scheme, percent-decodes %XX escapes, and turns a
# leading "/c:/Users/.." into "c:/Users/.." on Windows-style drive paths. Echoes
# the decoded path, or empty for a non-file scheme (vscode-remote / ssh-remote)
# or an empty input (which the caller treats as unattributed).
_vscode_decode_folder_uri() {
  local uri="$1"
  uri=${uri//$'\r'/}  # jq <1.7 on Windows emits CRLF; a \r fails [ -e ] downstream
  [ -z "$uri" ] && { echo ""; return; }
  case "$uri" in
    file://*) ;;
    *) echo ""; return ;;  # vscode-remote / ssh-remote / non-file -> unattributed
  esac
  local path="${uri#file://}"
  # Percent-decode %XX escapes (printf %b interprets the \x sequences).
  path=$(printf '%b' "${path//%/\\x}")
  # "/c:/Users/.." (Windows drive path with a leading slash) -> "c:/Users/..".
  case "$path" in
    /[A-Za-z]:/*) path="${path#/}" ;;
  esac
  echo "$path"
}

# Slim one raw VS Code Copilot chatSessions/*.json into the
# vscode_session_meta + vscode_request JSONL the server VscodeCopilotNormalizer
# reads. The jq filter is written once to $tmpdir/_vscode_slim.jq and reused for
# every session (a 93 MB raw -> a few MB slimmed). Requires jq.
#   args: <raw_json> <out_jsonl> <session_id> <git_remote> <cwd> <jq_filter_file>
_vscode_slim_session() {
  local raw_json="$1" out_jsonl="$2" sid="$3" remote="${4:-}" cwd="${5:-}" jq_file="$6"
  jq -c -f "$jq_file" --arg sid "$sid" --arg remote "$remote" --arg cwd "$cwd" \
    "$raw_json" > "$out_jsonl" 2>/dev/null
}

# Collect VS Code Copilot sessions into the archive/extraction tmpdir. Iterates
# the configured workspaceStorage base dirs (VSCODE_DIR is a newline-separated
# list), resolves each <hash>/'s workspace folder from the sibling workspace.json,
# resolves the git remote (live -> get_git_remote, dead -> resolve_remote_for_dead_cwd,
# then the Conductor project-cache fallback like extract_opencode_db), applies
# --since (file mtime) + --project/selected_remote filters, buckets as
# _vscode_<basename>_<hash6> (or _vscode_unattributed), and jq-slims each session.
# Signature mirrors collect_gemini_sessions / collect_opencode_sessions:
#   collect_vscode_copilot_sessions <output_tmpdir> [selected_remote]
# jq is REQUIRED (like Cursor) — without it we print the install hint and skip.
collect_vscode_copilot_sessions() {
  local tmpdir="$1"
  local selected_remote="${2:-}"

  if ! command -v jq &>/dev/null; then
    echo "  VS Code Copilot: jq not found. Install with: brew install jq (macOS), apt install jq (Linux), or winget install jqlang.jq (Windows Git Bash)" >&2
    return 0
  fi

  # Build the candidate base dirs from the newline-separated VSCODE_DIR list.
  local -a bases=()
  local _base
  while IFS= read -r _base; do
    [ -z "$_base" ] && continue
    [ -d "$_base" ] && bases+=("$_base")
  done <<< "$VSCODE_DIR"
  [ "${#bases[@]}" -eq 0 ] && return 0

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  # Write the slim jq filter once and reuse it for every session.
  local jq_file="$tmpdir/_vscode_slim.jq"
  cat > "$jq_file" <<'VSCODE_JQ_EOF'
def result_text($node):
  ( [ ($node // {}) | .. | objects | (.text?, (.value? | select(type == "string"))) | select(. != null and . != "") ]
    | join("\n") ) | .[0:4000];

def slim_args($name):
  ((.arguments // "{}") | (try fromjson catch {}))
  | if type != "object" then {} else . end
  | ( if $name == "apply_patch" and (.input | type) == "string"
      then .input_headers = ( .input | split("\n") | map(select(startswith("*** "))) | join("\n") )
      else . end )
  | ( if $name == "replace_string_in_file" and (has("oldString") or has("newString"))
      then .has_replacement = true else . end )
  | del(.input, .content, .code, .newCode, .content_charset, .oldString, .newString)
  | with_entries( .value |= ( if type == "string" and (length > 4000) then (.[0:4000]) else . end ) );

{ type: "vscode_session_meta",
  session_id: (.sessionId // $sid),
  first_prompt: ( (.requests[0]?.message?.text // "") | tostring | .[0:200] ),
  model: ( .requests[0]?.modelId // "" ),
  agent_id: ( .requests[0]?.result?.metadata?.agentId // "" ),
  git_remote: $remote,
  cwd: $cwd },
( .requests[]? as $req
  | { type: "vscode_request",
      ts: ($req.timestamp // null),
      model: ($req.modelId // ""),
      agent_id: ($req.result?.metadata?.agentId // ""),
      user: ( ($req.message?.text // "") | tostring ),
      thinking: [ $req.response[]? | select(type == "object" and .kind == "thinking") | .value | select(type == "string") ],
      text: ( [ $req.response[]? | select(type == "object" and (has("kind") | not)) | .value | select(type == "string") ] | join("\n") | .[0:8000] ),
      tools: [ $req.result?.metadata?.toolCallRounds[]?.toolCalls[]?
               | { name: .name, id: .id,
                   input: slim_args(.name),
                   result: result_text($req.result.metadata.toolCallResults[.id]) } ] } )
VSCODE_JQ_EOF

  local base hash_dir sessions_dir ws_json folder_uri cwd session_remote bucket sid raw out_file
  for base in "${bases[@]}"; do
    for hash_dir in "$base"/*/; do
      sessions_dir="${hash_dir}chatSessions"
      [ -d "$sessions_dir" ] || continue

      # Resolve the workspace folder from the sibling workspace.json. Multi-root
      # (.workspace), missing, or a non-file scheme -> unattributed (no cwd).
      ws_json="${hash_dir}workspace.json"
      cwd=""
      if [ -f "$ws_json" ]; then
        if [ -n "$(jq -r '.workspace // empty' "$ws_json" 2>/dev/null)" ]; then
          cwd=""  # multi-root workspace -> unattributed
        else
          folder_uri=$(jq -r '.folder // empty' "$ws_json" 2>/dev/null || true)
          cwd=$(_vscode_decode_folder_uri "$folder_uri")
        fi
      fi

      # Resolve remote from the workspace path: live -> get_git_remote; dead ->
      # resolve_remote_for_dead_cwd, then the Conductor project-cache fallback
      # (mirrors extract_opencode_db, since the resolver returns empty for
      # Conductor dead-workspace paths).
      session_remote=""
      if [ -n "$cwd" ]; then
        if [ -e "$cwd" ]; then
          session_remote=$(get_git_remote "$cwd")
        else
          session_remote=$(resolve_remote_for_dead_cwd "$cwd" || true)
          if [ -z "$session_remote" ]; then
            local _normalized_ws="${cwd%/}"
            local _ws_parent=""
            case "$_normalized_ws" in
              */conductor/workspaces/*/*) _ws_parent="${_normalized_ws%/*}" ;;
              */.conductor/*) _ws_parent="${_normalized_ws%%/.conductor/*}/.conductor" ;;
            esac
            if [ -n "$_ws_parent" ]; then
              local _cache_file="${HOME}/.paxel/cache/project-remotes-v2.tsv"
              if [ -f "$_cache_file" ]; then
                local _dir _key _rest _row_cwd
                while IFS=$'\t' read -r _dir _key _rest; do
                  [ -z "$_key" ] && continue
                  case "$_key" in name:*|local:*|unknown) continue ;; esac
                  _row_cwd=$(get_project_cwd "$_dir" 2>/dev/null || true)
                  [ -z "$_row_cwd" ] && continue
                  if [ "${_row_cwd%/*}" = "$_ws_parent" ]; then
                    session_remote="$_key"
                    break
                  fi
                done < "$_cache_file"
              fi
            fi
          fi
        fi
      fi

      # Per-project --project / selected_remote filter.
      if [ -n "$sel_norm" ]; then
        local rn
        rn=$(normalize_remote "$session_remote")
        [ "$rn" != "$sel_norm" ] && continue
      fi

      bucket="_vscode_unattributed"
      [ -n "$cwd" ] && bucket="_vscode_$(basename "$cwd")_$(stable_hash6 "$cwd")"

      for raw in "$sessions_dir"/*.json; do
        [ -f "$raw" ] || continue
        # --since filter via file mtime (portable: GNU stat -c, then BSD stat -f).
        if [ -n "${SINCE_EPOCH:-}" ]; then
          local fm
          fm=$(stat -c %Y "$raw" 2>/dev/null || stat -f %m "$raw" 2>/dev/null || echo "0")
          [ "$fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
        fi
        sid=$(jq -r '.sessionId // empty' "$raw" 2>/dev/null || true)
        sid=${sid//$'\r'/}  # jq <1.7 on Windows emits CRLF; a \r taints the filename
        [ -z "$sid" ] && continue  # fail-closed: never emit a stray _vscode_/.jsonl
        mkdir -p "$tmpdir/$bucket"
        out_file="$tmpdir/$bucket/${sid}.jsonl"
        [ -f "$out_file" ] && continue  # dedupe across base dirs / hash dirs
        if ! _vscode_slim_session "$raw" "$out_file" "$sid" "$session_remote" "$cwd" "$jq_file"; then
          rm -f "$out_file"
          continue
        fi
        # Fail-closed: drop an empty slim (jq produced nothing usable).
        [ -s "$out_file" ] || { rm -f "$out_file"; continue; }
      done

      if [ -n "$(find "$tmpdir/$bucket" -maxdepth 1 -name '*.jsonl' -print -quit 2>/dev/null)" ]; then
        _vscode_write_sidecar "$tmpdir" "$bucket" "$session_remote" "$cwd"
      fi
    done
  done

  rm -f "$jq_file"

  local v_count
  v_count=$(find "$tmpdir" -maxdepth 2 -path "*/_vscode_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$v_count" -gt 0 ]; then
    local v_bytes ws_count
    v_bytes=$(find "$tmpdir" -path "*/_vscode_*/*.jsonl" -exec cat {} + 2>/dev/null | wc -c | tr -d ' ')
    ws_count=$(find "$tmpdir" -maxdepth 1 -type d -name "_vscode_*" 2>/dev/null | wc -l | tr -d ' ')
    echo "  VS Code Copilot: ${v_count} sessions, $(($v_bytes / 1024))KB (${ws_count} workspaces)" >&2
    if declare -f _refresh_orphan_recovery_count >/dev/null 2>&1; then
      _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
    fi
  else
    rmdir "$tmpdir"/_vscode_* 2>/dev/null || true
  fi
  return 0
}

# Count top-level VS Code Copilot sessions for the time estimate + zero-session
# guard. With a selected_remote, counts only workspaces whose resolved folder
# maps to that remote. Prelude display only. Echoes 0 on any problem. A fast
# find over chatSessions/*.json honoring --since (file mtime) — does NOT jq-slim.
count_vscode_copilot_sessions() {
  local selected_remote="${1:-}"
  command -v jq &>/dev/null || { echo 0; return; }

  local -a bases=()
  local _base
  while IFS= read -r _base; do
    [ -z "$_base" ] && continue
    [ -d "$_base" ] && bases+=("$_base")
  done <<< "$VSCODE_DIR"
  [ "${#bases[@]}" -eq 0 ] && { echo 0; return; }

  local sel_norm=""
  [ -n "$selected_remote" ] && sel_norm=$(normalize_remote "$selected_remote")

  local total=0 base hash_dir sessions_dir ws_json folder_uri cwd remote rn raw fm
  for base in "${bases[@]}"; do
    for hash_dir in "$base"/*/; do
      sessions_dir="${hash_dir}chatSessions"
      [ -d "$sessions_dir" ] || continue

      if [ -n "$sel_norm" ]; then
        ws_json="${hash_dir}workspace.json"
        cwd=""
        if [ -f "$ws_json" ]; then
          if [ -z "$(jq -r '.workspace // empty' "$ws_json" 2>/dev/null)" ]; then
            folder_uri=$(jq -r '.folder // empty' "$ws_json" 2>/dev/null || true)
            cwd=$(_vscode_decode_folder_uri "$folder_uri")
          fi
        fi
        [ -z "$cwd" ] && continue
        if [ -e "$cwd" ]; then
          remote=$(get_git_remote "$cwd")
        else
          remote=$(resolve_remote_for_dead_cwd "$cwd" || true)
        fi
        rn=$(normalize_remote "$remote")
        [ "$rn" != "$sel_norm" ] && continue
      fi

      for raw in "$sessions_dir"/*.json; do
        [ -f "$raw" ] || continue
        if [ -n "${SINCE_EPOCH:-}" ]; then
          fm=$(stat -c %Y "$raw" 2>/dev/null || stat -f %m "$raw" 2>/dev/null || echo "0")
          [ "$fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
        fi
        total=$((total + 1))
      done
    done
  done
  echo "$total"
}

# Fallback: read origin URL from a jj workspace when git's standard probe
# can't find it (non-colocated jj checkout with no .git dir).
get_jj_remote() {
  local cwd="$1"
  [ -z "$cwd" ] && echo "" && return
  [ ! -d "$cwd" ] && echo "" && return
  [ ! -d "$cwd/.jj" ] && echo "" && return
  command -v jj >/dev/null 2>&1 || { echo ""; return; }

  local jj_remotes
  jj_remotes=$(jj git remote list --repository "$cwd" 2>/dev/null || true)
  local remote
  remote=$(echo "$jj_remotes" | awk '$1 == "origin" { if ($2 == "<no" && $3 == "URL>") print "<no URL>"; else print $2; exit }')
  [ "$remote" = "<no URL>" ] && echo "" || echo "$remote"
}

# Get canonical git remote URL (passes through normalize_remote below so that
# every caller's grouping key is the same canonical form the server uses in
# Repository.normalize_remote). Falls back to jj when git has no origin.

get_git_remote() {
  local cwd="$1"
  [ -z "$cwd" ] && echo "" && return
  [ ! -d "$cwd" ] && echo "" && return

  local remote
  remote=$(git -C "$cwd" remote get-url origin 2>/dev/null || true)
  if [ -z "$remote" ]; then
    remote=$(get_jj_remote "$cwd")
  fi
  normalize_remote "$remote"
}

# Normalize a git remote URL to the same canonical form the server uses in
# Repository.normalize_remote (app/models/repository.rb). This lets the
# client's exact-string filters (Codex repository_url vs the selected project's
# origin) treat https:// and git@: as the same repo — otherwise a user with
# mixed https/ssh remotes silently loses Codex coverage for their project.
# Port of app/models/repository.rb:16-34. Returns the normalized form, or
# empty string when the input is blank.
normalize_remote() {
  local url="$1"
  [ -z "$url" ] && echo "" && return
  local n="$url"
  # Strip leading/trailing whitespace
  n=$(printf '%s' "$n" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  # Strip ssh:// and http(s):// schemes
  n="${n#ssh://}"
  n="${n#https://}"
  n="${n#http://}"
  # Convert git@host:path -> host/path
  n=$(printf '%s' "$n" | sed 's|^git@\([^:]*\):|\1/|')
  # Strip trailing .git
  n="${n%.git}"
  # Strip trailing /
  n="${n%/}"
  # Strip any remaining leading user@ (e.g. ssh://other-user@host/path after scheme strip)
  n=$(printf '%s' "$n" | sed 's|^[^@/]*@||')
  printf '%s' "$n"
}

# Encode an absolute path the way Claude Code names its project dirs: replace
# BOTH "/" AND "." with "-" (e.g. /Users/a/x70.one -> -Users-a-x70-one). Used by
# Strategy-2 auto-detect to match the current dir against ~/.claude/projects/.
# Matching only "/" silently broke detection for any cwd containing a dot
# (x70.one, qerdp.co.uk, macOS /var/folders/.../T/tmp.X) — see SESSION_DETECTION.md
# §3a. "." is a literal inside the [] bracket expression on BSD + GNU sed.
encode_claude_dir_name() {
  printf '%s' "$1" | sed 's|[/.]|-|g'
}

# Backfill missing remotes for Conductor workspaces by finding siblings.
# Conductor creates worktrees in two path patterns:
#   New: ~/conductor/workspaces/{project}/{workspace}
#   Old: {any_path}/.conductor/{workspace}
# When a workspace is cleaned up, the CWD no longer exists and git remote
# resolution fails. We recover by finding a sibling workspace for the same
# project that DID resolve and reusing its remote.
# Operates on global arrays: _bfc_cwds[], _bfc_remotes[]
# Mutates _bfc_remotes[] in place.
backfill_conductor_remotes() {
  local j=0
  local total=${#_bfc_cwds[@]}
  while [ $j -lt $total ]; do
    if [ -z "${_bfc_remotes[$j]}" ]; then
      local cwd="${_bfc_cwds[$j]}"
      local conductor_pattern=""

      if [[ "$cwd" == */conductor/workspaces/*/* ]]; then
        # New pattern: ~/conductor/workspaces/{project}/*
        conductor_pattern="*/conductor/workspaces/$(echo "$cwd" | sed 's|.*/conductor/workspaces/||; s|/.*||')/*"
      elif [[ "$cwd" == */.conductor/* ]]; then
        # Old pattern: {any_path}/.conductor/*
        local project_root="${cwd%%/.conductor/*}"
        conductor_pattern="${project_root}/.conductor/*"
      fi

      if [ -n "$conductor_pattern" ]; then
        local k=0
        while [ $k -lt $total ]; do
          if [ -n "${_bfc_remotes[$k]}" ] && [[ "${_bfc_cwds[$k]}" == ${conductor_pattern} ]]; then
            _bfc_remotes[$j]="${_bfc_remotes[$k]}"
            _log_recovery_source "$cwd" "conductor-backfill"
            break
          fi
          k=$((k + 1))
        done

        # For new pattern, also check for a non-Conductor dir with the same
        # project name (e.g., ~/infra for conductor/workspaces/infra/*)
        if [ -z "${_bfc_remotes[$j]}" ] && [[ "$cwd" == */conductor/workspaces/*/* ]]; then
          local project_name
          project_name=$(echo "$cwd" | sed 's|.*/conductor/workspaces/||; s|/.*||')
          local k=0
          while [ $k -lt $total ]; do
            if [ -n "${_bfc_remotes[$k]}" ]; then
              local sibling_basename
              sibling_basename=$(basename "${_bfc_cwds[$k]}")
              if [ "$sibling_basename" = "$project_name" ] && [[ "${_bfc_cwds[$k]}" != */conductor/workspaces/* ]]; then
                _bfc_remotes[$j]="${_bfc_remotes[$k]}"
                _log_recovery_source "$cwd" "conductor-backfill"
                break
              fi
            fi
            k=$((k + 1))
          done
        fi

        # For old pattern, also check the project root dir (e.g., ~/code)
        if [ -z "${_bfc_remotes[$j]}" ] && [[ "$cwd" == */.conductor/* ]]; then
          local project_root="${cwd%%/.conductor/*}"
          local k=0
          while [ $k -lt $total ]; do
            if [ -n "${_bfc_remotes[$k]}" ] && [ "${_bfc_cwds[$k]}" = "$project_root" ]; then
              _bfc_remotes[$j]="${_bfc_remotes[$k]}"
              _log_recovery_source "$cwd" "conductor-backfill"
              break
            fi
            k=$((k + 1))
          done
        fi
      fi
    fi
    j=$((j + 1))
  done
}

# Disk-backed dedup log for orphan-cwd recovery activity. The resolver
# runs inside `$(...)` subshells at every call site, so in-memory counters
# and assoc arrays can't survive across invocations. A file append does.
#
# Schema: `<cwd><TAB><source>` per line. `<source>` is one of:
#   ancestor, worktree-list, jj-workspace-list, project-cache,
#   conductor-backfill, unresolvable.
#
# Two readers consume this log:
#   - _rmdc_recovery_count_unique: counts unique cwds for the legacy
#     orphan_recovery_count metric. Filters out `unresolvable` rows
#     so the metric keeps its "successful recoveries" semantics.
#   - _recovery_source_breakdown: emits a per-source CSV for the
#     recovery_breakdown telemetry field (all sources including
#     unresolvable).
#
# Summary line in list_projects_grouped reads unique lines; sidecar
# writes (PR #566) can compute scoped deltas via snapshot-before/after.
# If mktemp fails, the log stays empty and the summary reports 0 — the
# per-recovery stderr lines still fire, so activity is visible.
#
# In the Functions section so bats `extract_functions` picks it up;
# cleanup trap lives at script top-level.
_RMDC_LOG_FILE=""
if _rmdc_tmp=$(mktemp -t paxel_recoveries.XXXXXX 2>/dev/null); then
  _RMDC_LOG_FILE="$_rmdc_tmp"
fi
unset _rmdc_tmp 2>/dev/null || true

# Docker --all sidecar staging path. Computed lazily at call time (not
# at script load) so bats tests that override $HOME after source see the
# correct per-test path. Deterministic $$-naming mirrors the existing
# $$-suffixed tmpdirs at cleanup_temp_dirs:82-86; both the parent shell
# and _docker_all_host_scan_for_recovery's ( ... ) subshell compute the
# same path independently. Tests override via `export
# _DOCKER_ALL_SIDECAR_DIR=...` before calling the helper.
_docker_all_sidecar_dir() {
  printf '%s' "${_DOCKER_ALL_SIDECAR_DIR:-${HOME}/.paxel/cache/docker-all-sidecar-$$}"
}

# `--all` git extraction. Writes per-repo numstat + commit-count into the
# sidecar's _git/ dir so the container can SUM them into one combined
# git_metrics (ClientPipeline#collect_git_data_aggregate). Only numstat +
# commit_count are emitted — the aggregate deliberately skips recent_commits /
# author files to avoid cross-repo episode mislinking server-side. Deduped by
# git_remote (worktrees of one repo extract once); jq-independent (git only).
# get_project_cwd / get_git_remote resolve against CLAUDE_DIR, so we pin it to
# the passed dir for the duration (dynamic scope reaches the called helpers).
_docker_all_extract_git_data() {
  local CLAUDE_DIR="$1"
  [ -d "$CLAUDE_DIR" ] || return 0

  local git_out
  git_out="$(_docker_all_sidecar_dir)/_git"
  # mkdir our own _git/ — the recovery scan only creates the sidecar root when
  # jq is present, but git extraction needs no jq.
  mkdir -p "$git_out"

  local since_flag=""
  if [ -n "${SINCE_EPOCH:-}" ]; then
    since_flag="--since=$(date -r "$SINCE_EPOCH" '+%Y-%m-%d' 2>/dev/null || date -d "@$SINCE_EPOCH" '+%Y-%m-%d' 2>/dev/null || echo '')"
  fi

  local seen_keys="|"
  local extracted=0
  local proj_dir
  for proj_dir in "$CLAUDE_DIR"/*/; do
    [ -d "$proj_dir" ] || continue
    local pname
    pname=$(basename "$proj_dir")

    local pcwd
    pcwd=$(get_project_cwd "$pname")
    if [ -z "$pcwd" ] || [ ! -e "$pcwd/.git" ]; then
      continue
    fi

    local premote
    premote=$(get_git_remote "$pcwd")
    # Dedup by remote (fall back to cwd for no-origin repos) so worktrees of one
    # repo aren't extracted N times.
    local key="${premote:-$pcwd}"
    case "$seen_keys" in
      *"|${key}|"*) continue ;;
    esac
    seen_keys="${seen_keys}${key}|"

    local encoded
    encoded=$(echo "$pname" | sed 's/[^a-zA-Z0-9_-]/_/g')

    git -C "$pcwd" rev-list --count HEAD \
      > "${git_out}/${encoded}_commit_count.txt" 2>/dev/null || true
    _run_with_timeout "$PAXEL_GIT_TIMEOUT" \
      git -C "$pcwd" log -${COMMIT_LIMIT:-1000} $since_flag \
      --format='COMMIT_BOUNDARY %H %aI %aN <%aE>' --numstat \
      > "${git_out}/${encoded}_numstat.txt" 2>/dev/null || true
    extracted=$((extracted + 1))
  done

  if [ "$extracted" -gt 0 ]; then
    local _rl="repos"
    [ "$extracted" -eq 1 ] && _rl="repo"
    echo "  Extracted git history from ${extracted} ${_rl}"
  fi
  # Always succeed — a zero-repo result (all dead cwds) must NOT return 1, or the
  # caller's `set -Eeuo pipefail` would fire the ERR trap and abort the upload.
  return 0
}

# Append a recovery-source row to _RMDC_LOG_FILE. Single writer for
# the log; resolver, backfill, project-cache and P1's unresolvable-warning
# all flow through here.
#
# Init-order dependency: _RMDC_LOG_FILE is set at top-level load time
# above. The empty-var guard returns 0 silently if the helper is called
# before init (e.g. when sourced by bats), so tests can pre-set
# _RMDC_LOG_FILE themselves without the mktemp path firing.
#
# Source names must match [a-z_-]+ — downstream CSV/JSON transforms
# split on ':' and ',' and use a hyphen→underscore rewrite. A source
# name containing ':' or ',' silently corrupts the sidecar's
# recovery_breakdown JSON. Keep additions lowercase with hyphens.
_log_recovery_source() {
  local cwd="$1"
  local source="$2"
  [ -z "${_RMDC_LOG_FILE:-}" ] && return 0
  [ -z "$cwd" ] && return 0
  [ -z "$source" ] && return 0
  printf '%s\t%s\n' "$cwd" "$source" >> "$_RMDC_LOG_FILE" 2>/dev/null || true
}

# Emit a user-visible warning when a Conductor dead-cwd exhausted every
# attribution strategy (resolver short-circuits Conductor paths, sibling
# walks + ancestor probe don't apply, project-cache had no prior row).
# Closes the §9d support-triage gap documented in
# docs/designs/SESSION_DETECTION.md — without this, the dir's sessions
# silently land under an encoded-name orphan Project, and the recovery
# path (run from a live workspace to warm the cache) is undiscoverable.
#
# Mode-neutral phrasing ("re-run this upload") works for both
# `curl | bash` and `bin/upload` invocation paths.
#
# Suppresses entirely under PAXEL_NO_ORPHAN_RECOVERY=1. The project-cache
# fallback that would have populated the cache is also gated on that
# flag, so when the user opts out the cache was never consulted —
# emitting "no cached remote" would misrepresent state. The opt-out is
# a power-user escape hatch; honor "be quiet."
#
# Gated on the Conductor path pattern. Standalone ~/code/foo deletions
# hit the same premote-empty/pcwd-dead shape but are expected to orphan
# silently (encoded_name grouping is working as designed for those).
#
# Logs `<pcwd>\tunresolvable` to _RMDC_LOG_FILE so
# _recovery_source_breakdown includes an `unresolvable` bucket.
_warn_unresolvable_conductor_cwd() {
  [ "${PAXEL_NO_ORPHAN_RECOVERY:-0}" = "1" ] && return 0
  local pname="$1"
  local pcwd="$2"
  case "$pcwd" in
    */conductor/workspaces/*/*|*/.conductor/*) ;;
    *) return 0 ;;
  esac
  echo "[paxel] warning: couldn't attribute ${pname}'s sessions to a repo." >&2
  echo "  cwd: ${pcwd} (deleted)" >&2
  echo "  no cached remote for this project, and no live sibling workspace to" >&2
  echo "  infer from. To recover, re-run this upload from inside a live" >&2
  echo "  workspace of this project." >&2
  _log_recovery_source "$pcwd" "unresolvable"
}

# Host-side recovery-detection pass for Docker --all mode. Mirrors the
# detection subset of collect_all_projects's Claude loop (:3220-3262):
# walk $CLAUDE_DIR's encoded project dirs, compute pcwd + try
# get_git_remote, and for dead cwds fall through resolve_remote_for_dead_cwd
# → project-cache fallback → _warn_unresolvable_conductor_cwd.
#
# Scope: detection ONLY. Does NOT write archive sidecars (run_docker_mode
# bind-mounts $CLAUDE_DIR into the container, which reads it directly
# without a sidecar handoff) and does NOT persist cache TSV rows
# (self-warming Docker --all is a separate design question — surprising
# behavior to have bin/upload mutate ~/.paxel/cache without opt-in).
#
# Writes to _RMDC_LOG_FILE via _log_recovery_source only, so the
# env-var passthrough at run_docker_analysis's PAXEL_RECOVERY_BREAKDOWN
# block can forward non-zero counts to the container.
#
# Drift risk: if collect_all_projects's recovery strategies change (new
# source, reordered gates), mirror the change here. Long-term, extract
# a shared detection helper — out of scope for this follow-up.
#
# Runs the detection walk in a ( ... ) subshell so the CLAUDE_DIR
# mutation is scoped — no manual save/restore, and exception-safe
# under set -Eeuo pipefail if a future edit adds a command that can
# trip set -e inside the loop. _RMDC_LOG_FILE writes propagate out of
# the subshell via the filesystem (same pattern as the resolver's
# $(...) callers); stderr warnings propagate via fd inheritance.
#
# Self-warming cache persistence (PR after-#690): every project dir
# (live OR recovered) writes a row to $_cache_rows_file, which is
# merged into ~/.paxel/cache/project-remotes-v2.tsv at the end of the
# scan. This closes the §9d first-run-after-delete gap for Docker
# --all users — a workspace that was live during a prior bin/upload
# is recoverable from the cache after it's deleted, symmetric with
# how legacy --all (collect_all_projects:3376) already warms the
# cache. Row format mirrors collect_all_projects:3371.
_docker_all_host_scan_for_recovery() {
  local claude_dir="${1:-${CLAUDE_DIR:-}}"
  [ -d "$claude_dir" ] || return 0
  # No jq guard: get_project_cwd has grep/JSONL fallbacks (:734, :754),
  # so jq-less hosts still resolve pcwd correctly. Verified by pre-ship
  # review of this change.

  (
    cd "$claude_dir" || return 0
    CLAUDE_DIR="$(pwd)"
    local _cache_rows_file
    _cache_rows_file=$(mktemp)

    # Sidecar for the container's TranscriptDiscoverer.read_sidecar
    # secondary-path fallback. Docker --all bind-mounts $CLAUDE_DIR
    # read-only, so the container has no archive sidecar; we write one
    # here to a host-side staging dir and run_docker_analysis bind-mounts
    # it at /paxel_sidecar:ro. jq-less hosts skip the write (container
    # falls back to encoded_name, same as today — no regression).
    local _sidecar_root="" _sidecar_tmp=""
    if command -v jq &>/dev/null; then
      _sidecar_root="$(_docker_all_sidecar_dir)"
      if mkdir -p "$_sidecar_root" 2>/dev/null; then
        _sidecar_tmp="$_sidecar_root/_metadata.json"
        printf '%s' '{"version":1,"directories":{}}' > "$_sidecar_tmp" 2>/dev/null || _sidecar_tmp=""
      fi
    fi

    local proj_dir pname pcwd premote _p_inferred
    for proj_dir in */; do
      [ -d "$proj_dir" ] || continue
      pname="${proj_dir%/}"
      pcwd=$(get_project_cwd "$pname")
      premote=$(get_git_remote "$pcwd")
      _p_inferred=0
      if [ -z "$premote" ] && [ -n "$pcwd" ] && [ ! -e "$pcwd" ]; then
        # resolve_remote_for_dead_cwd's "[paxel] Recovered remote ..."
        # stderr (ancestor/worktree-list/jj-workspace-list at :1766,
        # :1827, :1850) flows through — Docker --all now attributes
        # sessions end-to-end via the host-written sidecar, so the
        # message is accurate rather than misleading.
        premote=$(resolve_remote_for_dead_cwd "$pcwd" || true)
        [ -n "$premote" ] && _p_inferred=1
        if [ -z "$premote" ] && [ "${PAXEL_NO_ORPHAN_RECOVERY:-0}" != "1" ]; then
          case "$pcwd" in
            */conductor/workspaces/*/*|*/.conductor/*)
              # `|| true` matches resolve_remote_for_dead_cwd's style above
              # for defense-in-depth under set -Eeuo pipefail, even though
              # _project_cache_read_remote can't fail on its current impl.
              premote=$(_project_cache_read_remote "$pname" || true)
              if [ -n "$premote" ]; then
                echo "[paxel] Recovered remote for $pcwd via project-cache($pname) -> $premote" >&2
                _log_recovery_source "$pcwd" "project-cache"
                _p_inferred=1
              fi
              ;;
          esac
        fi
        if [ -z "$premote" ]; then
          _warn_unresolvable_conductor_cwd "$pname" "$pcwd"
        fi
      fi

      # Cache-row skip gates — preserve any existing cached row for this
      # dir when the scan couldn't fully evaluate the current state.
      # Without these, the merge in _project_cache_persist_rows would
      # overwrite a valid warmed remote with an empty one, erasing the
      # only recovery signal available to future runs.
      #
      # 1. Both pcwd + premote empty = no routing signal at all.
      #    Mirrors legacy collect_all_projects:3344's skip, which
      #    continues past this dir entirely.
      # 2. PAXEL_NO_ORPHAN_RECOVERY=1 + empty premote + DEAD cwd =
      #    recovery paths (resolver, cache fallback) were SKIPPED by the
      #    opt-out, so "empty" means "we didn't look" rather than
      #    "verified unresolvable". Writing empty here would clobber
      #    the user's warmed cache. Preserve existing rows.
      #
      #    Gate must be narrow: opt-out + empty premote + LIVE cwd
      #    means get_git_remote DID run and verified the live workspace
      #    has no origin — a legitimate clear-stale-cache case. Keep
      #    writing in that branch (matching the non-opt-out live path).
      #    Legacy collect_all_projects:3438 mirrors this exact gate (PR
      #    #712) so both --all paths converge on the same semantics.
      [ -z "$premote" ] && [ -z "$pcwd" ] && continue
      if [ "${PAXEL_NO_ORPHAN_RECOVERY:-0}" = "1" ] \
          && [ -z "$premote" ] \
          && [ -n "$pcwd" ] \
          && [ ! -e "$pcwd" ]; then
        continue
      fi

      # Record a cache row. Persist empty-remote rows ONLY when we
      # actually verified emptiness (non-opt-out, premote-tried-and-failed)
      # — they clear stale cache entries from a prior live run whose
      # remote has since disappeared; without this, a dir that loses
      # its remote would keep the stale one forever. Mirrors
      # collect_all_projects:3355-3371's row format.
      # BSD find/stat parse leading `-` of encoded Claude dir names
      # (`-Users-...`) as option flags; `./$pname` forces path interpretation.
      local _pd_sessions _pd_mtime
      _pd_sessions=$(find "./$pname" -maxdepth 3 -name "*.jsonl" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
      _pd_mtime=$(stat -c %Y "./$pname" 2>/dev/null || stat -f %m "./$pname" 2>/dev/null || echo "0")
      printf '%s\t%s\t%s\t%s\t%s\n' "$pname" "$premote" "${_pd_sessions:-0}" "${_pd_mtime:-0}" "$_p_inferred" >> "$_cache_rows_file"

      # Sidecar entry for TranscriptDiscoverer.read_sidecar fallback.
      # Only write when we resolved a non-empty remote — empty-remote
      # dirs server-side already fall back to encoded_name, which is
      # correct for them. `|| true` on the jq invocation so a stubbed
      # jq (CJ10e) that exits non-zero doesn't abort the scan under
      # set -Eeuo pipefail. Mirrors the legacy sidecar write at :3412.
      if [ -n "$_sidecar_tmp" ] && [ -n "$premote" ]; then
        local _sc_updated
        _sc_updated=$(jq \
          --arg dir "$pname" \
          --arg remote "$premote" \
          --arg cwd "${pcwd:-}" \
          '.directories[$dir] = {"git_remote": $remote, "cwd": $cwd}' \
          "$_sidecar_tmp" 2>/dev/null || true)
        [ -n "$_sc_updated" ] && printf '%s' "$_sc_updated" > "$_sidecar_tmp"
      fi
    done

    # Merge collected rows into the project-remote cache. Same helper
    # collect_all_projects uses at :3376; unconditional of
    # PAXEL_NO_ORPHAN_RECOVERY (that flag gates READS from the cache,
    # not writes — consistent with legacy behavior).
    _project_cache_persist_rows "$_cache_rows_file"
    rm -f "$_cache_rows_file"
  )
}

# Recover a git or jj remote for a session whose cwd no longer exists on
# disk. Used for orphan Claude/Codex/Cursor sessions from deleted
# subdirectories or sibling worktrees. Returns "" on miss; callers decide
# fallback.
#
# Strategies, in order:
#   1. Ancestor walk — if a parent of $cwd is a live git repo (.git
#      present) or pure-jj workspace (.jj/ present), use its remote.
#      Low false-positive risk: a session inside a subdirectory usually
#      belongs to the enclosing repo. Pure-jj matches bypass
#      get_git_remote (which would walk past the marker via git's own
#      discovery) and call get_jj_remote directly, anchoring the lookup.
#   2. Sibling-worktree cross-reference — for stems of $(basename $cwd),
#      check if $parent/$stem is a git repo whose `git worktree list
#      --porcelain` still mentions $cwd. Catches worktrees removed with
#      `rm -rf` before `git worktree prune`. Git-only: jj's workspace
#      list semantics don't plug into this verifier directly.
#
# Conductor paths short-circuit at the top — those are handled by
# backfill_conductor_remotes, which understands fork/branch-specific
# remote semantics the ancestor walk would flatten.
#
# On successful recovery, appends $cwd to $_RMDC_LOG_FILE so callers can
# read a deduped count post-hoc. Counters-in-parent-scope don't work here:
# the resolver is invoked via $(...), which creates a subshell — in-function
# variable mutations don't propagate. A file append does.

# Cross-reference a dead cwd against a sibling jj repo's workspace list.
# Returns 0 if any of the sibling's workspaces has a root path matching the
# dead cwd (either as an on-disk root or via a resolved error-line path for
# a workspace whose dir was rm -rf'd without `jj workspace forget`).
#
# jj's workspace list template has no keyword for the stored relative path —
# `root` resolves it, and errors out inline when the path is missing. The
# error embeds the `../..` form (e.g. `<cand>/.jj/repo/../../../dead-ws`),
# which is bash-normalizable to the canonical path. Covers the
# non-Conductor dead-jj-sibling case: workspace dir deleted via filesystem
# rm, never through `jj workspace forget`. Conductor paths short-circuit at
# the top of `resolve_remote_for_dead_cwd` and route through
# PR #614's `project-remotes-v2.tsv` cache instead — this verifier is not
# reached for `*/conductor/workspaces/*` or `*/.conductor/*` cwds.
#
# Args: $1 = candidate jj repo dir, $2 = original dead cwd, $3 = canonical
# dead cwd. Returns 0/1. Silent on success; prints nothing (caller logs).
_jj_sibling_workspace_match() {
  local cand="$1"
  local cwd="$2"
  local canonical_cwd="$3"

  local out
  out=$(jj workspace list --repository "$cand" -T 'root ++ "\n"' 2>/dev/null) || return 1
  [ -z "$out" ] && return 1

  local line
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    case "$line" in
      /*)
        # Valid root line: exact match against dead cwd wins. (Prefix-matching
        # to catch "dead subdir of live workspace" is already handled by the
        # ancestor walk above, so we don't need it here.)
        if [ "$line" = "$cwd" ] || [ "$line" = "$canonical_cwd" ]; then
          return 0
        fi
        ;;
      *'<Error: Failed to resolve workspace root:'*)
        # Error line format (jj 0.40.x):
        #   <Error: Failed to resolve workspace root: <name>: <abs-path>: <os-err>>
        # Anchor on `: /` (workspace paths are always absolute) instead of
        # counting `: ` separators — jj allows workspace names containing
        # `: ` (e.g. `jj workspace add -n "feat: bugfix" path`), and a
        # separator-count parser drops the tail of the name into the extracted
        # path and produces a non-absolute string that silently misses.
        local raw
        raw=$(printf '%s' "$line" | awk '
          {
            i = index($0, "workspace root: ")
            if (i == 0) next
            rest = substr($0, i + length("workspace root: "))
            sub(/>$/, "", rest)  # trim trailing close-angle
            # Locate the `: ` whose RHS starts with `/` — that is the separator
            # right before the absolute path. Walk from the front; the first
            # occurrence is correct because a workspace name starting with `: /`
            # after a `: ` would itself begin with `/`, which is pathologically
            # rare enough not to worry about here.
            path_start = 0
            for (k = 1; k <= length(rest) - 2; k++) {
              if (substr(rest, k, 2) == ": " && substr(rest, k + 2, 1) == "/") {
                path_start = k + 2
                break
              }
            }
            if (path_start == 0) next
            tail = substr(rest, path_start)
            # The path ends at the FINAL `: ` (the one before the os-err tail).
            # os-err text comes from the std::io::Error Display impl — on Unix
            # it is single-line and has no `: ` inside, so last-match is safe.
            last = 0
            for (k = 1; k <= length(tail) - 1; k++) {
              if (substr(tail, k, 2) == ": ") last = k
            }
            if (last > 0) print substr(tail, 1, last - 1)
          }')
        [ -z "$raw" ] && continue
        local resolved
        resolved=$(_normpath_absolute "$raw")
        [ -z "$resolved" ] && continue
        if [ "$resolved" = "$cwd" ] || [ "$resolved" = "$canonical_cwd" ]; then
          return 0
        fi
        ;;
    esac
  done <<< "$out"
  return 1
}

# Collapse `.` and `..` components in an already-absolute path without
# consulting the filesystem (the target may not exist — the whole point
# of calling this from the jj sibling walk is that jj emits `../..` paths
# for removed workspaces). Returns empty if input isn't absolute.
_normpath_absolute() {
  local input="$1"
  case "$input" in
    /*) ;;
    *) return ;;
  esac
  printf '%s' "$input" | awk -F/ '
    {
      n = 0
      for (i = 1; i <= NF; i++) {
        if ($i == "" || $i == ".") continue
        if ($i == "..") { if (n > 0) n-- ; continue }
        parts[++n] = $i
      }
      if (n == 0) { printf "/" }
      else { for (i = 1; i <= n; i++) printf "/%s", parts[i] }
    }'
}

resolve_remote_for_dead_cwd() {
  local cwd="$1"
  [ -z "$cwd" ] && return 0
  [ -e "$cwd" ] && return 0
  [ "${PAXEL_NO_ORPHAN_RECOVERY:-0}" = "1" ] && return 0

  case "$cwd" in
    */conductor/workspaces/*|*/.conductor/*) return 0 ;;
  esac

  # _rmdc_source tracks which strategy succeeded so the single log
  # write at the function's exit can emit `<cwd>\t<source>`. Scoped
  # to this function's $(...) subshell — the file-append at the exit
  # escapes the subshell via fd inheritance (not via shell variable
  # propagation, which wouldn't work here).
  local recovered=""
  local _rmdc_source=""

  # Strategy 1: Ancestor walk. Matches on .git (dir or file — worktree/submodule
  # marker) or .jj (pure-jj workspace marker).
  #
  # For .git matches, get_git_remote's `git -C <p> remote get-url origin` is
  # repo-discovering and tolerates a .git at $p or at an enclosing ancestor —
  # either way it anchors to an actual git repo root. For .jj-only matches
  # (no .git at $p), get_git_remote would still run git's discovery and could
  # walk PAST $p to an enclosing git repo's origin, silently misattributing a
  # nested-jj-in-git layout. Call get_jj_remote directly for that branch to
  # anchor the lookup at $p.
  local p="$cwd"
  local home_guard="${HOME:-/nonexistent}"
  while :; do
    local _prev_p="$p"
    p="$(dirname "$p")"
    case "$p" in /|.|"$home_guard") break ;; esac
    # Stop at a root where dirname is idempotent: on Windows Git Bash
    # `dirname C:` returns `C:` (there is no leading "/"), so without this guard
    # the walk never reaches "/" and spins forever (PAXEL: aaryansr, Git Bash).
    [ "$p" = "$_prev_p" ] && break
    local r=""
    if [ -d "$p/.git" ] || [ -f "$p/.git" ]; then
      r=$(get_git_remote "$p")
    elif [ -d "$p/.jj" ]; then
      # Pure-jj ancestor: bypass get_git_remote to avoid git's repo-discovery
      # walking past $p. Normalize the raw URL to match the server's canonical
      # form (get_jj_remote does not normalize; get_git_remote does).
      local jj_raw
      jj_raw=$(get_jj_remote "$p")
      [ -n "$jj_raw" ] && r=$(normalize_remote "$jj_raw")
    fi
    if [ -n "$r" ]; then
      recovered="$r"
      _rmdc_source="ancestor"
      echo "[paxel] Recovered remote for $cwd via ancestor $p -> $r" >&2
      break
    fi
  done

  # Strategy 2: Sibling-worktree cross-reference.
  if [ -z "$recovered" ]; then
    local parent base
    parent="$(dirname "$cwd")"
    base="$(basename "$cwd")"
    # Canonicalize so the awk compare survives symlinked home dirs
    # (e.g. /home/x -> /data/x). The parent is still on-disk even when
    # the cwd itself is gone, so `cd && pwd -P` works.
    local canonical_cwd="$cwd"
    if [ -d "$parent" ]; then
      local real_parent
      real_parent=$(cd "$parent" 2>/dev/null && pwd -P 2>/dev/null) || real_parent=""
      [ -n "$real_parent" ] && canonical_cwd="$real_parent/$base"
    fi
    local -a stems=()
    # Digit strip: code1 -> code. %%[0-9]* removes longest trailing-digit run.
    local ds="${base%%[0-9]*}"
    [ -n "$ds" ] && [ "$ds" != "$base" ] && stems+=("$ds")
    # Dash walk: code-frontend-tests -> code-frontend -> code.
    # Longest-first order means a more-specific parent is tried before a
    # less-specific one if both exist (e.g. ~/code-frontend wins over ~/code
    # when the dead cwd is ~/code-frontend-tests).
    local ds2="$base"
    while [[ "$ds2" == *-* ]]; do
      ds2="${ds2%-*}"
      [ -n "$ds2" ] && stems+=("$ds2")
    done
    # Underscore walk: same pattern.
    local ds3="$base"
    while [[ "$ds3" == *_* ]]; do
      ds3="${ds3%_*}"
      [ -n "$ds3" ] && stems+=("$ds3")
    done

    local stem
    for stem in ${stems[@]+"${stems[@]}"}; do
      local cand="$parent/$stem"
      local has_git=0 has_jj=0
      { [ -d "$cand/.git" ] || [ -f "$cand/.git" ]; } && has_git=1
      [ -d "$cand/.jj" ] && has_jj=1
      [ "$has_git" -eq 0 ] && [ "$has_jj" -eq 0 ] && continue

      # Try git worktree list first when .git is present. Match full worktree
      # path, not awk $2 — paths can contain spaces. Compare against both the
      # original cwd and the symlink-resolved form.
      if [ "$has_git" -eq 1 ]; then
        if git -C "$cand" worktree list --porcelain 2>/dev/null \
            | awk -v t1="$cwd" -v t2="$canonical_cwd" '
                /^worktree / { sub(/^worktree /, ""); if ($0 == t1 || $0 == t2) { found=1; exit } }
                END { exit !found }
              '; then
          local r
          r=$(get_git_remote "$cand")
          if [ -n "$r" ]; then
            recovered="$r"
            _rmdc_source="worktree-list"
            echo "[paxel] Recovered remote for $cwd via worktree-list($stem) -> $r" >&2
            break
          fi
        fi
      fi

      # Fall through to jj workspace check when git didn't match. jj 0.40+
      # always creates `.git/` alongside `.jj/` on `jj git init`, so relying
      # on `.git`-absence to route to the jj branch fails in practice. The
      # jj check fires whenever .jj exists AND we haven't already recovered.
      # Covers non-Conductor rm -rf'd jj sibling workspaces: the removed
      # workspace is still in `jj workspace list` output as an inline
      # `<Error: …>` row whose path is bash-normalizable to the dead cwd.
      # Conductor cwds short-circuit above (see :1389-1391) and are handled
      # by PR #614's cache; this branch is unreachable for Conductor paths.
      if [ -z "$recovered" ] && [ "$has_jj" -eq 1 ]; then
        command -v jj >/dev/null 2>&1 || continue
        if _jj_sibling_workspace_match "$cand" "$cwd" "$canonical_cwd"; then
          local r
          r=$(get_jj_remote "$cand")
          if [ -n "$r" ]; then
            recovered=$(normalize_remote "$r")
            _rmdc_source="jj-workspace-list"
            echo "[paxel] Recovered remote for $cwd via jj-workspace-list($stem) -> $recovered" >&2
            break
          fi
        fi
      fi
    done
  fi

  if [ -n "$recovered" ]; then
    # Single write site for the resolver; fd inheritance propagates the
    # append out of the $(...) subshell so callers see a complete log.
    _log_recovery_source "$cwd" "$_rmdc_source"
  fi
  printf '%s' "$recovered"
}

# Count unique recovered cwds logged so far in this run. Preserves the
# legacy "successful recoveries" semantics: rows whose source is
# `unresolvable` (from P1's warning helper) are excluded — those are
# failures, not recoveries, and reporting them as recoveries would
# misrepresent the support-triage metric.
#
# Optional second arg: a previous-snapshot count, in which case we return
# the delta (unique cwds recovered since the snapshot was taken).
_rmdc_recovery_count_unique() {
  local prev="${1:-0}"
  local cur=0
  if [ -n "${_RMDC_LOG_FILE:-}" ] && [ -s "$_RMDC_LOG_FILE" ]; then
    cur=$(awk -F'\t' '$2 != "unresolvable" && !seen[$1]++' "$_RMDC_LOG_FILE" 2>/dev/null | wc -l | tr -d ' ')
  fi
  echo "$((cur - prev))"
}

# Emit a per-source CSV breakdown of recovery activity. Counts unique
# (cwd, source) pairs — since a cwd is resolved via at most one source
# in one run, this matches per-source cwd counts.
#
# Output shape: `ancestor:2,worktree_list:1,project_cache:3,unresolvable:1`
# Zero-count buckets are skipped; the server-side reader
# (ClientPipeline#read_recovery_breakdown) fills defaults for absent
# keys so downstream consumers always see the full 6-key hash.
#
# Hyphen→underscore transform happens inside the awk END block so
# future hyphenated source names (e.g. `docker-bind`) don't need a
# paired sed allowlist update. JSON-friendly keys without the
# character-brittleness of a fixed allowlist.
#
# Emits an empty string when the log is absent/empty — callers
# (_refresh_orphan_recovery_count, Docker env-var fallback) treat that
# as "no recoveries yet" and fall back to defaults.
_recovery_source_breakdown() {
  [ -z "${_RMDC_LOG_FILE:-}" ] && { echo ""; return 0; }
  [ ! -s "$_RMDC_LOG_FILE" ] && { echo ""; return 0; }
  awk -F'\t' '
    !seen[$1]++ { c[$2]++ }
    END {
      first = 1
      for (k in c) {
        key = k
        gsub(/-/, "_", key)
        if (!first) printf ","
        printf "%s:%d", key, c[k]
        first = 0
      }
    }
  ' "$_RMDC_LOG_FILE" 2>/dev/null
}

# Convert a `k1:v1,k2:v2` CSV to a `{"k1":v1,"k2":v2}` JSON object for
# jq --argjson consumption. Returns `{}` when given empty input.
_recovery_breakdown_csv_to_json() {
  local csv="$1"
  if [ -z "$csv" ]; then
    echo "{}"
    return 0
  fi
  printf '%s' "$csv" | awk -F',' '
    {
      printf "{"
      for (i = 1; i <= NF; i++) {
        split($i, kv, ":")
        if (i > 1) printf ","
        printf "\"%s\":%d", kv[1], kv[2]
      }
      printf "}"
    }
  '
}

# Refresh orphan_recovery_count in a sidecar to reflect resolver calls that
# fired AFTER the archive sidecar was initially written. The three archive
# write sites (collect_project_group, prepare_and_run_for_repo, run_docker_mode)
# all emit the counter BEFORE collect_cursor_sessions runs — but extract_cursor_db
# can call resolve_remote_for_dead_cwd for deleted Cursor workspaces, which
# appends to _RMDC_LOG_FILE after the snapshot. Callers invoke this helper
# after every collect_cursor_sessions so the on-disk counter stays honest.
#
# Semantics: aggregate run activity, NOT archive-exact. The resolver logs a
# recovery the moment it fires (inside extract_cursor_db, BEFORE the
# selected_remote filter at :980). Under `--project X`, a mixed Cursor DB
# can recover remotes for sessions that are then filtered out of the
# archive — the counter still increments. Matches the pre-existing comment
# near collect_project_group's initial write.
#
# Idempotent; safe to call with a non-existent sidecar path (no-op when
# the sidecar was never written, e.g. --all Docker mode which skips the
# archive sidecar entirely).
_refresh_orphan_recovery_count() {
  local sidecar="$1"
  [ -f "$sidecar" ] || return 0
  command -v jq &>/dev/null || return 0
  local total
  total=$(_rmdc_recovery_count_unique)
  local breakdown
  breakdown=$(_recovery_source_breakdown)
  local breakdown_json
  breakdown_json=$(_recovery_breakdown_csv_to_json "$breakdown")
  # _recovery_breakdown_csv_to_json always returns a valid JSON object
  # (empty-input path returns {}); no need for a default fallback.
  local updated
  updated=$(jq \
    --argjson r "${total:-0}" \
    --argjson b "$breakdown_json" \
    '.orphan_recovery_count = $r | .recovery_breakdown = $b' \
    "$sidecar" 2>/dev/null)
  [ -n "$updated" ] && printf '%s\n' "$updated" > "$sidecar"
}

# Group project directories by git remote
list_projects_grouped() {
  echo "Scanning projects..." >&2

  # Collect all Claude project dirs with jsonl files
  local all_dirs=()
  if [ -d "$CLAUDE_DIR" ]; then
    for dir in "$CLAUDE_DIR"/*/; do
      [ -d "$dir" ] || continue
      local name
      name=$(basename "$dir")
      local has_jsonl
      # `find -print -quit` SIGPIPEs on first match → ERR trap. Same family
      # as the OLDEST_SESSION_EPOCH fix (PR #389). See find_has_jsonl below.
      has_jsonl=$(find "$dir" -name "*.jsonl" -maxdepth 3 -print -quit 2>/dev/null || true)
      if [ -n "$has_jsonl" ]; then
        all_dirs+=("$name")
      fi
    done
  fi

  # Check for Codex sessions
  local has_codex=0
  if [ -d "$CODEX_DIR" ]; then
    local codex_check
    codex_check=$(find "$CODEX_DIR" -name "*.jsonl" -maxdepth 6 -print -quit 2>/dev/null || true)
    [ -n "$codex_check" ] && has_codex=1
  fi

  # Check for Cursor sessions (workspace DBs, global DB, or agent transcripts)
  local has_cursor=0
  local cursor_check
  if command -v sqlite3 &>/dev/null; then
    if [ -d "$CURSOR_DIR" ]; then
      cursor_check=$(find "$CURSOR_DIR" -name "state.vscdb" -maxdepth 2 -print -quit 2>/dev/null || true)
      [ -n "$cursor_check" ] && has_cursor=1
    fi
    [ -f "$CURSOR_GLOBAL_DB" ] && has_cursor=1
  fi
  # ~/.cursor/projects agent transcripts (current Cursor) need only jq —
  # probe presence unconditionally like VS Code so a missing sqlite3 can't
  # hide them; the tool hint below covers a missing jq.
  if [ "$has_cursor" -eq 0 ] && [ -d "${CURSOR_PROJECTS_DIR:-}" ]; then
    cursor_check=$(find "$CURSOR_PROJECTS_DIR" -maxdepth 4 -path '*/agent-transcripts/*' -name '*.jsonl' -print -quit 2>/dev/null || true)
    [ -n "$cursor_check" ] && has_cursor=1
  fi

  # Check for opencode sessions (any opencode*.db, or the explicit override).
  # Scan-only like Cursor: opencode sessions are upload-bucketed separately, not
  # surfaced as their own picker groups — but their presence must keep the
  # "no projects found" guard from blocking an opencode-only user.
  local has_opencode=0
  if command -v sqlite3 &>/dev/null; then
    if [ -n "${OPENCODE_DB:-}" ] && [ -f "${OPENCODE_DB:-}" ]; then
      has_opencode=1
    elif [ -d "$OPENCODE_DIR" ]; then
      local opencode_check
      opencode_check=$(find "$OPENCODE_DIR" -maxdepth 1 -name 'opencode*.db' -print -quit 2>/dev/null || true)
      [ -n "$opencode_check" ] && has_opencode=1
    fi
  fi

  # Check for Gemini CLI sessions (any chats/session-*.jsonl). Scan-only like
  # opencode — bucketed separately at upload time, but its presence must keep the
  # "no projects found" guard from blocking a Gemini-only user. No sqlite3 needed.
  local has_gemini=0
  if [ -d "$GEMINI_DIR" ]; then
    local gemini_check
    gemini_check=$(find "$GEMINI_DIR" -maxdepth 3 -name 'session-*.jsonl' -print -quit 2>/dev/null || true)
    [ -n "$gemini_check" ] && has_gemini=1
  fi

  # Check for VS Code Copilot sessions (any <hash>/chatSessions/*.json under one of
  # the workspaceStorage base dirs). Scan-only like opencode/Gemini — bucketed
  # separately at upload time, but its presence must keep the "no projects found"
  # guard from blocking a Copilot-only user. Reading the sessions needs jq, but the
  # presence probe is a plain find (so the jq-missing hint below still fires).
  local has_vscode=0
  local _vscode_base
  while IFS= read -r _vscode_base; do
    [ -z "$_vscode_base" ] && continue
    [ -d "$_vscode_base" ] || continue
    local vscode_check
    vscode_check=$(find "$_vscode_base" -maxdepth 2 -path '*/chatSessions/*.json' -print -quit 2>/dev/null || true)
    if [ -n "$vscode_check" ]; then has_vscode=1; break; fi
  done <<< "$VSCODE_DIR"

  # Check for Antigravity sessions (any brain/<uuid>/.../transcript.jsonl under one
  # of the three surface dirs). Plain find (no sqlite3), so its presence keeps the
  # "no projects" guard from blocking an Antigravity-only user + triggers the hint.
  local has_antigravity=0
  if [ -d "$ANTIGRAVITY_DIR" ]; then
    local antigravity_check
    antigravity_check=$(find "$ANTIGRAVITY_DIR"/antigravity*/brain -maxdepth 4 -name 'transcript.jsonl' -print -quit 2>/dev/null || true)
    [ -n "$antigravity_check" ] && has_antigravity=1
  fi

  if [ ${#all_dirs[@]} -eq 0 ] && [ "$has_codex" -eq 0 ] && [ "$has_cursor" -eq 0 ] && [ "$has_opencode" -eq 0 ] && [ "$has_gemini" -eq 0 ] && [ "$has_vscode" -eq 0 ] && [ "$has_antigravity" -eq 0 ]; then
    # Cursor + opencode need host sqlite3 + jq; VS Code Copilot needs jq. Git Bash
    # on Windows bundles neither, so a Cursor/Copilot-only user with the tools
    # missing looks empty here (their probes are gated on sqlite3/jq). Point them at
    # the fix instead of a bare "nothing found" (PAXEL: siddharth, Cursor-only on
    # Windows). has_vscode is a plain find (no jq), so its presence triggers the hint.
    if { [ -d "$CURSOR_DIR" ] || [ -f "$CURSOR_GLOBAL_DB" ] || [ -d "${CURSOR_PROJECTS_DIR:-}" ] || [ -d "$OPENCODE_DIR" ] || [ "$has_vscode" -eq 1 ] || [ "$has_antigravity" -eq 1 ]; } \
       && { ! command -v sqlite3 >/dev/null 2>&1 || ! command -v jq >/dev/null 2>&1; }; then
      echo "Found Cursor/opencode/VS Code Copilot/Antigravity data but can't read it — sqlite3 and jq are required." >&2
      echo "Install them and re-run: brew install sqlite3 jq (macOS) · sudo apt install sqlite3 jq (Linux) · winget install sqlite.sqlite jqlang.jq (Windows Git Bash)" >&2
    fi
    echo "Error: No projects with transcripts found" >&2
    echo "Checked: $CLAUDE_DIR, $CODEX_DIR, $CURSOR_DIR, ${CURSOR_PROJECTS_DIR:-}, $OPENCODE_DIR, $GEMINI_DIR, $(printf '%s' "$VSCODE_DIR" | tr '\n' ' '), $ANTIGRAVITY_DIR" >&2
    exit 1
  fi

  # Resolve CWD and git remote for each dir
  local dir_cwds=()
  local dir_remotes=()
  for name in "${all_dirs[@]}"; do
    local cwd
    cwd=$(get_project_cwd "$name")
    dir_cwds+=("$cwd")
    local remote
    remote=$(get_git_remote "$cwd")
    dir_remotes+=("$remote")
  done

  # Backfill remotes for deleted Conductor workspaces
  _bfc_cwds=("${dir_cwds[@]}")
  _bfc_remotes=("${dir_remotes[@]}")
  backfill_conductor_remotes
  # Recover remotes for non-Conductor orphan cwds
  # (deleted subdirs of existing repos, sibling worktrees)
  local _bfc_j=0
  while [ $_bfc_j -lt ${#_bfc_cwds[@]} ]; do
    if [ -z "${_bfc_remotes[$_bfc_j]}" ]; then
      local _bfc_recovered
      _bfc_recovered=$(resolve_remote_for_dead_cwd "${_bfc_cwds[$_bfc_j]}")
      [ -n "$_bfc_recovered" ] && _bfc_remotes[$_bfc_j]="$_bfc_recovered"
    fi
    _bfc_j=$((_bfc_j + 1))
  done
  dir_remotes=("${_bfc_remotes[@]}")

  # Group by remote (or cwd for no-remote, or "unknown")
  GROUP_REMOTES=()
  GROUP_DISPLAYS=()
  GROUP_DIRS=()
  GROUP_COUNTS=()
  GROUP_DIR_COUNTS=()

  local i=0
  for name in "${all_dirs[@]}"; do
    local remote="${dir_remotes[$i]}"
    local cwd="${dir_cwds[$i]}"

    # Determine group key
    local group_key
    if [ -n "$remote" ]; then
      group_key="$remote"
    elif [ -n "$cwd" ]; then
      group_key="local:$cwd"
    else
      group_key="unknown"
    fi

    # Determine display name
    local display
    if [ -n "$remote" ]; then
      display=$(remote_display_name "$remote")
    elif [ -n "$cwd" ]; then
      display=$(basename "$cwd")
    else
      display="${name##*-}"
    fi

    # Count sessions in this dir
    local session_count
    session_count=$({ find "$CLAUDE_DIR/$name" -name "*.jsonl" -maxdepth 3 2>/dev/null || true; } | wc -l | tr -d ' ')

    # Find existing group or create new one
    local found=0
    local g=0
    while [ $g -lt ${#GROUP_REMOTES[@]} ]; do
      if [ "${GROUP_REMOTES[$g]}" = "$group_key" ]; then
        GROUP_DIRS[$g]="${GROUP_DIRS[$g]}|$name"
        GROUP_COUNTS[$g]=$((${GROUP_COUNTS[$g]} + $session_count))
        GROUP_DIR_COUNTS[$g]=$((${GROUP_DIR_COUNTS[$g]} + 1))
        found=1
        break
      fi
      g=$((g + 1))
    done

    if [ "$found" -eq 0 ]; then
      GROUP_REMOTES+=("$group_key")
      GROUP_DISPLAYS+=("$display")
      GROUP_DIRS+=("$name")
      GROUP_COUNTS+=("$session_count")
      GROUP_DIR_COUNTS+=("1")
    fi

    i=$((i + 1))
  done

  # Discover Codex sessions and merge into groups by git remote
  if [ "$has_codex" -eq 1 ]; then
    echo "Scanning Codex sessions..." >&2
    while IFS= read -r codex_file; do
      [ -z "$codex_file" ] && continue
      local remote
      remote=$(get_codex_session_remote "$codex_file")
      [ -z "$remote" ] && continue

      # Find existing group by remote or create new one
      local found=0
      local g=0
      while [ $g -lt ${#GROUP_REMOTES[@]} ]; do
        if [ "${GROUP_REMOTES[$g]}" = "$remote" ]; then
          GROUP_COUNTS[$g]=$((${GROUP_COUNTS[$g]} + 1))
          found=1
          break
        fi
        g=$((g + 1))
      done

      if [ "$found" -eq 0 ]; then
        local display
        display=$(remote_display_name "$remote")
        GROUP_REMOTES+=("$remote")
        GROUP_DISPLAYS+=("$display")
        GROUP_DIRS+=("")
        GROUP_COUNTS+=("1")
        GROUP_DIR_COUNTS+=("0")
      fi
    done < <(find "$CODEX_DIR" -name "*.jsonl" -maxdepth 6 2>/dev/null)
  fi

  # Discover Cursor agent-transcript sessions (~/.cursor/projects) and merge
  # into groups by git remote — same shape as the Codex merge above. Legacy
  # state.vscdb sessions stay presence-only (counting them means extracting
  # SQLite bubbles — too slow for the picker), but these transcripts are plain
  # files, so a repo worked ONLY in current Cursor finally shows up as its own
  # group instead of hiding behind the "no projects found" guard.
  if [ -d "${CURSOR_PROJECTS_DIR:-}" ] && command -v jq >/dev/null 2>&1; then
    # Warm the workspace map in THIS shell — the $(...) call below can't
    # persist it, and rebuilding it per project dir is quadratic in jq forks.
    load_cursor_workspace_map
    local _cpt_dir _cpt_at _cpt_ws _cpt_remote _cpt_n
    for _cpt_dir in "$CURSOR_PROJECTS_DIR"/*/; do
      [ -d "$_cpt_dir" ] || continue
      _cpt_at="${_cpt_dir%/}/agent-transcripts"
      [ -d "$_cpt_at" ] || continue
      _cpt_n=$(cursor_project_transcript_count "$_cpt_at")
      [ "$_cpt_n" -gt 0 ] 2>/dev/null || continue
      _cpt_ws=$(cursor_project_dir_to_workspace "$(basename "${_cpt_dir%/}")" || true)
      [ -z "$_cpt_ws" ] && continue
      _cpt_remote=$(cursor_workspace_remote "$_cpt_ws")
      [ -z "$_cpt_remote" ] && continue

      local found=0
      local g=0
      while [ $g -lt ${#GROUP_REMOTES[@]} ]; do
        if [ "${GROUP_REMOTES[$g]}" = "$_cpt_remote" ]; then
          GROUP_COUNTS[$g]=$((${GROUP_COUNTS[$g]} + _cpt_n))
          found=1
          break
        fi
        g=$((g + 1))
      done

      if [ "$found" -eq 0 ]; then
        local display
        display=$(remote_display_name "$_cpt_remote")
        GROUP_REMOTES+=("$_cpt_remote")
        GROUP_DISPLAYS+=("$display")
        GROUP_DIRS+=("")
        GROUP_COUNTS+=("$_cpt_n")
        GROUP_DIR_COUNTS+=("0")
      fi
    done
  fi

  local _rmdc_total
  _rmdc_total=$(_rmdc_recovery_count_unique)
  if [ "${_rmdc_total:-0}" -gt 0 ]; then
    echo "[paxel] Orphan recovery: ${_rmdc_total} dir(s) remapped via ancestor walk or sibling worktree (see '[paxel] Recovered' lines above for detail)" >&2
  fi
}

# Build or refresh the project-remote cache at ~/.paxel/cache/project-remotes-v2.tsv
# Each line: dir_name\tkey\tsession_count\tlatest_mtime
# Only re-resolves dirs whose newest JSONL changed since last cache write.
# After this function, CACHED_KEYS / CACHED_DIRS / CACHED_SESSIONS arrays are populated.
# v2 bumps the cache filename after keys switched from raw git URLs to
# normalized form (normalize_remote / Repository.normalize_remote parity).
# Old v1 rows would under-dedupe until every dir's mtime changed.
CACHED_KEYS=()
CACHED_DIRS=()
CACHED_SESSIONS=()
_cache_loaded=0

load_project_cache() {
  [ "$_cache_loaded" -eq 1 ] && return 0

  local cache_file="${HOME}/.paxel/cache/project-remotes-v2.tsv"
  mkdir -p "${HOME}/.paxel/cache"

  # Step 1: Get current dir listing with mtimes
  local has_cache=0
  [ -f "$cache_file" ] && [ -s "$cache_file" ] && has_cache=1

  if [ "$has_cache" -eq 1 ]; then
    echo "  Checking for new sessions..." >&2
  else
    echo "  Scanning your coding sessions (first run, this may take a minute)..." >&2
  fi

  local dir_list_file
  dir_list_file=$(mktemp)
  local _dcr_total=0
  for dir in "$CLAUDE_DIR"/*/; do
    [ -d "$dir" ] || continue
    _dcr_total=$((_dcr_total + 1))
    local dn
    dn=$(basename "$dir")
    local dm
    dm=$(stat -c %Y "$dir" 2>/dev/null || stat -f %m "$dir" 2>/dev/null || echo "0")
    printf '%s\t%s\n' "$dn" "$dm" >> "$dir_list_file"
  done

  # Step 2: awk joins dir listing against cache in one pass.
  # Outputs HIT lines (cached, mtime matches, non-empty key) and MISS lines
  # (need resolution). Empty-key rows always miss so they self-heal next run:
  # resolution can fail transiently (missing sessions-index.json, queue-only
  # jsonls) and stick forever if we trust them on matching mtime alone, which
  # silently orphans later-populated subpath projects (e.g. ~/code/bookface)
  # from their parent repo group.
  local hit_file miss_file
  hit_file=$(mktemp)
  miss_file=$(mktemp)

  if [ "$has_cache" -eq 1 ]; then
    # Schema: dir<TAB>key<TAB>sessions<TAB>mtime<TAB>inferred.
    # Inferred entries (key came from orphan resolver) always miss so we
    # re-verify: if the ancestor repo or sibling worktree has been removed
    # since the last run, the cached key becomes wrong. Memoization claim
    # (from an earlier revision) was wrong — the resolver runs in a
    # $(...) subshell, so its assoc-array cache dies with the subshell.
    # Every inferred row triggers a fresh ancestor walk each run; that's
    # a few stats + one git call per orphan, tolerable for the common
    # case of <50 orphans.
    # Miss-line format: dir<TAB>mtime<TAB>prior_inferred  (prior_inferred
    # lets the miss-resolution loop preserve the inferred flag on
    # transient misses, so one bad run doesn't permanently detach.)
    awk -F'\t' '
      NR==FNR { cache[$1] = $2 "\t" $3 "\t" $4 "\t" $5; next }
      {
        dir = $1; mtime = $2
        if (dir in cache) {
          split(cache[dir], c, "\t")
          if (c[3] == mtime && c[1] != "" && c[4] != "1") {
            print dir "\t" c[1] "\t" c[2] "\t" mtime "\t" c[4] > "'"$hit_file"'"
          } else {
            print dir "\t" mtime "\t" c[4] > "'"$miss_file"'"
          }
        } else {
          print dir "\t" mtime "\t" > "'"$miss_file"'"
        }
      }
    ' "$cache_file" "$dir_list_file"
  else
    # No cache: everything is a miss with empty prior_inferred.
    awk -F'\t' '{ print $0 "\t" }' "$dir_list_file" > "$miss_file"
  fi

  local hit_count miss_count
  hit_count=$(wc -l < "$hit_file" | tr -d ' ')
  miss_count=$(wc -l < "$miss_file" | tr -d ' ')

  if [ "$miss_count" -gt 0 ] && [ "$hit_count" -gt 0 ]; then
    echo "  ${miss_count} new or changed, ${hit_count} cached." >&2
  fi

  # Step 3: Load all cache hits into CACHED_KEYS/DIRS/SESSIONS
  local new_cache=""
  while IFS=$'\t' read -r _cn _ck _cs _cm _ci; do
    [ -z "$_cn" ] && continue
    new_cache="${new_cache}${_cn}	${_ck}	${_cs}	${_cm}	${_ci}
"
    [ -z "$_ck" ] || [ "${_cs:-0}" -le 0 ] 2>/dev/null && continue
    local found=0
    local k=0
    while [ $k -lt ${#CACHED_KEYS[@]} ]; do
      if [ "${CACHED_KEYS[$k]}" = "$_ck" ]; then
        CACHED_DIRS[$k]="${CACHED_DIRS[$k]}|$_cn"
        CACHED_SESSIONS[$k]=$((${CACHED_SESSIONS[$k]} + _cs))
        found=1
        break
      fi
      k=$((k + 1))
    done
    if [ "$found" -eq 0 ]; then
      CACHED_KEYS+=("$_ck")
      CACHED_DIRS+=("$_cn")
      CACHED_SESSIONS+=("$_cs")
    fi
  done < "$hit_file"

  # Step 4: Resolve only the misses (new or changed dirs)
  local _miss_i=0
  while IFS=$'\t' read -r dir_name dir_mtime prior_inferred; do
    [ -z "$dir_name" ] && continue
    _miss_i=$((_miss_i + 1))
    if [ $((_miss_i % 200)) -eq 0 ]; then
      echo "  ...${_miss_i}/${miss_count} resolved" >&2
    fi

    local dir="$CLAUDE_DIR/$dir_name"
    local has_jsonl
    # `find -print -quit` SIGPIPEs on first match → ERR trap. Same family
    # as the OLDEST_SESSION_EPOCH fix (PR #389).
    has_jsonl=$(find "$dir" -name "*.jsonl" -maxdepth 3 -print -quit 2>/dev/null || true)
    if [ -z "$has_jsonl" ]; then
      new_cache="${new_cache}${dir_name}		0	${dir_mtime}
"
      continue
    fi

    local cwd
    cwd=$(get_project_cwd "$dir_name")
    local remote
    remote=$(get_git_remote "$cwd")
    # Recover orphan remote BEFORE key assignment — otherwise
    # deleted-subdir cwds fall into name:<basename> at line ~1342 and
    # resolver never fires for the cached-run hot path.
    # _inferred="1" on a successful recovery so the cache re-verifies this
    # row next run (inferred rows always miss the awk hit predicate).
    # Preserves the inferred flag on a transient miss (prior_inferred=1 +
    # new resolve returns empty) so one bad run doesn't permanently detach
    # the session from its real repo.
    local _inferred=""
    if [ -z "$remote" ] && [ -n "$cwd" ] && [ ! -e "$cwd" ]; then
      remote=$(resolve_remote_for_dead_cwd "$cwd")
      if [ -n "$remote" ]; then
        _inferred="1"
      elif [ "${prior_inferred:-}" = "1" ]; then
        # Transient miss (e.g. --no-orphan-recovery, or filesystem hiccup).
        # Keep the row flagged so we retry next run.
        _inferred="1"
      fi
    fi

    local key=""
    if [ -n "$remote" ]; then
      key="$remote"
    elif [ -n "$cwd" ] && [ -d "$cwd" ]; then
      key="local:$cwd"
    elif [ -n "$cwd" ]; then
      local _proj_name=""
      if [[ "$cwd" == */conductor/workspaces/*/* ]]; then
        _proj_name=$(echo "$cwd" | sed 's|.*/conductor/workspaces/||' | sed 's|/.*||')
      elif [[ "$cwd" != */.gstack/* ]] && [[ "$cwd" != */.claude/* ]]; then
        _proj_name=$(basename "$cwd")
      fi
      [ -n "$_proj_name" ] && key="name:$_proj_name"
    fi

    if [ -z "$key" ]; then
      new_cache="${new_cache}${dir_name}		0	${dir_mtime}
"
      continue
    fi

    local session_count
    session_count=$({ find "$dir" -name "*.jsonl" -not -name "_*" -not -path "*/_git/*" -not -path "*/subagents/*" -maxdepth 3 2>/dev/null || true; } | wc -l | tr -d ' ')

    new_cache="${new_cache}${dir_name}	${key}	${session_count}	${dir_mtime}	${_inferred}
"

    if [ -n "$key" ] && [ "$session_count" -gt 0 ]; then
      local found=0
      local k=0
      while [ $k -lt ${#CACHED_KEYS[@]} ]; do
        if [ "${CACHED_KEYS[$k]}" = "$key" ]; then
          CACHED_DIRS[$k]="${CACHED_DIRS[$k]}|$dir_name"
          CACHED_SESSIONS[$k]=$((${CACHED_SESSIONS[$k]} + session_count))
          found=1
          break
        fi
        k=$((k + 1))
      done
      if [ "$found" -eq 0 ]; then
        CACHED_KEYS+=("$key")
        CACHED_DIRS+=("$dir_name")
        CACHED_SESSIONS+=("$session_count")
      fi
    fi
  done < "$miss_file"

  # Step 5: Write updated cache and clean up
  printf '%s' "$new_cache" > "$cache_file"
  rm -f "$dir_list_file" "$hit_file" "$miss_file"
  _cache_loaded=1

  if [ "$miss_count" -eq 0 ]; then
    echo "  All sessions cached, ready to go." >&2
  else
    local _total_sess=0
    local _si=0
    while [ $_si -lt ${#CACHED_SESSIONS[@]} ]; do
      _total_sess=$((_total_sess + ${CACHED_SESSIONS[$_si]}))
      _si=$((_si + 1))
    done
    local _repo_list=""
    local _ri=0
    while [ $_ri -lt ${#CACHED_KEYS[@]} ]; do
      [ -n "$_repo_list" ] && _repo_list="${_repo_list}, "
      _repo_list="${_repo_list}$(remote_display_name "${CACHED_KEYS[$_ri]}")"
      _ri=$((_ri + 1))
    done
    # This count is Claude Code only — CACHED_* never holds Codex/Cursor/opencode/
    # Gemini. For a Codex/opencode-only user it would otherwise print a misleading
    # "Resolved 0 sessions across 0 repos" before those tools are even scanned, so
    # suppress the line entirely when there are no Claude repos and let the
    # per-tool scans speak; otherwise label it as Claude-specific.
    if [ "${#CACHED_KEYS[@]}" -gt 0 ]; then
      echo "  Resolved ${_total_sess} Claude Code sessions across ${#CACHED_KEYS[@]} repos: ${_repo_list}" >&2
    fi
  fi
}

# Detect child git repos in the current directory that have transcript data.
# Populates CHILD_REPO_* parallel arrays. Returns 0 if any repos found.
detect_child_repos() {
  local current_dir
  current_dir=$(pwd)

  # Build/refresh the project cache (fast on subsequent runs)
  load_project_cache

  # Use cached data as t_keys/t_dirs/t_sessions. Use the empty-safe expansion
  # idiom (cf. :2494): on macOS's default bash 3.2, copying an empty array via
  # `("${CACHED_KEYS[@]}")` aborts under `set -u` ("unbound variable"), which
  # crashed detect_child_repos for any user with no Claude cache (Codex/opencode-
  # only). The `[@]+"..."` form yields a genuinely-empty array (NOT `("${a[@]:-}")`,
  # which on 3.2 yields a 1-element "" array → a spurious downstream child_key).
  local t_keys=("${CACHED_KEYS[@]+"${CACHED_KEYS[@]}"}")
  local t_dirs=("${CACHED_DIRS[@]+"${CACHED_DIRS[@]}"}")
  local t_sessions=("${CACHED_SESSIONS[@]+"${CACHED_SESSIONS[@]}"}")

  # Pre-compute Codex session remotes (key → pipe-separated file paths).
  # Phase 3.5 — track cross-tool subset alongside total count so the picker
  # can label "(N sessions, M Codex by Claude)" per child repo.
  local codex_keys=()
  local codex_file_lists=()
  local codex_counts=()
  local codex_cross_tool_counts=()
  if [ -d "$CODEX_DIR" ]; then
    while IFS= read -r codex_file; do
      [ -z "$codex_file" ] && continue
      local remote
      remote=$(get_codex_session_remote "$codex_file")
      [ -z "$remote" ] && continue

      local _origin
      _origin=$(get_codex_session_originator "$codex_file")
      local _is_cross_tool=0
      codex_originator_is_standalone "$_origin" || _is_cross_tool=1

      local found=0
      local k=0
      while [ $k -lt ${#codex_keys[@]} ]; do
        if [ "${codex_keys[$k]}" = "$remote" ]; then
          codex_file_lists[$k]="${codex_file_lists[$k]}|$codex_file"
          codex_counts[$k]=$((${codex_counts[$k]} + 1))
          [ "$_is_cross_tool" -eq 1 ] && codex_cross_tool_counts[$k]=$((${codex_cross_tool_counts[$k]} + 1))
          found=1
          break
        fi
        k=$((k + 1))
      done
      if [ "$found" -eq 0 ]; then
        codex_keys+=("$remote")
        codex_file_lists+=("$codex_file")
        codex_counts+=("1")
        codex_cross_tool_counts+=("$_is_cross_tool")
      fi
    done < <(find "$CODEX_DIR" -name "*.jsonl" -maxdepth 6 2>/dev/null)
  fi

  # Scan child directories for .git (use -e to catch worktrees where .git is a file)
  echo "  Looking for repos in ${current_dir}/" >&2
  CHILD_REPO_DIRS=()
  CHILD_REPO_REMOTES=()
  CHILD_REPO_NAMES=()
  CHILD_REPO_SESSIONS=()
  # Phase 3.5 — parallel array tracking cross-tool subset of CHILD_REPO_SESSIONS
  # so the --all picker can show "(N sessions, M Codex by Claude)".
  CHILD_REPO_CROSS_TOOL_SESSIONS=()
  CHILD_REPO_CURSOR_ONLY=()
  CHILD_TRANSCRIPT_DIRS=()
  CHILD_CODEX_DIRS=()

  local seen_remotes=""
  # Tracks name:<base> cache-group indices already claimed by an earlier child, so
  # the same unresolved (deleted-cwd) transcript group can't be attributed to two
  # same-basename children (e.g. 'my-app' + 'my_app', which both match name:my-app
  # via the _<->- alt-form) and uploaded under two reports. Delimited-token idiom,
  # same as seen_remotes / the per-repo failed-index set.
  local consumed_name_idx=""
  for child in "$current_dir"/*/; do
    [ -d "$child" ] || continue
    [ -e "$child/.git" ] || [ -e "$child/.jj" ] || continue

    local child_path
    child_path=$(cd "$child" && pwd)
    local child_remote
    child_remote=$(get_git_remote "$child_path")

    local child_key
    if [ -n "$child_remote" ]; then
      child_key="$child_remote"
    else
      child_key="local:$child_path"
    fi

    # Deduplicate by key
    case "$seen_remotes" in
      *"|$child_key|"*) continue ;;
    esac
    seen_remotes="${seen_remotes}|${child_key}|"

    # Match against pre-computed transcript dirs (by remote, local path, or project name)
    local matched_dirs=""
    local matched_sessions=0
    local child_basename
    child_basename=$(basename "$child_path")
    # Also try with underscores replaced by hyphens and vice versa
    local child_basename_alt
    child_basename_alt=$(echo "$child_basename" | tr '_' '-')
    local child_basename_alt2
    child_basename_alt2=$(echo "$child_basename" | tr '-' '_')

    local k=0
    while [ $k -lt ${#t_keys[@]} ]; do
      local match=0
      local is_name_match=0
      if [ "${t_keys[$k]}" = "$child_key" ]; then
        match=1
      elif [[ "${t_keys[$k]}" == name:* ]]; then
        # Name-based matching for unresolved (deleted-cwd) transcript dirs. Skip a
        # name: group already claimed by an earlier child so it isn't double-counted;
        # an exact (remote/local-key) match above is unaffected and a live repo still
        # inherits its own unclaimed name: group (the common Conductor case).
        case "$consumed_name_idx" in
          *"|$k|"*) : ;;  # already claimed by an earlier same-basename child
          *)
            local t_name="${t_keys[$k]#name:}"
            if [ "$t_name" = "$child_basename" ] || [ "$t_name" = "$child_basename_alt" ] || [ "$t_name" = "$child_basename_alt2" ]; then
              match=1
              is_name_match=1
            fi
            ;;
        esac
      fi
      if [ "$match" -eq 1 ]; then
        # Safe to mark consumed before the total_sessions==0 skip below: a name
        # match always adds t_sessions[k], and load_project_cache only emits
        # name: groups with sessions>0, so a name-matched child is never dropped
        # there — the index can't be consumed by a child that then disappears.
        [ "$is_name_match" -eq 1 ] && consumed_name_idx="${consumed_name_idx}|${k}|"
        if [ -z "$matched_dirs" ]; then
          matched_dirs="${t_dirs[$k]}"
        else
          matched_dirs="${matched_dirs}|${t_dirs[$k]}"
        fi
        matched_sessions=$((matched_sessions + ${t_sessions[$k]}))
      fi
      k=$((k + 1))
    done

    # Match Codex sessions
    local matched_codex=""
    local codex_session_count=0
    local codex_cross_tool_count=0
    local k=0
    while [ $k -lt ${#codex_keys[@]} ]; do
      if [ "${codex_keys[$k]}" = "$child_key" ]; then
        matched_codex="${codex_file_lists[$k]}"
        codex_session_count=${codex_counts[$k]}
        codex_cross_tool_count=${codex_cross_tool_counts[$k]:-0}
        break
      fi
      k=$((k + 1))
    done

    local total_sessions=$((matched_sessions + codex_session_count))
    # No Claude/Codex sessions? Check opencode/Gemini before skipping — otherwise a
    # repo worked ONLY in those tools is invisible in the picker, unlike single-repo
    # auto-detect which folds them in. Only zero-Claude/Codex children pay this, and
    # the count helpers return 0 immediately when the tool isn't installed. (Cursor
    # has no count helper anywhere — the single-repo prelude omits it too — so a
    # Cursor-only repo stays a known gap. A future prescan could also fold these into
    # the displayed count for MIXED repos, which today show Claude+Codex only.)
    if [ "$total_sessions" -eq 0 ] && [ -n "$child_remote" ]; then
      local _oc_n _gm_n _vs_n _ag_n
      _oc_n=$(count_opencode_sessions "$child_remote")
      _gm_n=$(count_gemini_sessions "$child_remote")
      _vs_n=$(count_vscode_copilot_sessions "$child_remote")
      _ag_n=$(count_antigravity_sessions "$child_remote")
      total_sessions=$((_oc_n + _gm_n + _vs_n + _ag_n))
    fi
    # Cursor has no cheap per-repo count (C3). If every counted tool came up empty,
    # fall back to a one-time presence prescan so a Cursor-only child (with a remote)
    # still shows in the picker — run_docker_analysis counts it inside the container.
    # Tracked separately so the menu labels it instead of showing a bogus "0 sessions".
    local _cursor_only=0
    if [ "$total_sessions" -eq 0 ] && [ -n "$child_remote" ] && remote_has_cursor_sessions "$child_remote"; then
      _cursor_only=1
    fi
    # Skip repos with no transcript data at all
    [ "$total_sessions" -eq 0 ] && [ "$_cursor_only" -eq 0 ] && continue

    local display_name
    if [ -n "$child_remote" ]; then
      display_name=$(remote_display_name "$child_remote")
    else
      display_name=$(basename "$child_path")
    fi

    CHILD_REPO_DIRS+=("$child_path")
    CHILD_REPO_REMOTES+=("$child_key")
    CHILD_REPO_NAMES+=("$display_name")
    CHILD_REPO_SESSIONS+=("$total_sessions")
    CHILD_REPO_CURSOR_ONLY+=("$_cursor_only")
    CHILD_REPO_CROSS_TOOL_SESSIONS+=("$codex_cross_tool_count")
    CHILD_TRANSCRIPT_DIRS+=("$matched_dirs")
    CHILD_CODEX_DIRS+=("$matched_codex")
  done

  [ ${#CHILD_REPO_DIRS[@]} -eq 0 ] && return 1

  # Sort by session count descending (bubble sort, fine for <50 items)
  local n=${#CHILD_REPO_DIRS[@]}
  local i=0
  while [ $i -lt $((n - 1)) ]; do
    local j=0
    while [ $j -lt $((n - i - 1)) ]; do
      local next=$((j + 1))
      if [ "${CHILD_REPO_SESSIONS[$j]}" -lt "${CHILD_REPO_SESSIONS[$next]}" ]; then
        # Swap all parallel arrays — keep CHILD_REPO_CROSS_TOOL_SESSIONS in
        # sync or `--all` mode display gets scrambled when sort reorders rows.
        local tmp
        tmp="${CHILD_REPO_DIRS[$j]}"; CHILD_REPO_DIRS[$j]="${CHILD_REPO_DIRS[$next]}"; CHILD_REPO_DIRS[$next]="$tmp"
        tmp="${CHILD_REPO_REMOTES[$j]}"; CHILD_REPO_REMOTES[$j]="${CHILD_REPO_REMOTES[$next]}"; CHILD_REPO_REMOTES[$next]="$tmp"
        tmp="${CHILD_REPO_NAMES[$j]}"; CHILD_REPO_NAMES[$j]="${CHILD_REPO_NAMES[$next]}"; CHILD_REPO_NAMES[$next]="$tmp"
        tmp="${CHILD_REPO_SESSIONS[$j]}"; CHILD_REPO_SESSIONS[$j]="${CHILD_REPO_SESSIONS[$next]}"; CHILD_REPO_SESSIONS[$next]="$tmp"
        tmp="${CHILD_REPO_CURSOR_ONLY[$j]}"; CHILD_REPO_CURSOR_ONLY[$j]="${CHILD_REPO_CURSOR_ONLY[$next]}"; CHILD_REPO_CURSOR_ONLY[$next]="$tmp"
        tmp="${CHILD_REPO_CROSS_TOOL_SESSIONS[$j]}"; CHILD_REPO_CROSS_TOOL_SESSIONS[$j]="${CHILD_REPO_CROSS_TOOL_SESSIONS[$next]}"; CHILD_REPO_CROSS_TOOL_SESSIONS[$next]="$tmp"
        tmp="${CHILD_TRANSCRIPT_DIRS[$j]}"; CHILD_TRANSCRIPT_DIRS[$j]="${CHILD_TRANSCRIPT_DIRS[$next]}"; CHILD_TRANSCRIPT_DIRS[$next]="$tmp"
        tmp="${CHILD_CODEX_DIRS[$j]}"; CHILD_CODEX_DIRS[$j]="${CHILD_CODEX_DIRS[$next]}"; CHILD_CODEX_DIRS[$next]="$tmp"
      fi
      j=$((j + 1))
    done
    i=$((i + 1))
  done

  return 0
}

# Show interactive menu for child repo selection
show_child_repo_menu() {
  require_tty

  local repo_count=${#CHILD_REPO_NAMES[@]}
  local repo_label="repos"
  [ "$repo_count" -eq 1 ] && repo_label="repo"
  local all_idx=$((repo_count + 1))
  local cancel_idx=$((repo_count + 2))

  echo ""
  echo "Found ${repo_count} ${repo_label} with transcript data in this directory:"
  echo ""

  local g=0
  while [ $g -lt ${#CHILD_REPO_NAMES[@]} ]; do
    local total="${CHILD_REPO_SESSIONS[$g]}"
    local cross_tool="${CHILD_REPO_CROSS_TOOL_SESSIONS[$g]:-0}"
    local main_total=$((total - cross_tool))
    local session_label="sessions"
    [ "$main_total" -eq 1 ] && session_label="session"
    if [ "${CHILD_REPO_CURSOR_ONLY[$g]:-0}" -eq 1 ] && [ "$total" -eq 0 ]; then
      # Cursor-only repo: no cheap host count, the real total is computed in the container.
      echo "  $((g + 1))) ${CHILD_REPO_NAMES[$g]} (Cursor sessions)"
    elif [ "$cross_tool" -gt 0 ]; then
      echo "  $((g + 1))) ${CHILD_REPO_NAMES[$g]} (${main_total} ${session_label} + ${cross_tool} Codex by Claude)"
    else
      echo "  $((g + 1))) ${CHILD_REPO_NAMES[$g]} (${main_total} ${session_label})"
    fi
    g=$((g + 1))
  done

  echo ""
  echo "  ${all_idx}) Analyze all repos (one report per repo)"
  echo "  ${cancel_idx}) Cancel"
  echo ""

  local choice
  user_read -rp "Choose [1-${cancel_idx}] (comma-separate for multiple, e.g. 1,3): " choice

  # Strip spaces so "1, 2" parses the same as "1,2".
  choice="${choice// /}"

  MULTI_REPO_SELECTED_LIST=()

  # Meta items first (exact string match, so they can't be mixed into a list).
  if [ "$choice" = "$all_idx" ]; then
    MULTI_REPO_MODE="all"
    local g=0
    while [ "$g" -lt "$repo_count" ]; do
      MULTI_REPO_SELECTED_LIST+=("$g")
      g=$((g + 1))
    done
    _confirm_selected_child_repos || { echo "Cancelled."; exit 0; }
    return 0
  fi

  if [ "$choice" = "$cancel_idx" ]; then
    echo "Cancelled."
    exit 0
  fi

  # One or more repo numbers, comma-separated. Each token bounded to 10 digits so
  # long digit-only paste (exceeds bash's 64-bit integer range) is rejected by
  # the regex rather than printing raw "integer expression expected" arithmetic.
  if ! [[ "$choice" =~ ^[0-9]{1,10}(,[0-9]{1,10})*$ ]]; then
    echo "Invalid choice." >&2
    exit 1
  fi

  local -a _toks
  IFS=',' read -ra _toks <<< "$choice"
  local tok
  for tok in "${_toks[@]}"; do
    if [ "$tok" -lt 1 ] || [ "$tok" -gt "$repo_count" ]; then
      echo "Invalid choice." >&2
      exit 1
    fi
    MULTI_REPO_SELECTED_LIST+=("$((tok - 1))")
  done

  # Dedup + sort the selected indices (process substitution keeps the array
  # write in the current shell — a `| while` subshell would lose it).
  local -a _uniq=()
  local i
  while IFS= read -r i; do
    [ -n "$i" ] && _uniq+=("$i")
  done < <(printf '%s\n' "${MULTI_REPO_SELECTED_LIST[@]}" | sort -n | uniq)
  MULTI_REPO_SELECTED_LIST=("${_uniq[@]}")

  if [ "${#MULTI_REPO_SELECTED_LIST[@]}" -eq 1 ]; then
    MULTI_REPO_MODE="single"
    MULTI_REPO_SELECTED="${MULTI_REPO_SELECTED_LIST[0]}"
    echo "Selected: ${CHILD_REPO_NAMES[${MULTI_REPO_SELECTED_LIST[0]}]}"
  else
    MULTI_REPO_MODE="subset"
    _confirm_selected_child_repos || { echo "Cancelled."; exit 0; }
  fi
}

# Show the combined time estimate for the repos in MULTI_REPO_SELECTED_LIST and
# ask the user to confirm. Returns 0 to proceed, 1 to cancel. Used by the "all"
# and multi-select subset paths; a single selection skips the estimate.
_confirm_selected_child_repos() {
  local sel_count=${#MULTI_REPO_SELECTED_LIST[@]}
  local label="repos"
  [ "$sel_count" -eq 1 ] && label="repo"
  local total_minutes=0
  echo ""
  echo "${sel_count} ${label} selected."
  local idx
  for idx in "${MULTI_REPO_SELECTED_LIST[@]}"; do
    local mins
    mins=$(estimate_time "${CHILD_REPO_SESSIONS[$idx]}")
    total_minutes=$((total_minutes + mins))
    local _ct="${CHILD_REPO_CROSS_TOOL_SESSIONS[$idx]:-0}"
    local _main=$((CHILD_REPO_SESSIONS[$idx] - _ct))
    if [ "$_ct" -gt 0 ]; then
      printf "  %-20s ~%d min (%d sessions + %d Codex by Claude)\n" "${CHILD_REPO_NAMES[$idx]}" "$mins" "$_main" "$_ct"
    else
      printf "  %-20s ~%d min (%d sessions)\n" "${CHILD_REPO_NAMES[$idx]}" "$mins" "$_main"
    fi
  done
  echo ""
  echo "Total estimated time: ~${total_minutes} minutes"
  echo ""
  local confirm
  user_read -rp "Continue? [Y/n]: " confirm
  case "$confirm" in
    [Nn]*) return 1 ;;
  esac
  return 0
}

# Run prepare_and_run_for_repo for each repo in MULTI_REPO_SELECTED_LIST
# (0-based indices into the CHILD_REPO_* arrays), print the multi-repo summary,
# and exit. Shared by the two child-repo entry points (auto-detect override and
# the Strategy 3 parent-dir picker) so they can't drift.
run_selected_child_repos() {
  pull_client_image
  MULTI_REPO_RUNNING=1

  local original_claude_dir="$CLAUDE_DIR"
  local original_codex_dir="$CODEX_DIR"
  local success_count=0
  local failed_repos=""   # space-joined names, for the human-readable "Failed:" line
  local failed_idx=""     # "|idx|"-delimited, for exact per-repo ✓/✗ (no name-substring collision)
  local total=${#MULTI_REPO_SELECTED_LIST[@]}

  # Set expectations before the slow part (the single-repo reassurance in
  # run_docker_analysis is suppressed under MULTI_REPO_RUNNING). Steps 1-3 above
  # were one-time setup; each repo below re-runs steps 4-17 on the same /17 scale.
  echo ""
  echo "Analyzing ${total} repos — this is the slow part. Each repo runs steps 4-17 below."

  local n=0
  local idx
  for idx in "${MULTI_REPO_SELECTED_LIST[@]}"; do
    n=$((n + 1))
    echo ""
    echo "═══ [${n}/${total}] Analyzing: ${CHILD_REPO_NAMES[$idx]} ═══"
    if prepare_and_run_for_repo "${CHILD_REPO_DIRS[$idx]}" "${CHILD_REPO_NAMES[$idx]}" "${CHILD_REPO_REMOTES[$idx]}" "${CHILD_TRANSCRIPT_DIRS[$idx]}" "${CHILD_CODEX_DIRS[$idx]}"; then
      success_count=$((success_count + 1))
    else
      failed_repos="${failed_repos} ${CHILD_REPO_NAMES[$idx]}"
      failed_idx="${failed_idx}|${idx}|"
    fi
  done

  # End summary
  echo ""
  echo "═══ Multi-repo analysis complete ═══"
  for idx in "${MULTI_REPO_SELECTED_LIST[@]}"; do
    local status_icon="✓"
    # Match by exact index token, not a name substring — otherwise a succeeded
    # repo whose name is a substring of a failed one (e.g. "app" vs "app-web")
    # is wrongly shown as ✗.
    case "$failed_idx" in
      *"|${idx}|"*) status_icon="✗" ;;
    esac
    echo "  ${status_icon} ${CHILD_REPO_NAMES[$idx]}"
  done
  echo ""
  echo "${success_count}/${total} repos analyzed successfully."
  if [ -n "$failed_repos" ]; then
    echo "Failed:${failed_repos}"
    echo "  Per-repo logs: ${HOME}/.paxel/logs/<repo>-*.log"
  fi
  echo ""
  echo "Results: ${PAXEL_SERVER}/reports"

  # Single notification at the end
  printf '\a'
  if [ "$(uname -s)" = "Darwin" ]; then
    osascript -e "display notification \"${success_count}/${total} repos analyzed.\" with title \"Paxel\"" 2>/dev/null || true
  fi

  CLAUDE_DIR="$original_claude_dir"
  CODEX_DIR="$original_codex_dir"
  [ -z "$failed_repos" ] && exit 0 || exit 1
}

# Get sessions sorted by createdAt from sessions-index.json, falling back to mtime
get_sorted_sessions() {
  local project_dir="$1"
  local index_file="$project_dir/sessions-index.json"

  if [ -f "$index_file" ] && command -v jq &>/dev/null; then
    # Handle both array format and {version, entries} format
    jq -r '
      (if type == "array" then . elif type == "object" then (.entries // []) else [] end)
      | sort_by(.createdAt) | reverse | .[].sessionId
    ' "$index_file" 2>/dev/null
  else
    # Fallback: find .jsonl files sorted by mtime (newest first).
    # GNU stat first (BSD stat -f on Linux silently prints filesystem info).
    find "$project_dir" -name "*.jsonl" -maxdepth 1 2>/dev/null \
      | while read -r f; do
          local m
          m=$(stat -c '%Y' "$f" 2>/dev/null || stat -f '%m' "$f" 2>/dev/null || echo 0)
          printf '%s %s\n' "$m" "$f"
        done \
      | sort -rn \
      | awk '{print $2}' \
      | xargs -I{} basename {} .jsonl
  fi
}

# Get session timestamp (epoch) from sessions-index.json or file mtime
get_session_timestamp() {
  local project_dir="$1"
  local session_id="$2"
  local index_file="$project_dir/sessions-index.json"

  if [ -f "$index_file" ] && command -v jq &>/dev/null; then
    local ts
    ts=$(jq -r --arg sid "$session_id" '
      (if type == "array" then . elif type == "object" then (.entries // []) else [] end)
      | map(select(.sessionId == $sid)) | .[0].createdAt // empty
    ' "$index_file" 2>/dev/null || true)
    if [ -n "$ts" ]; then
      # Convert ISO date to epoch. GNU date first (exits cleanly on BSD),
      # then BSD date. Same order-sensitivity rule applies to stat.
      date -d "${ts%%.*}" "+%s" 2>/dev/null \
        || date -j -f "%Y-%m-%dT%H:%M:%S" "${ts%%.*}" "+%s" 2>/dev/null \
        || stat -c %Y "$project_dir/${session_id}.jsonl" 2>/dev/null \
        || stat -f %m "$project_dir/${session_id}.jsonl" 2>/dev/null \
        || echo "0"
      return
    fi
  fi

  # Fallback to file mtime. GNU -c %Y first (BSD stat -f with %m as literal
  # prints filesystem info and exits 0, poisoning the output), then BSD.
  stat -c %Y "$project_dir/${session_id}.jsonl" 2>/dev/null \
    || stat -f %m "$project_dir/${session_id}.jsonl" 2>/dev/null \
    || echo "0"
}

# Collect sessions across multiple dirs with merge-sort
collect_project_group() {
  local tmpdir="$1"
  shift
  local dirs=("$@")

  # Declared at function scope so collect_cursor_sessions "$tmpdir" "$selected_remote"
  # (line ~3066, outside the CODEX_DIR conditional that previously owned the
  # `local` declaration) has a defined value when CODEX_DIR is absent. Without
  # this, `set -u` trips with "selected_remote: unbound variable" under any
  # invocation path where the Claude project group has no Codex directory
  # to mirror. Exposed by the DRY_RUN staging path; also latent in legacy.
  local selected_remote=""

  # Build session list: (timestamp, dir_name, session_id, file_size)
  local session_list_file
  session_list_file=$(mktemp)

  for dir_name in "${dirs[@]}"; do
    local project_dir="$CLAUDE_DIR/$dir_name"
    [ -d "$project_dir" ] || continue

    # Copy sessions-index.json
    mkdir -p "$tmpdir/$dir_name"
    if [ -f "$project_dir/sessions-index.json" ]; then
      cp "$project_dir/sessions-index.json" "$tmpdir/$dir_name/"
    fi

    while IFS= read -r session_id; do
      [ -z "$session_id" ] && continue
      local jsonl_file="$project_dir/${session_id}.jsonl"
      [ -f "$jsonl_file" ] || continue

      local ts
      ts=$(get_session_timestamp "$project_dir" "$session_id")
      local file_size
      file_size=$(wc -c < "$jsonl_file" | tr -d ' ')

      echo "$ts $dir_name $session_id $file_size" >> "$session_list_file"
    done < <(get_sorted_sessions "$project_dir")
  done

  # Sort by timestamp (newest first) and process
  local sorted_file
  sorted_file=$(mktemp)
  sort -rn "$session_list_file" > "$sorted_file"

  local accumulated_bytes=0
  local session_count=0
  local pr_links_json="[]"
  local dir_metadata_json="{}"

  # Build directory metadata for sidecar
  for dir_name in "${dirs[@]}"; do
    local cwd
    cwd=$(get_project_cwd "$dir_name")
    local remote
    remote=$(get_git_remote "$cwd")
    # Orphan recovery: server-side TranscriptDiscoverer consumes this
    # remote to find-or-create the Project; empty means per-dir Project.
    if [ -z "$remote" ] && [ -n "$cwd" ] && [ ! -e "$cwd" ]; then
      remote=$(resolve_remote_for_dead_cwd "$cwd")
    fi
    if [ -n "$remote" ] || [ -n "$cwd" ]; then
      dir_metadata_json=$(echo "$dir_metadata_json" | jq \
        --arg dir "$dir_name" \
        --arg remote "$remote" \
        --arg cwd "$cwd" \
        '. + {($dir): {"git_remote": $remote, "cwd": $cwd}}' 2>/dev/null || echo "$dir_metadata_json")
    fi
  done

  while IFS=' ' read -r ts dir_name session_id file_size; do
    [ -z "$session_id" ] && continue

    # Apply --since filter
    if [ -n "$SINCE_EPOCH" ] && [ "$ts" -lt "$SINCE_EPOCH" ] 2>/dev/null; then
      continue
    fi

    # Track oldest session timestamp (post-filter) for author-filtered git collection
    if [ -z "$OLDEST_SESSION_EPOCH" ] || [ "$ts" -lt "$OLDEST_SESSION_EPOCH" ] 2>/dev/null; then
      OLDEST_SESSION_EPOCH="$ts"
    fi

    local project_dir="$CLAUDE_DIR/$dir_name"
    local jsonl_file="$project_dir/${session_id}.jsonl"

    mkdir -p "$tmpdir/$dir_name"
    cp "$jsonl_file" "$tmpdir/$dir_name/"
    accumulated_bytes=$(($accumulated_bytes + $file_size))
    session_count=$((session_count + 1))

    # Scan for PR links (grep for pr-link pattern in JSONL)
    # Claude Code JSONL uses camelCase: "prNumber", "prUrl", "prRepository"
    local pr_match
    pr_match=$(grep -o '"pr-link","sessionId":"[^"]*","prNumber":[0-9]*,"prUrl":"[^"]*","prRepository":"[^"]*"' "$jsonl_file" 2>/dev/null | head -1 || true)
    if [ -n "$pr_match" ]; then
      local pr_num pr_url pr_repo
      pr_num=$(echo "$pr_match" | grep -o '"prNumber":[0-9]*' | sed 's/"prNumber"://')
      pr_url=$(echo "$pr_match" | grep -o '"prUrl":"[^"]*"' | sed 's/"prUrl":"//;s/"$//')
      pr_repo=$(echo "$pr_match" | grep -o '"prRepository":"[^"]*"' | sed 's/"prRepository":"//;s/"$//')
      if [ -n "$pr_num" ] && command -v jq &>/dev/null; then
        pr_links_json=$(echo "$pr_links_json" | jq \
          --arg sid "$session_id" \
          --arg dir "$dir_name" \
          --argjson num "$pr_num" \
          --arg url "$pr_url" \
          --arg repo "$pr_repo" \
          '. + [{"session_id": $sid, "dir": $dir, "pr_number": $num, "pr_url": $url, "pr_repo": $repo}]' 2>/dev/null || echo "$pr_links_json")
      fi
    fi

    # Copy subagents directory if present
    local subagents_dir="$project_dir/${session_id}/subagents"
    if [ -d "$subagents_dir" ]; then
      mkdir -p "$tmpdir/$dir_name/${session_id}/subagents"
      cp "$subagents_dir"/*.jsonl "$tmpdir/$dir_name/${session_id}/subagents/" 2>/dev/null || true
    fi

    # Copy tool-results directory if present
    local tool_results_dir="$project_dir/${session_id}/tool-results"
    if [ -d "$tool_results_dir" ]; then
      mkdir -p "$tmpdir/$dir_name/${session_id}/tool-results"
      cp -r "$tool_results_dir/"* "$tmpdir/$dir_name/${session_id}/tool-results/" 2>/dev/null || true
    fi
  done < "$sorted_file"

  # Write _metadata.json sidecar. The recoveries count is the cumulative
  # unique orphan recoveries during this script run (via the dedup log);
  # for single-repo uploads this is exact, for multi-repo it over-counts
  # later children (acceptable — admins see aggregate run activity).
  local _rmdc_total
  _rmdc_total=$(_rmdc_recovery_count_unique)
  if command -v jq &>/dev/null; then
    jq -n \
      --argjson dirs "$dir_metadata_json" \
      --argjson prs "$pr_links_json" \
      --argjson recoveries "${_rmdc_total:-0}" \
      '{"version": 1, "directories": $dirs, "pr_links": $prs, "orphan_recovery_count": $recoveries}' \
      > "$tmpdir/_metadata.json"
  fi

  rm -f "$session_list_file" "$sorted_file"

  echo "  Claude Code: ${session_count} sessions across ${#dirs[@]} workspaces, $(($accumulated_bytes / 1024 / 1024))MB" >&2

  # Collect matching Codex sessions for the same git remote
  # Determine the selected project's git remote — used by BOTH Codex and
  # Cursor helpers below, so hoist out of any $CODEX_DIR guard.
  local selected_remote=""
  for dir_name in "${dirs[@]}"; do
    local cwd
    cwd=$(get_project_cwd "$dir_name")
    local remote
    remote=$(get_git_remote "$cwd")
    if [ -z "$remote" ] && [ -n "$cwd" ] && [ ! -e "$cwd" ]; then
      remote=$(resolve_remote_for_dead_cwd "$cwd")
    fi
    if [ -n "$remote" ]; then
      selected_remote="$remote"
      break
    fi
  done

  # Codex: gate on non-empty remote. An empty selected_remote tells the helper
  # to include every repo's sessions (--all mode), which would widen a scoped
  # upload. Handoff gotcha #5.
  if [ -n "$selected_remote" ]; then
    collect_codex_sessions "$tmpdir" "$selected_remote"
  fi

  # Collect matching Cursor IDE sessions for the same git remote
  collect_cursor_sessions "$tmpdir" "$selected_remote"
  # Collect matching opencode sessions for the same git remote
  collect_opencode_sessions "$tmpdir" "$selected_remote"
  # Collect matching Gemini CLI sessions for the same git remote
  collect_gemini_sessions "$tmpdir" "$selected_remote"
  # Collect matching VS Code Copilot sessions for the same git remote
  collect_vscode_copilot_sessions "$tmpdir" "$selected_remote"
  # Collect matching Antigravity sessions for the same git remote
  collect_antigravity_sessions "$tmpdir" "$selected_remote"
  _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
}

list_projects() {
  if [ ! -d "$CLAUDE_DIR" ]; then
    echo "Error: Claude projects directory not found at $CLAUDE_DIR" >&2
    exit 1
  fi

  # List directories that contain .jsonl files
  local projects=()
  for dir in "$CLAUDE_DIR"/*/; do
    [ -d "$dir" ] || continue
    local name
    name=$(basename "$dir")
    # Check if directory has any .jsonl files.
    # `find -print -quit` SIGPIPEs on first match → ERR trap. Same family
    # as the OLDEST_SESSION_EPOCH fix (PR #389).
    local has_jsonl
    has_jsonl=$(find "$dir" -name "*.jsonl" -maxdepth 3 -print -quit 2>/dev/null || true)
    if [ -n "$has_jsonl" ]; then
      projects+=("$name")
    fi
  done

  if [ ${#projects[@]} -eq 0 ]; then
    echo "Error: No projects with transcripts found in $CLAUDE_DIR" >&2
    exit 1
  fi

  printf '%s\n' "${projects[@]}"
}



# Read a cached normalized remote for an encoded Claude dir from
# ~/.paxel/cache/project-remotes-v2.tsv. Skips the "name:*" / "local:*" /
# exact-match "unknown" fallback keys that list_projects_grouped writes for
# unresolvable dirs — anchor "unknown" at end (via `$2 != "unknown"`) so a
# real remote like "unknownhost.io/org/repo" isn't silently filtered out.
# Cursor's dead-ws fallback (:1016) uses shell glob `unknown)` with no
# trailing wildcard, matching this semantic.
#
# Used by collect_all_projects as a last-resort fallback for Conductor dead
# cwds, which short-circuit inside resolve_remote_for_dead_cwd and have no
# other local signal to recover from once all siblings are deleted.
_project_cache_read_remote() {
  local dir="$1"
  local cache="${HOME}/.paxel/cache/project-remotes-v2.tsv"
  [ -z "$dir" ] && return 0
  [ ! -f "$cache" ] && return 0
  awk -F'\t' -v d="$dir" '
    $1 == d && $2 != "" && $2 !~ /^(name:|local:)/ && $2 != "unknown" { print $2; exit }
  ' "$cache" 2>/dev/null || true
}

# Merge a TSV of (dir, remote, sessions, mtime, inferred) rows into the
# project-remote cache. Rows for dirs we saw this run overwrite any existing
# row; rows for dirs we didn't see are preserved (list_projects_grouped may
# have written them on an earlier --project run). Creates the cache if
# missing. Called at the end of collect_all_projects so the next --all run
# can recover a Conductor workspace whose dir has since been deleted.
_project_cache_persist_rows() {
  local new_rows_file="$1"
  [ ! -s "$new_rows_file" ] && return 0
  local cache="${HOME}/.paxel/cache/project-remotes-v2.tsv"
  mkdir -p "$(dirname "$cache")"
  local merged awk_ok=0
  merged=$(mktemp)
  if [ -f "$cache" ]; then
    if awk -F'\t' -v new_file="$new_rows_file" '
      BEGIN {
        while ((getline line < new_file) > 0) {
          n = split(line, f, "\t")
          if (n >= 1) new_rows[f[1]] = line
        }
        close(new_file)
      }
      {
        if ($1 in new_rows) {
          print new_rows[$1]
          delete new_rows[$1]
        } else {
          print $0
        }
      }
      END {
        for (d in new_rows) print new_rows[d]
      }
    ' "$cache" > "$merged" 2>/dev/null; then
      awk_ok=1
    fi
  else
    cp "$new_rows_file" "$merged" && awk_ok=1
  fi
  # Only overwrite the real cache if the merge succeeded AND produced non-
  # empty output. A mid-stream awk failure (signal, disk-full) could leave a
  # truncated $merged with data — swapping it in would corrupt the cache; bail.
  if [ "$awk_ok" = "1" ] && [ -s "$merged" ]; then
    mv "$merged" "$cache"
  else
    rm -f "$merged"
  fi
}

collect_all_projects() {
  local tmpdir="$1"

  # Collect Claude Code sessions
  if [ -d "$CLAUDE_DIR" ]; then
    cd "$CLAUDE_DIR"
    local claude_count=0
    find . \( -name "*.jsonl" -o -name "sessions-index.json" \) | while read -r f; do
      mkdir -p "$tmpdir/$(dirname "$f")"
      cp "$f" "$tmpdir/$f"
    done
    claude_count=$(find . -name "*.jsonl" -not -name "_*" -not -path "*/_git/*" -not -path "*/subagents/*" -maxdepth 3 2>/dev/null | wc -l | tr -d ' ')
    if [ "$claude_count" -gt 0 ]; then
      echo "  Claude Code: ${claude_count} sessions" >&2
    fi

    # Copy tool-results directories
    find . -type d -name "tool-results" | while read -r d; do
      mkdir -p "$tmpdir/$d"
      cp -r "$d/"* "$tmpdir/$d/" 2>/dev/null || true
    done
  fi

  # Write _metadata.json entries for each Claude project dir so the server's
  # TranscriptDiscoverer merges worktrees that share a git remote into one
  # Project (find_or_create_by!(git_remote: ...)) instead of scattering by
  # encoded_name. Without this, users with N Conductor worktrees of the same
  # repo see N separate Projects in --all uploads. Mirrors the pattern
  # collect_project_group already uses at line 2015-2032.
  #
  # `cd "$CLAUDE_DIR"` above has already run (claude_count > 0 implies the
  # Claude dir existed), so we pin CLAUDE_DIR to $PWD (absolute form) for the
  # duration of the loop — get_project_cwd reads $CLAUDE_DIR internally and
  # would double-resolve a relative value under the cd'd cwd.
  if [ "${claude_count:-0}" -gt 0 ] && command -v jq &>/dev/null; then
    [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
    local _orig_claude_dir="$CLAUDE_DIR"
    CLAUDE_DIR="$PWD"
    local claude_sidecar_count=0
    # Cache rows to persist at end of loop. Populated with every dir whose
    # remote resolved (live OR via resolver/cache recovery). Persisted to
    # ~/.paxel/cache/project-remotes-v2.tsv so that if the workspace is
    # later deleted, the next --all run can still attribute its sessions.
    local _cache_rows_file
    _cache_rows_file=$(mktemp)
    for proj_dir in */; do
      [ -d "$proj_dir" ] || continue
      local pname pcwd premote _p_inferred=0
      # Parameter expansion over `basename "$proj_dir"` — Claude encoded
      # project dir names like `-Users-...` trip basename's leading-dash
      # flag parsing ("illegal option -- U").
      pname="${proj_dir%/}"
      pcwd=$(get_project_cwd "$pname")
      premote=$(get_git_remote "$pcwd")
      # Dead cwd recovery (deleted worktrees, removed subdirs)
      if [ -z "$premote" ] && [ -n "$pcwd" ] && [ ! -e "$pcwd" ]; then
        premote=$(resolve_remote_for_dead_cwd "$pcwd" 2>/dev/null || true)
        [ -n "$premote" ] && _p_inferred=1
        # Conductor dead-cwd cache fallback. resolve_remote_for_dead_cwd
        # short-circuits */conductor/workspaces/*|*/.conductor/* paths
        # (PR #647 comment: ancestor + sibling-walk strategies can't span
        # Conductor-project boundaries correctly). If the cache has a prior
        # remote for this encoded dir — written by a past run where the
        # workspace WAS live — use it. Unblocks the first-run-after-delete
        # Conductor+jj case that no other strategy can reach. Honor the
        # orphan-recovery opt-out: PAXEL_NO_ORPHAN_RECOVERY=1 disables this
        # fallback alongside the ancestor/sibling walks it already gates.
        if [ -z "$premote" ] && [ "${PAXEL_NO_ORPHAN_RECOVERY:-0}" != "1" ]; then
          case "$pcwd" in
            */conductor/workspaces/*/*|*/.conductor/*)
              premote=$(_project_cache_read_remote "$pname")
              if [ -n "$premote" ]; then
                echo "[paxel] Recovered remote for $pcwd via project-cache($pname) -> $premote" >&2
                _log_recovery_source "$pcwd" "project-cache"
                _p_inferred=1
              fi
              ;;
          esac
        fi
      fi
      # Unresolvable Conductor dead-cwd path: every strategy above
      # (resolver, sibling walks, project-cache) was tried and came back
      # empty. Tell the user what happened and how to recover; otherwise
      # the sessions ship under an encoded-name orphan Project and the
      # root cause is invisible to both user and support.
      if [ -z "$premote" ] && [ -n "$pcwd" ] && [ ! -e "$pcwd" ]; then
        _warn_unresolvable_conductor_cwd "$pname" "$pcwd"
      fi
      # Skip if we can't produce any routing signal at all
      [ -z "$premote" ] && [ -z "$pcwd" ] && continue
      local updated
      updated=$(jq \
        --arg dir "$pname" \
        --arg remote "${premote:-}" \
        --arg cwd "${pcwd:-}" \
        '.directories[$dir] = {"git_remote": $remote, "cwd": $cwd}' \
        "$tmpdir/_metadata.json" 2>/dev/null)
      [ -n "$updated" ] && echo "$updated" > "$tmpdir/_metadata.json"
      # Count every sidecar write so the status line matches what landed.
      claude_sidecar_count=$((claude_sidecar_count + 1))
      # Record for cache persistence so future --all runs can recover dead
      # Conductor cwds after the workspace is deleted. Persist empty-remote
      # rows too — they clear stale cache entries from a prior live run
      # whose remote has since disappeared (without this, a dir that loses
      # its remote would keep the stale one forever). _p_inferred tracks
      # whether $premote came from live resolution (0) or the resolver/
      # cache fallback (1) so load_project_cache can force a re-verify on
      # the next non-all run (matching list_projects_grouped:2057 semantics).
      #
      # Opt-out + empty premote + DEAD cwd: recovery paths (resolver + cache
      # fallback above) were SKIPPED by PAXEL_NO_ORPHAN_RECOVERY=1, so
      # "empty" means "we didn't look" rather than "verified unresolvable".
      # Writing empty here would clobber the user's warmed cache. Preserve
      # existing rows. Mirrors the Docker --all gate in
      # _docker_all_host_scan_for_recovery:1550-1555. Legacy's sidecar
      # write above already landed (the sidecar is the primary attribution
      # signal here; cache is best-effort for future-run recovery).
      local _legacy_skip_cache_write=0
      if [ "${PAXEL_NO_ORPHAN_RECOVERY:-0}" = "1" ] \
          && [ -z "$premote" ] \
          && [ -n "$pcwd" ] \
          && [ ! -e "$pcwd" ]; then
        _legacy_skip_cache_write=1
      fi

      if [ -n "$pname" ] && [ "$_legacy_skip_cache_write" != "1" ]; then
        # BSD find/stat on macOS parse leading `-` of encoded Claude dir
        # names (e.g. `-Users-...`, `-conductor-workspaces-...`) as option
        # flags; prefix with `./` to force path interpretation. Same family
        # of bug as the basename-leading-dash comment on the outer loop.
        local _pd_sessions _pd_mtime
        _pd_sessions=$(find "./$pname" -maxdepth 3 -name "*.jsonl" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
        _pd_mtime=$(stat -c %Y "./$pname" 2>/dev/null || stat -f %m "./$pname" 2>/dev/null || echo "0")
        printf '%s\t%s\t%s\t%s\t%s\n' "$pname" "$premote" "${_pd_sessions:-0}" "${_pd_mtime:-0}" "$_p_inferred" >> "$_cache_rows_file"
      fi
    done
    CLAUDE_DIR="$_orig_claude_dir"
    # Merge newly-resolved rows into the project-remote cache.
    _project_cache_persist_rows "$_cache_rows_file"
    rm -f "$_cache_rows_file"
    [ "$claude_sidecar_count" -gt 0 ] && echo "  Sidecar: ${claude_sidecar_count} Claude workspaces with git_remote/cwd" >&2
  fi

  # Collect Codex sessions via collect_codex_sessions helper. Empty second
  # arg = --all mode: buckets per-session remote into _codex_<slug>_<hash>/
  # (or _codex_unattributed/ for sessions with no repository_url), writes
  # per-bucket sidecar entries, and applies --since filtering.
  collect_codex_sessions "$tmpdir"

  # Collect all Cursor IDE sessions (no remote filter — --all mode).
  # collect_cursor_sessions already buckets per-workspace (_cursor_<basename>_<hash>/)
  # and writes _metadata.json entries with each bucket's git_remote. Without this
  # call, the legacy archive flow missed Cursor entirely in --all uploads — the
  # Docker flow mounts /cursor_sessions separately but the archive didn't.
  #
  # Guard the call: collect_cursor_sessions returns 1 if every DB extraction
  # fails (stale/schema-changed state.vscdb). Under `set -e` that would abort
  # the whole upload and throw away the Claude/Codex data we already collected.
  # Docker mode does the same best-effort wrap at line 3670.
  if ! collect_cursor_sessions "$tmpdir" ""; then
    echo "  Warning: Cursor session extraction had errors. Continuing with other sessions." >&2
  fi
  if ! collect_opencode_sessions "$tmpdir" ""; then
    echo "  Warning: opencode session extraction had errors. Continuing with other sessions." >&2
  fi
  if ! collect_gemini_sessions "$tmpdir" ""; then
    echo "  Warning: Gemini session extraction had errors. Continuing with other sessions." >&2
  fi
  if ! collect_vscode_copilot_sessions "$tmpdir" ""; then
    echo "  Warning: VS Code Copilot session extraction had errors. Continuing with other sessions." >&2
  fi
  if ! collect_antigravity_sessions "$tmpdir" ""; then
    echo "  Warning: Antigravity session extraction had errors. Continuing with other sessions." >&2
  fi
  _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
}

collect_single_project() {
  local tmpdir="$1"
  local project="$2"
  local project_dir="$CLAUDE_DIR/$project"

  if [ ! -d "$project_dir" ]; then
    echo "Error: Project directory not found: $project_dir"
    exit 1
  fi

  mkdir -p "$tmpdir/$project"

  # Copy sessions-index.json if present
  if [ -f "$project_dir/sessions-index.json" ]; then
    cp "$project_dir/sessions-index.json" "$tmpdir/$project/"
  fi

  local accumulated_bytes=0
  local session_count=0

  # Get sessions sorted by createdAt
  while IFS= read -r session_id; do
    [ -z "$session_id" ] && continue
    local jsonl_file="$project_dir/${session_id}.jsonl"
    [ -f "$jsonl_file" ] || continue

    local file_size
    file_size=$(wc -c < "$jsonl_file" | tr -d ' ')

    cp "$jsonl_file" "$tmpdir/$project/"
    accumulated_bytes=$(($accumulated_bytes + $file_size))
    session_count=$((session_count + 1))

    # Copy subagents directory if present
    local subagents_dir="$project_dir/${session_id}/subagents"
    if [ -d "$subagents_dir" ]; then
      mkdir -p "$tmpdir/$project/${session_id}/subagents"
      cp "$subagents_dir"/*.jsonl "$tmpdir/$project/${session_id}/subagents/" 2>/dev/null || true
    fi

    # Copy tool-results directory if present
    local tool_results_dir="$project_dir/${session_id}/tool-results"
    if [ -d "$tool_results_dir" ]; then
      mkdir -p "$tmpdir/$project/${session_id}/tool-results"
      cp -r "$tool_results_dir/"* "$tmpdir/$project/${session_id}/tool-results/" 2>/dev/null || true
    fi
  done < <(get_sorted_sessions "$project_dir")

  echo "  Collected: ${session_count} sessions, $(($accumulated_bytes / 1024 / 1024))MB"

  # Derive the selected project's git remote once for both Codex and Cursor
  # filtering below. Empty remote (unresolved cwd, no origin) means no filter
  # gets applied — Codex's `-n "$selected_remote"` guard below short-circuits,
  # and Cursor's extract_cursor_db treats empty as "match all" per its own logic.
  local cwd
  cwd=$(get_project_cwd "$project")
  local selected_remote
  selected_remote=$(get_git_remote "$cwd")
  # Dead cwd recovery (deleted subdirs, moved workspaces) — parity with
  # collect_project_group and collect_all_projects. Non-Conductor only
  # (resolve_remote_for_dead_cwd short-circuits */conductor/workspaces/*
  # and */.conductor/* at :1297 because those need sibling-worktree data,
  # not ancestor walk).
  if [ -z "$selected_remote" ] && [ -n "$cwd" ] && [ ! -e "$cwd" ]; then
    selected_remote=$(resolve_remote_for_dead_cwd "$cwd" 2>/dev/null || true)
  fi

  # Conductor dead-workspace fallback: list_projects_grouped's
  # backfill_conductor_remotes pre-pass walks sibling Conductor workspaces
  # and writes the recovered remote into ~/.paxel/cache/project-remotes-v2.tsv
  # (schema: dir<TAB>key<TAB>sessions<TAB>mtime<TAB>inferred). Single-line
  # awk lookup is cheap — avoids the full load_project_cache scan when
  # --project X is invoked directly. Skips fallback keys (name:/local:/unknown)
  # which would fail the exact-string Codex/Cursor filter downstream anyway.
  #
  # Gated on dead cwd (matching the upstream resolver gate above). A live
  # project with no origin shouldn't resurrect a stale cached key — the
  # correct behavior there is fail-closed, same as pre-PR.
  #
  # Staleness: load_project_cache revalidates `inferred=1` rows on its next
  # run by forcing them into the miss set. This fallback reads raw TSV
  # without revalidation. Accepted ceiling — the inferred remote was
  # correct at last backfill; users who suspect staleness can
  # `bin/upload --clear-cache` or run `--all` to refresh.
  if [ -z "$selected_remote" ] && [ -n "$cwd" ] && [ ! -e "$cwd" ]; then
    local _cache_file="${HOME}/.paxel/cache/project-remotes-v2.tsv"
    if [ -f "$_cache_file" ]; then
      local _cached_key
      _cached_key=$(awk -F'\t' -v d="$project" '$1==d{print $2; exit}' "$_cache_file" 2>/dev/null || true)
      case "$_cached_key" in
        name:*|local:*|unknown|'') ;;
        *) selected_remote="$_cached_key" ;;
      esac
    fi
  fi

  # Collect matching Codex sessions via collect_codex_sessions helper. Gate on
  # non-empty remote — an empty selected_remote tells the helper to include
  # every repo's sessions (--all mode), which would widen a scoped upload.
  # Handoff gotcha #5.
  if [ -n "$selected_remote" ]; then
    collect_codex_sessions "$tmpdir" "$selected_remote"
  fi

  # Write a _metadata.json entry for the selected Claude project dir so
  # the server's TranscriptDiscoverer merges it with the matching Codex
  # and Cursor buckets (all three discovered by shared git_remote) instead
  # of creating a separate Project keyed by encoded_name.
  if [ -n "$selected_remote" ] && command -v jq &>/dev/null; then
    [ ! -f "$tmpdir/_metadata.json" ] && echo '{"version":1,"directories":{}}' > "$tmpdir/_metadata.json"
    local claude_updated
    claude_updated=$(jq \
      --arg dir "$project" \
      --arg remote "$selected_remote" \
      --arg cwd "${cwd:-}" \
      '.directories[$dir] = {"git_remote": $remote, "cwd": $cwd}' \
      "$tmpdir/_metadata.json" 2>/dev/null)
    [ -n "$claude_updated" ] && echo "$claude_updated" > "$tmpdir/_metadata.json"
  fi

  # Collect matching Cursor IDE sessions for the same git remote. Skip
  # Cursor entirely when selected_remote is empty — empty here means the
  # project's cwd is resolvable-live but has no origin, OR is dead AND
  # the ancestor/sibling recovery above also failed (or was skipped for
  # Conductor paths). extract_cursor_db treats empty as "no filter, include
  # all workspaces", which would silently upload every Cursor workspace on
  # the machine to a scoped single-project archive. Codex is also skipped
  # in this case (:2822), keeping archive behavior consistent.
  if [ -n "$selected_remote" ]; then
    if ! collect_cursor_sessions "$tmpdir" "$selected_remote"; then
      echo "  Warning: Cursor session extraction had errors. Continuing with other sessions." >&2
    fi
    if ! collect_opencode_sessions "$tmpdir" "$selected_remote"; then
      echo "  Warning: opencode session extraction had errors. Continuing with other sessions." >&2
    fi
    if ! collect_gemini_sessions "$tmpdir" "$selected_remote"; then
      echo "  Warning: Gemini session extraction had errors. Continuing with other sessions." >&2
    fi
    if ! collect_vscode_copilot_sessions "$tmpdir" "$selected_remote"; then
      echo "  Warning: VS Code Copilot session extraction had errors. Continuing with other sessions." >&2
    fi
    if ! collect_antigravity_sessions "$tmpdir" "$selected_remote"; then
      echo "  Warning: Antigravity session extraction had errors. Continuing with other sessions." >&2
    fi
  fi
  _refresh_orphan_recovery_count "$tmpdir/_metadata.json"
}

# Resolve --project NAME to PROJECT_DIRS via grouped data
resolve_project_name() {
  local name="$1"

  # First try: match against group display names
  local g=0
  while [ $g -lt ${#GROUP_DISPLAYS[@]} ]; do
    if [ "${GROUP_DISPLAYS[$g]}" = "$name" ]; then
      IFS='|' read -ra PROJECT_DIRS <<< "${GROUP_DIRS[$g]}"
      return 0
    fi
    g=$((g + 1))
  done

  # Second try: match against encoded dir names (backward compat)
  g=0
  while [ $g -lt ${#GROUP_DIRS[@]} ]; do
    local dirs_str="${GROUP_DIRS[$g]}"
    IFS='|' read -ra check_dirs <<< "$dirs_str"
    for d in "${check_dirs[@]}"; do
      if [ "$d" = "$name" ]; then
        IFS='|' read -ra PROJECT_DIRS <<< "$dirs_str"
        return 0
      fi
    done
    g=$((g + 1))
  done

  return 1
}

# --- Docker orchestration ---

check_docker() {
  local os arch
  os="$(uname -s)"
  arch="$(uname -m)"

  # Step 1: Check Docker is installed
  if ! command -v docker &>/dev/null; then
    echo "Paxel runs analysis locally in a Docker container to keep your code private." >&2
    echo "" >&2
    echo "Error: Docker is not installed or not in PATH." >&2
    echo "" >&2
    case "$os" in
      Darwin)
        echo "Install Docker Desktop for Mac:" >&2
        if [ "$arch" = "arm64" ]; then
          echo "  https://desktop.docker.com/mac/main/arm64/Docker.dmg" >&2
        else
          echo "  https://desktop.docker.com/mac/main/amd64/Docker.dmg" >&2
        fi
        echo "" >&2
        echo "Or visit: https://www.docker.com/products/docker-desktop/" >&2
        if [ -c /dev/tty ]; then
          printf "Open download page in browser? [Y/n] " >&2
          local answer
          read -r answer </dev/tty
          case "$answer" in
            n|N|no|No) ;;
            *) open "https://www.docker.com/products/docker-desktop/" ;;
          esac
        fi
        ;;
      Linux)
        echo "Install Docker via the convenience script:" >&2
        echo "  curl -fsSL https://get.docker.com | sh" >&2
        echo "" >&2
        echo "Or install via your package manager:" >&2
        echo "  Ubuntu/Debian: sudo apt-get install docker.io" >&2
        echo "  Fedora:        sudo dnf install docker-ce" >&2
        echo "  Arch:          sudo pacman -S docker" >&2
        ;;
      *)
        echo "Install Docker: https://docs.docker.com/get-docker/" >&2
        ;;
    esac
    exit 1
  fi

  # Step 2: Check daemon is running — auto-launch on macOS
  if ! docker info &>/dev/null 2>&1; then
    case "$os" in
      Darwin)
        echo "Docker is installed but its daemon isn't running. Trying to start Docker Desktop..." >&2
        # `open -a Docker` fails when the docker CLI is present without the
        # Docker Desktop app — colima, OrbStack, Rancher Desktop, a Homebrew
        # docker client, or a partial install. Guard it in an `if` (exempt from
        # set -e / the ERR trap) so the failure prints an actionable message
        # instead of tripping the generic _paxel_on_error "unexpected error".
        if ! open -a Docker 2>/dev/null; then
          echo "" >&2
          echo "Error: Docker's daemon isn't running, and we couldn't auto-start Docker Desktop (the Docker app isn't installed)." >&2
          echo "" >&2
          echo "You have the docker CLI but no running engine. Start whichever Docker runtime you use, then re-run this script:" >&2
          echo "  Docker Desktop:   open from Applications, or install at https://www.docker.com/products/docker-desktop/" >&2
          echo "  colima:           colima start" >&2
          echo "  OrbStack:         open -a OrbStack" >&2
          echo "  Rancher Desktop:  open -a 'Rancher Desktop'" >&2
          exit 1
        fi
        local waited=0
        while [ $waited -lt 60 ]; do
          if docker info &>/dev/null 2>&1; then
            echo "" >&2
            break
          fi
          printf "." >&2
          sleep 2
          waited=$((waited + 2))
        done
        if [ $waited -ge 60 ]; then
          echo "" >&2
          echo "Error: Docker's daemon didn't come up within 60 seconds." >&2
          echo "Start your Docker runtime manually (Docker Desktop, colima, OrbStack, …) and re-run this script." >&2
          exit 1
        fi
        ;;
      Linux)
        echo "Error: Docker daemon is not running." >&2
        echo "Start it with: sudo systemctl start docker" >&2
        exit 1
        ;;
      MINGW*|MSYS*|CYGWIN*)
        # Windows (Git Bash / MSYS / Cygwin). `docker info` through the docker.exe
        # shim can transiently fail while Docker Desktop's engine is still starting
        # (steven, 2026-06-06: daemon up but first probe failed), so retry a few
        # times before giving up — and NEVER suggest `systemctl`, which doesn't exist
        # here (the old `*)` fallthrough did). All probes stay in `if`/`while`
        # conditions, exempt from set -e / the ERR trap.
        local _win_waited=0
        while [ $_win_waited -lt 30 ]; do
          if docker info >/dev/null 2>&1; then
            break
          fi
          printf "." >&2
          sleep 3
          _win_waited=$((_win_waited + 3))
        done
        if ! docker info >/dev/null 2>&1; then
          echo "" >&2
          echo "Error: Docker's daemon isn't responding." >&2
          echo "Open Docker Desktop (Start menu or system tray), wait until it says \"running\", then re-run this command." >&2
          exit 1
        fi
        echo "" >&2
        ;;
      *)
        echo "Error: Docker daemon is not running." >&2
        echo "Start Docker Desktop or run: sudo systemctl start docker" >&2
        exit 1
        ;;
    esac
  fi

  # Step 3: Check Docker version >= 20.10
  local docker_version
  docker_version=$(docker version --format '{{.Server.Version}}' 2>/dev/null || echo "0.0")
  local major minor
  major=$(echo "$docker_version" | cut -d. -f1)
  minor=$(echo "$docker_version" | cut -d. -f2)
  if [ "${major:-0}" -lt 20 ] || { [ "${major:-0}" -eq 20 ] && [ "${minor:-0}" -lt 10 ]; }; then
    echo "Error: Docker version $docker_version is too old (minimum: 20.10)." >&2
    echo "Update Docker: https://docs.docker.com/engine/install/" >&2
    exit 1
  fi

  echo "[1/17] Checking prerequisites — Docker version $docker_version ✓"
}

save_token() {
  mkdir -p "$(dirname "$PAXEL_TOKEN_FILE")"
  echo "$YC_TOKEN" > "$PAXEL_TOKEN_FILE"
  chmod 600 "$PAXEL_TOKEN_FILE"
  echo "  Token saved to $PAXEL_TOKEN_FILE"
}

# Validate a token against /api/v1/token/check. Returns 0 on 200, 1 otherwise
# (including network errors — we treat unreachable as invalid to fail pre-Docker
# rather than 5 minutes in at upload time).
#
# Also sets `$_PAXEL_LAST_TOKEN_CHECK_CODE` to one of:
#   "skip"  — PAXEL_SKIP_TOKEN_VALIDATION=1 short-circuit
#   "empty" — empty token argument
#   "000"   — curl failure (DNS / connect / timeout)
#   <http>  — HTTP status code from /api/v1/token/check
# Callers can inspect this to tailor error messages (401/403 = revoked,
# 5xx/000 = server blip). The return value stays binary so the escape
# hatch (PAXEL_SKIP_TOKEN_VALIDATION=1) and the happy path stay simple.
#
# PAXEL_SKIP_TOKEN_VALIDATION=1 bypasses the curl. All three token sources
# (env-var, baked-from-URL, saved-file) now validate via this endpoint. Escape
# hatch mirrors PAXEL_SKIP_PREFLIGHT.
_PAXEL_LAST_TOKEN_CHECK_CODE=""
validate_token() {
  local token="$1"
  if [ "${PAXEL_SKIP_TOKEN_VALIDATION:-0}" = "1" ]; then
    _PAXEL_LAST_TOKEN_CHECK_CODE="skip"
    return 0
  fi
  if [ -z "$token" ]; then
    _PAXEL_LAST_TOKEN_CHECK_CODE="empty"
    return 1
  fi
  # The `|| http_code="000"` fallback has to live OUTSIDE the command
  # substitution: curl writes its `%{http_code}` output ("000" on
  # connection failure) to stdout AND exits non-zero. An `|| echo "000"`
  # INSIDE `$(...)` concatenates to "000000", which the 000) case arm
  # below would silently miss. PR #655 dual-review (Codex + Opus)
  # caught this after the initial commit — tests stubbed `return 7`
  # with no stdout, which didn't match real curl behavior.
  local http_code
  http_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 \
    -H "X-YC-Token: ${token}" \
    "${PAXEL_SERVER}/api/v1/token/check" 2>/dev/null) || http_code="000"
  _PAXEL_LAST_TOKEN_CHECK_CODE="$http_code"
  [ "$http_code" = "200" ]
}

# Exit status for a run stopped because the account's analysis budget is spent.
# Distinct from the container's codes (3 no analyzable sessions, 4 upload
# deferred, 5 upload failed) so a budget stop never reads as a crash, and 6 is
# left free for the container to signal a budget stop it hits mid-run.
PAXEL_EXIT_QUOTA_STOPPED=7

# First value for KEY in a small JSON body: strings come back unquoted, numbers
# and booleans verbatim, a missing key OR a null as "". Same shape as the
# device-auth poll parser, and it keeps jq off the dependency list. Assumes the
# compact, space-free output of the server's JSON renderer.
_paxel_json_value() {
  local match
  match=$(printf '%s' "$1" | grep -Eo "\"$2\":(\"[^\"]*\"|[^,}]*)" | head -1 || true)
  [ -z "$match" ] && return 0
  match="${match#*:}"
  match="${match#\"}"
  match="${match%\"}"
  [ "$match" = "null" ] && return 0
  printf '%s' "$match"
}

_paxel_is_uint() {
  case "${1:-}" in
    ""|*[!0-9]*) return 1 ;;
  esac
  return 0
}

_paxel_dollars() {
  printf '$%d.%02d' "$(($1 / 100))" "$(($1 % 100))"
}

# Shared tail for the two limits that a UTC-midnight reset actually clears.
_paxel_quota_reset_advice() {
  echo "  Re-run after the reset. Your cached analysis from earlier runs is kept, so it"
  echo "  picks up where this stopped instead of paying for the same work twice. A report"
  echo "  that finished but never uploaded still goes out on your next run."
  echo ""
  echo "  Need more today? Email paxel@ycombinator.com and say what you're analyzing."
}

# Read the account's daily analysis budget from token/check and stop the run
# with the real numbers if it's spent, instead of letting the user find out
# several paid minutes into the pipeline.
#
# FAILS OPEN on everything it cannot read — curl failure, any non-200, a server
# with no `quota` block, an unparseable field. This is advisory; the LLM proxy is
# what actually enforces the cap, so a hiccup reading a status endpoint must
# never be able to stop a run. Only a positively-parsed `"ok":false` stops
# anything. The fail-open paths are silent on purpose: "couldn't check your
# budget" would read as a fault on a run that is about to work fine.
check_daily_quota() {
  [ "${PAXEL_SKIP_TOKEN_VALIDATION:-0}" = "1" ] && return 0
  [ -z "${YC_TOKEN:-}" ] && return 0

  local response
  response=$(curl -s -w '\n%{http_code}' --max-time 5 \
    -H "X-YC-Token: ${YC_TOKEN}" \
    "${PAXEL_SERVER}/api/v1/token/check" 2>/dev/null) || return 0
  [ "$(printf '%s' "$response" | tail -1)" = "200" ] || return 0

  local body
  body=$(printf '%s' "$response" | sed '$d')
  [ "$(_paxel_json_value "$body" "ok")" = "false" ] || return 0

  local reason scope resets_at retry_after_reset spent cost_limit calls calls_limit
  reason=$(_paxel_json_value "$body" "reason")
  scope=$(_paxel_json_value "$body" "scope")
  resets_at=$(_paxel_json_value "$body" "resets_at")
  retry_after_reset=$(_paxel_json_value "$body" "retry_after_reset")
  spent=$(_paxel_json_value "$body" "daily_cost_cents")
  cost_limit=$(_paxel_json_value "$body" "daily_cost_limit_cents")
  calls=$(_paxel_json_value "$body" "daily_calls")
  calls_limit=$(_paxel_json_value "$body" "daily_calls_limit")

  local reset_display="midnight UTC"
  [ -n "$resets_at" ] && reset_display="$resets_at (midnight UTC)"

  local spend_today=""
  if _paxel_is_uint "$spent" && _paxel_is_uint "$cost_limit"; then
    spend_today="$(_paxel_dollars "$spent") of $(_paxel_dollars "$cost_limit")"
  fi

  case "$reason" in
    daily_cost_exceeded)
      if [ -z "$spend_today" ]; then return 0; fi
      {
        echo ""
        echo "Daily analysis budget spent — stopping before the container starts."
        echo ""
        echo "  Spent today:  $spend_today"
        echo "  Resets:       $reset_display"
        if [ "$scope" = "account" ]; then
          echo "  Every upload token on your account draws on this same budget, so signing in"
          echo "  again won't reset it."
        fi
        echo ""
        _paxel_quota_reset_advice
      } >&2
      ;;
    daily_calls_exceeded)
      if ! _paxel_is_uint "$calls" || ! _paxel_is_uint "$calls_limit"; then return 0; fi
      {
        echo ""
        echo "Daily analysis call limit reached — stopping before the container starts."
        echo ""
        echo "  Calls today:  $calls of $calls_limit"
        echo "  Resets:       $reset_display"
        if [ "$scope" = "account" ]; then
          echo "  Every upload token on your account draws on this same limit, so signing in"
          echo "  again won't reset it."
        fi
        echo ""
        _paxel_quota_reset_advice
      } >&2
      ;;
    exhausted|proxy_exhausted)
      # A per-token lifetime limit is the one quota a new credential legitimately
      # clears, and it is safe to clear it that way now: the daily budget follows
      # the ACCOUNT, so a replacement token inherits the same wallet and rotating
      # buys no extra spend. Drop the cached token so the next run signs in again
      # — without this the run would stop here on every retry, since token/check
      # now (correctly) reports the credential as valid.
      rm -f "${PAXEL_TOKEN_FILE:-$HOME/.paxel/token}" 2>/dev/null || true
      {
        echo ""
        echo "Upload token limit reached — stopping before the container starts."
        echo ""
        echo "  This upload token was issued with a fixed usage limit and has reached it."
        echo "  That limit doesn't reset at midnight, so waiting won't clear it."
        [ -n "$spend_today" ] && echo "  Today's spend is $spend_today, so the daily budget isn't what stopped you."
        echo ""
        if [ -n "${PAXEL_BAKED_TOKEN:-}" ]; then
          # The baked token takes precedence over the cached one, so clearing the
          # cache cannot help here — this user needs a new command.
          echo "  Grab a fresh upload command from your Paxel dashboard and run that."
        else
          echo "  Re-run and you'll be signed in again with a fresh token; your daily budget"
          echo "  is unchanged, and any report that finished but never uploaded still goes out."
        fi
        echo "  Still stuck? Email paxel@ycombinator.com."
      } >&2
      ;;
    *)
      {
        echo ""
        echo "Stopping before the container starts — the server won't admit new analysis"
        echo "for this account right now."
        echo ""
        echo "  Server reported: ${reason:-no reason given}"
        [ -n "$spend_today" ] && echo "  Spent today:     $spend_today"
        if [ "$retry_after_reset" = "true" ]; then
          echo "  Clears at:       $reset_display — re-run after that."
        else
          echo "  Waiting won't clear this one."
        fi
        echo ""
        echo "  Email paxel@ycombinator.com with the lines above and we'll sort it out."
      } >&2
      ;;
  esac

  exit "$PAXEL_EXIT_QUOTA_STOPPED"
}

# Try browser-based device auth flow. Opens browser, polls for token.
# Returns 0 on success (YC_TOKEN set), 1 on failure (fall back to manual).
try_device_auth() {
  # Generate 8-char alphanumeric code
  local code
  code=$(LC_ALL=C tr -dc 'A-Z0-9' < /dev/urandom 2>/dev/null | head -c 8 || true)
  if [ ${#code} -lt 8 ]; then
    return 1
  fi

  # Register the code with the server
  local register_response register_http
  register_response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "{\"code\":\"${code}\"}" \
    "${PAXEL_SERVER}/auth/cli/register" 2>/dev/null)
  register_http=$(echo "$register_response" | tail -1)

  if [ "$register_http" != "201" ]; then
    return 1
  fi

  # Open browser
  local auth_url="${PAXEL_SERVER}/auth/cli?code=${code}"
  echo ""
  echo "[2/17] Signing you in — opening browser..."
  echo "  If the browser doesn't open, visit: $auth_url"
  echo "  Authorize the CLI in your browser. If you're asked to sign in, we'll email you a login link — check spam if it's slow."
  echo ""

  if command -v open &>/dev/null; then
    open "$auth_url"
  elif command -v xdg-open &>/dev/null; then
    xdg-open "$auth_url" &>/dev/null &
  else
    echo "  Open this URL in your browser: $auth_url"
  fi

  # Poll for token
  local poll_url="${PAXEL_SERVER}/auth/cli/poll?code=${code}"
  local waited=0
  local max_wait=600
  local poll_interval=2

  printf "  Waiting for browser authorization"
  while [ $waited -lt $max_wait ]; do
    local poll_response poll_status
    poll_response=$(curl -s "$poll_url" 2>/dev/null)
    # || true: empty poll_status is expected while the user hasn't clicked yet;
    # the case `*)` branch below treats it as "keep waiting". grep no-match under
    # pipefail would otherwise fire a false ERR banner each poll.
    poll_status=$(echo "$poll_response" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4 || true)

    case "$poll_status" in
      complete)
        # Server said complete but may have returned an unexpected shape. Use
        # || true so grep no-match doesn't fire the ERR banner, then check and
        # surface a specific message if the token is missing.
        YC_TOKEN=$(echo "$poll_response" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
        if [ -z "$YC_TOKEN" ]; then
          echo ""
          echo "  Server returned complete without a token — falling back to manual sign-in." >&2
          return 1
        fi
        echo ""
        echo "  Authenticated!"
        save_token
        return 0
        ;;
      expired|not_found)
        echo ""
        echo "  Session expired." >&2
        return 1
        ;;
      *)
        printf "."
        sleep $poll_interval
        waited=$((waited + poll_interval))
        ;;
    esac
  done

  echo ""
  echo "  Browser auth timed out." >&2
  return 1
}

# Manual fallback: prompt user to paste token
manual_token_entry() {
  echo ""
  echo "[2/17] Signing you in..."
  echo "  Get your upload token at: ${PAXEL_SERVER}/auth/login"
  echo "  After logging in, copy the upload token from your dashboard. It starts"
  echo "  with 'yk_' — don't paste the report-link token shown on a results page."
  echo ""

  # Validate the format before saving. Upload tokens are "yk_…"; the 24-char
  # report-link token (shown on results pages) is the common mis-paste and would
  # otherwise fail much later with a confusing "Token not recognized" once the
  # pipeline first hits the LLM proxy. Re-prompt so the user can correct it in
  # place instead of re-running the whole command. Capped so a non-tty / piped
  # stdin can't loop forever.
  local attempts=0
  while :; do
    printf "  Paste your token: "
    user_read -r YC_TOKEN
    YC_TOKEN=$(echo "$YC_TOKEN" | tr -d '[:space:]')
    attempts=$((attempts + 1))

    case "$YC_TOKEN" in
      "")
        echo "Error: No token provided." >&2
        ;;
      yk_*)
        break
        ;;
      *)
        echo "  That doesn't look like an upload token — those start with 'yk_'." >&2
        echo "  You may have copied a report-link token. Get your upload token at:" >&2
        echo "    ${PAXEL_SERVER}/auth/login" >&2
        ;;
    esac

    if [ "$attempts" -ge 3 ]; then
      echo "Error: No valid upload token provided." >&2
      exit 1
    fi
  done

  save_token
}

# Send local git identity to server for pre-matching
register_git_identity() {
  local git_name git_email
  git_name=$(git config user.name 2>/dev/null || true)
  git_email=$(git config user.email 2>/dev/null || true)
  [ -z "$git_name" ] && [ -z "$git_email" ] && return 0

  # Escape values for JSON safety (handles quotes, backslashes in git names)
  local json_name json_email
  json_name=$(printf '%s' "$git_name" | sed 's/\\/\\\\/g; s/"/\\"/g')
  json_email=$(printf '%s' "$git_email" | sed 's/\\/\\\\/g; s/"/\\"/g')

  curl -s -X POST "${PAXEL_SERVER}/api/v1/identity/register" \
    -H "X-YC-Token: ${YC_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"git_name\":\"${json_name}\",\"git_email\":\"${json_email}\"}" \
    >/dev/null 2>&1 || true
}

# Detect the user's git email(s) for a specific repo.
# Fully client-side — no data sent to server.
# Returns pipe-delimited list of emails, or empty string if none found.
#
# Three signals:
#   1. git config user.email — the configured email for this repo
#   2. Session SHAs — commits made during Claude Code sessions, cross-referenced
#      with git log to find the author email (definitively the user's commits)
#   3. Name match — all emails in git log where author name matches git config
#      user.name (case-insensitive), catching other emails used by the same person
detect_author_emails() {
  local dir_cwd="$1"
  local session_dir="$2"  # directory containing session JSONL files
  local emails=()

  # Source 1: git config for THIS repo (not global cwd)
  local config_email
  config_email=$(git -C "$dir_cwd" config user.email 2>/dev/null || true)
  [ -n "$config_email" ] && emails+=("$config_email")

  # Source 2: Session SHAs → git log author email
  # Extract short SHAs from git_commit events in session transcripts,
  # then look up the author email for each from the local git repo.
  if [ -d "$session_dir" ]; then
    local sha_emails
    # || true: grep no-match exits 1 under pipefail, which fires the ERR trap
    # even though an empty result is expected here. Do not remove.
    sha_emails=$(grep -roh '"type":"git_commit"[^}]*"sha":"[a-f0-9]*"' "$session_dir" 2>/dev/null \
      | grep -o '"sha":"[a-f0-9]*"' | sed 's/"sha":"//;s/"//' | sort -u \
      | while read -r sha; do
          git -C "$dir_cwd" log "$sha" -1 --format='%aE' 2>/dev/null
        done | sort -u || true)
    for e in $sha_emails; do
      [ -n "$e" ] && emails+=("$e")
    done
  fi

  # Source 3: Name match — find all emails where git author name matches
  # the user's configured name (case-insensitive exact match).
  # Catches multi-email cases like alice@gmail.com when name is "Alice Example".
  # Assumes author names are unique per person in a repo (validated against prod data).
  local config_name
  config_name=$(git -C "$dir_cwd" config user.name 2>/dev/null || true)
  if [ -n "$config_name" ]; then
    # Escape regex special chars in the name for safe grep
    local escaped_name
    escaped_name=$(printf '%s' "$config_name" | sed 's/[.+*?^$[\]\\]/\\&/g')
    local name_emails
    # || true: grep no-match exits 1 under pipefail → false ERR banner when
    # no git author name matches user.name (e.g. brand-new repo). Do not remove.
    name_emails=$(git -C "$dir_cwd" log --format='%aN|%aE' 2>/dev/null | sort -u \
      | grep -i "^${escaped_name}|" | cut -d'|' -f2 | sort -u || true)
    for e in $name_emails; do
      [ -n "$e" ] && emails+=("$e")
    done
  fi

  # Deduplicate and return pipe-delimited
  if [ ${#emails[@]} -gt 0 ]; then
    printf '%s\n' "${emails[@]}" | sort -u | tr '\n' '|' | sed 's/|$//'
  fi
}

# Collect author-filtered commits for episode linking.
# Writes _author_commits.jsonl and _author_numstat.txt alongside existing files.
collect_author_commits() {
  local dir_cwd="$1"
  local git_data_dir="$2"
  local encoded="$3"
  local author_emails="$4"  # pipe-delimited
  local oldest_session_date="$5"  # ISO date or empty

  [ -z "$author_emails" ] && return 0

  # Build --author flags with regex-safe escaping
  # git --author is a regex match on "Author Name <email>",
  # so we anchor to <email> to avoid partial matches on . and +
  local author_flags=()
  IFS='|' read -ra email_arr <<< "$author_emails"
  for email in "${email_arr[@]}"; do
    [ -z "$email" ] && continue
    local escaped
    escaped=$(printf '%s' "$email" | sed 's/[.+*?^$[\]\\]/\\&/g')
    author_flags+=(--author="<${escaped}>")
  done

  [ ${#author_flags[@]} -eq 0 ] && return 0

  local since_flag=""
  [ -n "$oldest_session_date" ] && since_flag="--since=$oldest_session_date"

  # Author-filtered commits (full session date range). TAB-separated, subject
  # LAST: git's %s is raw, so a literal quote/backslash/control char in a commit
  # subject would corrupt a JSON line and silently drop that commit (audit C13).
  # A fixed-order TSV is robust to any subject content. Parsed by
  # ClientPipeline#parse_commits_tsv (the .jsonl extension is historical).
  git -C "$dir_cwd" log "${author_flags[@]}" $since_flag \
    --format='%H%x09%h%x09%aN%x09%aE%x09%aI%x09%s' \
    > "${git_data_dir}/${encoded}_author_commits.jsonl" 2>/dev/null || true

  # Author-filtered numstat (needed by CommitGrouper for LOC stats)
  _run_with_timeout "$PAXEL_GIT_TIMEOUT" \
    git -C "$dir_cwd" log "${author_flags[@]}" $since_flag \
    --format='COMMIT_BOUNDARY %H %aI %aN <%aE>' --numstat \
    > "${git_data_dir}/${encoded}_author_numstat.txt" 2>/dev/null || true

  # Log what we collected
  local author_count
  author_count=$(wc -l < "${git_data_dir}/${encoded}_author_commits.jsonl" 2>/dev/null | tr -d ' ')
  if [ "${author_count:-0}" -gt 5000 ]; then
    echo "  Warning: ${author_count} author commits collected (large)" >&2
  fi
  if [ "${author_count:-0}" -gt 0 ]; then
    local email_count=${#email_arr[@]}
    local email_label="email"
    [ "$email_count" -ne 1 ] && email_label="emails"
    local email_list
    email_list=$(IFS=', '; echo "${email_arr[*]}")
    echo "  Git: ${author_count} author-filtered commits (${email_count} ${email_label}: ${email_list})" >&2
  fi
}

load_or_request_token() {
  # 1. Check environment variable. Validate against the server so an expired
  #    env var fails pre-Docker instead of 5 minutes into the pipeline.
  #    PAXEL_SKIP_TOKEN_VALIDATION=1 restores the pre-validation behavior for
  #    CI / tests / air-gapped runs where the server is unreachable by design.
  if [ -n "${YC_TOKEN:-}" ]; then
    if validate_token "$YC_TOKEN"; then
      echo "[2/17] Signed in via environment token ✓"
      return
    fi
    echo "" >&2
    # Copy reflects the actual failure mode — "invalid or expired" overpromises
    # diagnostic confidence when the real cause is a 5xx or network blip.
    case "$_PAXEL_LAST_TOKEN_CHECK_CODE" in
      401|403)
        echo "Error: YC_TOKEN env var is invalid or expired." >&2
        echo "  Refresh at: ${PAXEL_SERVER}/auth/login" >&2
        ;;
      000)
        echo "Error: Couldn't reach ${PAXEL_SERVER} to verify YC_TOKEN." >&2
        echo "  Check your network connection and try again." >&2
        ;;
      5[0-9][0-9])
        echo "Error: ${PAXEL_SERVER} couldn't verify YC_TOKEN (server returned ${_PAXEL_LAST_TOKEN_CHECK_CODE})." >&2
        echo "  This is usually temporary — wait a minute and try again." >&2
        ;;
      *)
        echo "Error: YC_TOKEN failed validation (code: ${_PAXEL_LAST_TOKEN_CHECK_CODE})." >&2
        echo "  Refresh at: ${PAXEL_SERVER}/auth/login" >&2
        ;;
    esac
    echo "  Or unset YC_TOKEN to use your saved token / browser auth." >&2
    echo "  CI / air-gapped: set PAXEL_SKIP_TOKEN_VALIDATION=1 to bypass." >&2
    exit 1
  fi

  # 2. Baked token from URL takes priority — it's the freshest, user-specific token.
  #    Validate before trusting: a stale URL (bookmarked `bin/upload` target, expired
  #    session, revoked token) can bake a dead token. On validation failure, fall
  #    through to the saved-token path — do NOT overwrite a valid saved token with
  #    an invalid baked one.
  if [ -n "${PAXEL_BAKED_TOKEN:-}" ]; then
    if validate_token "$PAXEL_BAKED_TOKEN"; then
      local saved_token=""
      [ -f "$PAXEL_TOKEN_FILE" ] && saved_token=$(cat "$PAXEL_TOKEN_FILE" | tr -d '[:space:]')

      if [ "$saved_token" = "$PAXEL_BAKED_TOKEN" ]; then
        # Saved token matches the URL token — use it
        YC_TOKEN="$PAXEL_BAKED_TOKEN"
        echo "[2/17] Signed in ✓"
        return
      elif [ -n "$saved_token" ] && [ "$saved_token" != "$PAXEL_BAKED_TOKEN" ]; then
        # Saved token is for a DIFFERENT account — replace it
        echo "[2/17] Switching to your account..."
        YC_TOKEN="$PAXEL_BAKED_TOKEN"
        save_token
        return
      else
        # No saved token — save the baked one
        YC_TOKEN="$PAXEL_BAKED_TOKEN"
        save_token
        echo "[2/17] Signed in ✓"
        return
      fi
    fi
    # Differentiate revoked-token from server-blip — "Sign-in link expired" is
    # misleading when the real cause is a 5xx or network failure.
    case "$_PAXEL_LAST_TOKEN_CHECK_CODE" in
      401|403)
        echo "[2/17] Sign-in link expired — trying saved token or browser auth..."
        ;;
      000)
        echo "[2/17] Couldn't reach ${PAXEL_SERVER} to verify sign-in link — trying saved token or browser auth..."
        ;;
      5[0-9][0-9])
        echo "[2/17] Sign-in link check failed (server ${_PAXEL_LAST_TOKEN_CHECK_CODE}) — trying saved token or browser auth..."
        ;;
      *)
        echo "[2/17] Sign-in link check failed (code ${_PAXEL_LAST_TOKEN_CHECK_CODE}) — trying saved token or browser auth..."
        ;;
    esac
  fi

  # 3. Check for existing saved token — validate it against the current server
  if [ -f "$PAXEL_TOKEN_FILE" ]; then
    local saved_token
    saved_token=$(cat "$PAXEL_TOKEN_FILE" | tr -d '[:space:]')
    if [ -n "$saved_token" ]; then
      if validate_token "$saved_token"; then
        YC_TOKEN="$saved_token"
        echo "[2/17] Signed in ✓"
        return
      else
        echo "[2/17] Session expired, signing you in again..."
        rm -f "$PAXEL_TOKEN_FILE"
      fi
    fi
  fi

  # 3. Try device auth flow (browser-based), fall back to manual paste
  require_tty
  if ! try_device_auth; then
    manual_token_entry
  fi
}

pull_client_image() {
  # In dev mode (localhost), build from local Dockerfile unless USE_LIVE_DOCKER=1
  if [ -n "$PAXEL_REPO_ROOT" ] && [ -f "$PAXEL_REPO_ROOT/Dockerfile.client" ] && [ "${USE_LIVE_DOCKER:-0}" != "1" ]; then
    if [ "${PAXEL_QUIET_PULL:-0}" = "1" ]; then
      echo "[paxel] Preparing replay container..."
    else
      echo "[3/17] Setting up analysis container..."
      echo "  Cloud: gpt-5.5 (via YC proxy) for summaries and scoring."
      echo "  YC covers all analysis costs — no API keys or subscriptions needed."
      echo "  File bodies stay local; aggregate scores + metadata (paths, commit numstat, session events) upload."
    fi
    echo "  Building from: $PAXEL_REPO_ROOT/Dockerfile.client"
    local build_log
    build_log=$(mktemp)
    if DOCKER_BUILDKIT=1 docker build --build-arg CACHE_BUST="$(date +%s)" -f "$PAXEL_REPO_ROOT/Dockerfile.client" -t paxel-client "$PAXEL_REPO_ROOT" > "$build_log" 2>&1; then
      grep -E '^(#[0-9]+ (DONE|exporting|naming)|Step |Successfully)' "$build_log" || true
      PAXEL_CLIENT_IMAGE="paxel-client"
      echo "  Built: paxel-client (local)"
    else
      echo "Error: Docker build failed." >&2
      tail -20 "$build_log" >&2
      rm -f "$build_log"
      exit 1
    fi
    rm -f "$build_log"
  else
    pull_from_ghcr
  fi
}


# Pull our PUBLIC image without triggering a Docker credential helper / keychain
# prompt. `docker pull` resolves registry creds from ~/.docker/config.json: a
# `credsStore` ("osxkeychain" on macOS, "secretservice"/"pass" on Linux) makes the
# CLI shell out to that helper to look up creds for ghcr.io — popping a keychain
# prompt (or hanging) for anyone who has logged into ghcr.io before. Our image is
# public and needs no auth, so we pull with a THROWAWAY config that (a) drops the
# credsStore and (b) carries an explicit EMPTY `auths` entry for the image's
# registry. Dropping credsStore ALONE is not enough: OrbStack (and potentially
# other runtimes) fall back to the system keychain when a registry has no creds
# info in the config at all, so the prompt still fires. The empty `auths` entry
# tells docker "anonymous creds already exist for this registry," so it uses them
# and never consults any helper. We also carry over the active Docker context so
# the daemon connection is preserved. The real ~/.docker/config.json is never
# touched; portable across macOS and Linux — pure shell, no external JSON parser.
# Returns non-zero on any failure so the caller falls back.
docker_pull_credfree() {
  local src_cfg tmp ctx registry rc=0
  src_cfg="${DOCKER_CONFIG:-$HOME/.docker}"
  # Throwaway scratch for the stripped-down config. mktemp -d is the right tool
  # here: it's 0700, created and removed within this one call, and the OS sweeps
  # it if we're killed mid-pull — so unlike the ~/.paxel/cache/*-$$ dirs this
  # needs no cleanup_temp_dirs / 24h-sweeper wiring. It lives only for one pull.
  tmp=$(mktemp -d) || return 1

  # Registry host the image lives on — the JSON `auths` key docker matches the
  # pull against. It's the first /-segment of the ref, but only when that segment
  # is actually a hostname (has a dot or port colon, or is localhost); a bare
  # `name` or `library/name` ref is on Docker Hub with no host prefix, and dev's
  # local `paxel-client` build never reaches this function. Hostnames are
  # [a-zA-Z0-9.:_-] only, so no JSON escaping needed.
  case "$PAXEL_CLIENT_IMAGE" in
    */*) registry="${PAXEL_CLIENT_IMAGE%%/*}"
         case "$registry" in *.*|*:*|localhost) ;; *) registry="" ;; esac ;;
    *)   registry="" ;;
  esac

  # currentContext + the contexts/ metadata dir are all docker needs to resolve
  # a named context (colima/orbstack/desktop-linux/...) and reach the daemon.
  # Context names are restricted to [a-zA-Z0-9_.+-], so no JSON escaping needed.
  ctx=$(docker context show 2>/dev/null || echo default)
  if [ -n "$registry" ]; then
    printf '{"currentContext":"%s","auths":{"%s":{}}}\n' "$ctx" "$registry" > "$tmp/config.json" || { rm -rf "$tmp"; return 1; }
  else
    printf '{"currentContext":"%s"}\n' "$ctx" > "$tmp/config.json" || { rm -rf "$tmp"; return 1; }
  fi
  cp -R "$src_cfg/contexts" "$tmp/" 2>/dev/null || true

  docker --config "$tmp" pull "$PAXEL_CLIENT_IMAGE" >/dev/null 2>&1 || rc=$?
  rm -rf "$tmp"
  return "$rc"
}


pull_from_ghcr() {
  if [ "${PAXEL_QUIET_PULL:-0}" = "1" ]; then
    echo "[paxel] Preparing replay container..."
  else
    echo "[3/17] Setting up analysis container..."
    echo "  Cloud: gpt-5.5 (via YC proxy) for summaries and scoring."
    echo "  YC covers all analysis costs — no API keys or subscriptions needed."
    echo "  File bodies stay local; aggregate scores + metadata (paths, commit numstat, session events) upload."
    echo "  LLM results are cached locally — reruns skip completed work and pick up where you left off."
    echo ""
  fi
  printf "  Downloading container image..."

  # Prefer a credential-helper-free pull (our image is public, so no auth is
  # needed). If it can't run or fails, fall back to a normal pull with your
  # default Docker config — same daemon and cached layers, so the first attempt
  # isn't wasted. The fallback can surface a credential prompt; it is the safe
  # last resort, not a failure.
  if docker_pull_credfree; then
    printf "\r  Downloaded: %s\n" "$PAXEL_CLIENT_IMAGE"
    return 0
  fi

  printf "\n"
  echo "  Retrying with your default Docker settings..."
  if docker pull "$PAXEL_CLIENT_IMAGE" >/dev/null 2>/dev/null; then
    echo "  Downloaded: $PAXEL_CLIENT_IMAGE"
    return 0
  fi

  echo "  Using cached image (pull failed, may be offline)"
  if ! docker image inspect "$PAXEL_CLIENT_IMAGE" &>/dev/null; then
    echo "Error: Image not found locally either. Check your connection." >&2
    exit 1
  fi
}

# Prepare filtered transcripts and run Docker analysis for a single repo.
# Used by the multi-repo Strategy 3 path.
# Args: repo_root repo_name repo_remote transcript_dirs_str codex_files_str
prepare_and_run_for_repo() {
  local repo_root="$1"
  local repo_name="$2"
  local repo_remote="$3"
  local transcript_dirs_str="$4"
  local codex_files_str="$5"

  # Save state
  local saved_claude_dir="$CLAUDE_DIR"
  local saved_codex_dir="$CODEX_DIR"
  local saved_repo_root="${REPO_ROOT:-}"
  local saved_estimate="${PAXEL_HOST_ESTIMATE_MINUTES:-}"
  local saved_estimated="${ESTIMATED_MINUTES:-}"
  local saved_selected_remote="${selected_remote:-}"

  # Create filtered transcript dir (PID-scoped to avoid races with concurrent runs)
  local filtered_dir="${HOME}/.paxel/cache/filtered-transcripts-$$"
  rm -rf "$filtered_dir"
  mkdir -p "$filtered_dir"

  # Copy matching transcript dirs
  local match_count=0
  local copy_failed=0
  if [ -n "$transcript_dirs_str" ]; then
    IFS='|' read -ra tdirs <<< "$transcript_dirs_str"
    for dir_name in "${tdirs[@]}"; do
      [ -z "$dir_name" ] && continue
      if [ -d "$saved_claude_dir/$dir_name" ]; then
        # _paxel_cp_transcripts: CoW clone where possible, preserving mtime (-p) so
        # the container's --since filter (File.mtime in analyze_local.rake) reflects
        # each session's real age, not the copy's. Guarded: this function runs
        # errexit-suppressed (called as `if prepare_and_run_for_repo`), so a bare cp
        # failure would be swallowed and the repo analyzed on partial data — track
        # it and fail loud below.
        if _paxel_cp_transcripts "$saved_claude_dir/$dir_name" "$filtered_dir/$dir_name"; then
          match_count=$((match_count + 1))
        else
          echo "  Failed to copy Claude transcripts for ${repo_name} (${dir_name})." >&2
          copy_failed=1
        fi
      fi
    done
  fi

  # Create filtered Codex dir (per-repo Codex filtering, Codex fix #2).
  # PID-suffixed so cleanup_temp_dirs EXIT trap + 24h stale sweeper cover it
  # (3-site rule per reference_extract_dir_three_site_cleanup.md).
  local filtered_codex_dir="${HOME}/.paxel/cache/filtered-codex-$$"
  rm -rf "$filtered_codex_dir"
  mkdir -p "$filtered_codex_dir"
  local codex_count=0
  local codex_cross_tool_count=0
  if [ -n "$codex_files_str" ]; then
    IFS='|' read -ra cfiles <<< "$codex_files_str"
    for codex_file in "${cfiles[@]}"; do
      [ -z "$codex_file" ] && continue
      [ -f "$codex_file" ] || continue
      local codex_basename
      codex_basename=$(basename "$codex_file")
      # -p preserves mtime so collect_codex_sessions's --since filter
      # (compares file mtime vs SINCE_EPOCH) reflects the session's actual
      # age, not the copy's recency. Without -p, every file ends up with
      # "now" as its mtime and --since is effectively a no-op.
      if cp -p "$codex_file" "$filtered_codex_dir/$codex_basename"; then
        codex_count=$((codex_count + 1))
        # Phase 3.5 — track cross-tool subset for honest session-count display
        # below (matches picker bucketing: only Claude-launched Codex counts
        # as subagent; standalone Codex counts as a main session).
        local _origin
        _origin=$(get_codex_session_originator "$codex_file")
        codex_originator_is_standalone "$_origin" || codex_cross_tool_count=$((codex_cross_tool_count + 1))
      else
        echo "  Failed to copy Codex session for ${repo_name}." >&2
        copy_failed=1
      fi
    done
  fi

  # Fail loud on a copy failure instead of silently analyzing incomplete data.
  # Nothing global is mutated yet (CLAUDE_DIR et al. are reassigned just below), so
  # a bare return is clean; the EXIT trap reaps the PID-scoped filtered dirs. The
  # caller (run_selected_child_repos) records the non-zero return as a failed repo.
  if [ "$copy_failed" -eq 1 ]; then
    echo "  ✗ ${repo_name}: session copy failed — skipping to avoid an incomplete report." >&2
    return 1
  fi

  CLAUDE_DIR="$filtered_dir"
  CLAUDE_MOUNT_SCOPE="filtered"
  CODEX_MOUNT_SCOPE="filtered"
  MOUNT_LABEL="$repo_name"
  if [ "$codex_count" -gt 0 ]; then
    CODEX_DIR="$filtered_codex_dir"
  else
    CODEX_DIR="${HOME}/.paxel/empty-codex"
    mkdir -p "$CODEX_DIR"
  fi

  # Count sessions. Phase 3.5 — Claude-launched Codex (cross-tool) counts
  # toward subagent_total (the "M" in "N sessions + M subagent"), not the
  # main session_count. session_count drives the time estimate + user-visible
  # "${session_count} sessions" line; subagent_total appears separately so
  # users see honest "N sessions + M subagent" math matching the picker.
  local claude_count
  claude_count=$({ find "$filtered_dir" -name "*.jsonl" -not -name "_*" -not -path "*/_git/*" -not -path "*/subagents/*" -maxdepth 3 2>/dev/null || true; } | wc -l | tr -d ' ')
  local codex_main_count=$((codex_count - codex_cross_tool_count))
  local session_count=$((claude_count + codex_main_count))
  # If no Claude/Codex sessions, fold in opencode/Gemini (same helpers + condition as
  # the picker) so an opencode/Gemini-only repo isn't dropped by the zero-session
  # early-return below; run_docker_analysis extracts them (scoped to repo_remote)
  # regardless. Helpers honor their own filters and return 0 for a local:/non-match.
  if [ "$session_count" -eq 0 ]; then
    local _oc_main _gm_main _vs_main _ag_main
    _oc_main=$(count_opencode_sessions "$repo_remote")
    _gm_main=$(count_gemini_sessions "$repo_remote")
    _vs_main=$(count_vscode_copilot_sessions "$repo_remote")
    _ag_main=$(count_antigravity_sessions "$repo_remote")
    session_count=$((_oc_main + _gm_main + _vs_main + _ag_main))
  fi
  # Project-scoped: scan filtered_dir (matched-to-this-repo only) NOT $CLAUDE_DIR
  # global; otherwise the per-repo display includes cross-project subagents.
  local subagent_count
  subagent_count=$(count_subagent_sessions "$filtered_dir")
  local subagent_total=$((subagent_count + codex_cross_tool_count))

  # Cursor presence floor (C3): a Cursor-only repo (with a remote) has no cheap
  # host count, so don't drop it — run_docker_analysis extracts Cursor scoped to
  # repo_remote (same as the auto-detect remote_has_agent_sessions branch and the
  # picker). The prescan is memoized, so this is a cheap global lookup when the
  # picker already ran it.
  local _repo_cursor_only=0
  if [ "$session_count" -eq 0 ] && [ "$subagent_total" -eq 0 ] \
    && [ -n "$repo_remote" ] && remote_has_cursor_sessions "$repo_remote"; then
    _repo_cursor_only=1
  fi

  if [ "$session_count" -eq 0 ] && [ "$subagent_total" -eq 0 ] && [ "$_repo_cursor_only" -eq 0 ]; then
    echo "  No sessions found for ${repo_name}, skipping."
    # Restore state
    CLAUDE_DIR="$saved_claude_dir"
    CODEX_DIR="$saved_codex_dir"
    REPO_ROOT="$saved_repo_root"
    PAXEL_HOST_ESTIMATE_MINUTES="$saved_estimate"
    ESTIMATED_MINUTES="$saved_estimated"
    return 0
  fi

  # Bound author-commit collection to this repo's session window. run_docker_mode
  # computes OLDEST_SESSION_EPOCH only on the single-repo path, so the picker path
  # left it empty and collect_author_commits ran UNBOUNDED over the uploader's full
  # history (payload bloat + spurious commit-group clusters). Compute a
  # function-local floor from the copied sessions' mtimes — the CoW transcript copy
  # (-p) and cp -p preserve them — like run_docker_mode's source-mtime scan (this one also covers Codex
  # sessions, which the single-repo scan does not). Trailing `|| true` swallows
  # head's SIGPIPE under set -o pipefail (same as run_docker_mode's computation).
  local oldest_epoch=""
  oldest_epoch=$(find "$filtered_dir" "$filtered_codex_dir" -name "*.jsonl" -not -name "_*" -maxdepth 3 2>/dev/null \
    | while read -r _f; do stat -c '%Y' "$_f" 2>/dev/null || stat -f '%m' "$_f" 2>/dev/null; done \
    | sort -n | head -1 || true)
  # When --since is active the host hasn't filtered the copied sessions yet (the
  # container applies SINCE_EPOCH via File.mtime), so the raw min-mtime floor can
  # predate the requested window. Clamp UP to SINCE_EPOCH so the author-commit
  # window matches the analyzed-session window, not the absolute-oldest session.
  if [ -n "$SINCE_EPOCH" ]; then
    if [ -z "$oldest_epoch" ] || [ "$oldest_epoch" -lt "$SINCE_EPOCH" ]; then
      oldest_epoch="$SINCE_EPOCH"
    fi
  fi

  # Collect git metadata
  local git_data_dir="${filtered_dir}/_git"
  mkdir -p "$git_data_dir"
  local docker_metadata="{}"

  for dir in "$filtered_dir"/*/; do
    [ -d "$dir" ] || continue
    local dir_name
    dir_name=$(basename "$dir")
    [ "$dir_name" = "_git" ] && continue
    local dir_cwd
    dir_cwd=$(get_project_cwd "$dir_name")
    local dir_remote
    dir_remote=$(get_git_remote "$dir_cwd")
    if [ -z "$dir_remote" ] && [ -n "$dir_cwd" ] && [ ! -e "$dir_cwd" ]; then
      dir_remote=$(resolve_remote_for_dead_cwd "$dir_cwd")
    fi

    if [ -n "$dir_remote" ] || [ -n "$dir_cwd" ]; then
      docker_metadata=$(echo "$docker_metadata" | jq \
        --arg dir "$dir_name" \
        --arg remote "$dir_remote" \
        --arg cwd "$dir_cwd" \
        '. + {($dir): {"git_remote": $remote, "cwd": $cwd}}' 2>/dev/null || echo "$docker_metadata")
    fi

    if [ -n "$dir_cwd" ] && [ -e "$dir_cwd/.git" ]; then
      local encoded
      encoded=$(echo "$dir_name" | sed 's/[^a-zA-Z0-9_-]/_/g')
      local since_flag=""
      [ -n "$SINCE_EPOCH" ] && since_flag="--since=$(date -r "$SINCE_EPOCH" '+%Y-%m-%d' 2>/dev/null || date -d "@$SINCE_EPOCH" '+%Y-%m-%d' 2>/dev/null || echo '')"

      # Total commit count (cheap, no data) for the Git Metrics "N of M commits"
      # context — parity with the single-repo block.
      git -C "$dir_cwd" rev-list --count HEAD \
        > "${git_data_dir}/${encoded}_commit_count.txt" 2>/dev/null || true

      # -${COMMIT_LIMIT:-1000} honors --commits and matches the single-repo default
      # (was hardcoded -500). TSV (subject LAST) — robust to quotes/backslashes (C13).
      git -C "$dir_cwd" log -${COMMIT_LIMIT:-1000} $since_flag \
        --format='%H%x09%h%x09%aN%x09%aE%x09%aI%x09%s' \
        > "${git_data_dir}/${encoded}_commits.jsonl" 2>/dev/null || true

      _run_with_timeout "$PAXEL_GIT_TIMEOUT" \
        git -C "$dir_cwd" log -${COMMIT_LIMIT:-1000} $since_flag \
        --format='COMMIT_BOUNDARY %H %aI %aN <%aE>' --numstat \
        > "${git_data_dir}/${encoded}_numstat.txt" 2>/dev/null || true

      # Author-filtered commits for episode linking, bounded to this repo's session
      # window (oldest_epoch, computed above) so we don't pull the uploader's entire
      # git history into the upload.
      local author_emails
      author_emails=$(detect_author_emails "$dir_cwd" "$filtered_dir")
      if [ -n "$author_emails" ]; then
        local oldest_date=""
        if [ -n "$oldest_epoch" ]; then
          oldest_date=$(date -r "$oldest_epoch" '+%Y-%m-%d' 2>/dev/null || date -d "@$oldest_epoch" '+%Y-%m-%d' 2>/dev/null || echo '')
        fi
        collect_author_commits "$dir_cwd" "$git_data_dir" "$encoded" "$author_emails" "$oldest_date"
      fi
    fi
  done

  # Write _metadata.json
  local _rmdc_total
  _rmdc_total=$(_rmdc_recovery_count_unique)
  if command -v jq &>/dev/null; then
    jq -n --argjson dirs "$docker_metadata" \
      --argjson recoveries "${_rmdc_total:-0}" \
      '{"version": 1, "directories": $dirs, "orphan_recovery_count": $recoveries}' \
      > "${filtered_dir}/_metadata.json" \
      || echo "  Warning: could not write attribution metadata for ${repo_name}; the container will fall back to name-based attribution." >&2
  fi

  # Set repo root for code quality
  if [ -d "$repo_root" ]; then
    export REPO_ROOT="$repo_root"
  else
    unset REPO_ROOT 2>/dev/null || true
  fi

  # Set selected_remote so Cursor extraction filters by this repo's remote.
  selected_remote="$repo_remote"
  # A remote-less child carries a "local:/abs/path" grouping key (detect_child_repos),
  # NOT a real git remote. The non-Claude collectors filter by normalize_remote,
  # and "local:…" normalizes to itself and matches no session — so leaving it set
  # makes Codex/Cursor/opencode/Gemini silently drop every session AND run wasted
  # work. Blank it so run_docker_analysis's "skipped (no resolved remote)" guards
  # fire instead — honest, and matching the single-repo path (which sets an empty
  # selected_remote for a no-origin repo). Full path-based scoping for remote-less
  # repos is a follow-up.
  case "$selected_remote" in
    local:*|"") selected_remote="" ;;
  esac

  # Estimate and pass to Docker. Match print_estimate's `sessions + subagent_count`
  # math (line 352): AnalyzeSessionJob runs every logical-root + subagent + cross-tool
  # session, so the wall-clock estimate must include the same set the user sees in
  # "${session_count} sessions + ${subagent_total} subagent" below.
  local mins
  mins=$(estimate_time $((session_count + subagent_total)))
  ESTIMATED_MINUTES="$mins"
  export PAXEL_HOST_ESTIMATE_MINUTES="$mins"
  if [ "$subagent_total" -gt 0 ]; then
    echo "  ${session_count} sessions + ${subagent_total} subagent, ~${mins} min"
  elif [ "$_repo_cursor_only" -eq 1 ] && [ "$session_count" -eq 0 ]; then
    echo "  Cursor sessions (counted inside the container), ~${mins} min"
  else
    echo "  ${session_count} sessions, ~${mins} min"
  fi

  # Run Docker
  run_docker_analysis
  local result=$?

  # Restore state
  CLAUDE_DIR="$saved_claude_dir"
  CODEX_DIR="$saved_codex_dir"
  if [ -n "$saved_repo_root" ]; then
    REPO_ROOT="$saved_repo_root"
  else
    unset REPO_ROOT 2>/dev/null || true
  fi
  PAXEL_HOST_ESTIMATE_MINUTES="$saved_estimate"
  ESTIMATED_MINUTES="$saved_estimated"
  selected_remote="$saved_selected_remote"

  return $result
}

# Does any non-Claude tool (Codex, Cursor, opencode, Gemini, VS Code Copilot) have a session for $remote?
# Lets single-project auto-detect scope a repo the user worked in WITHOUT Claude
# Code, instead of falling through to the "none of your sessions match" prompt.
# Reuses the real collectors against a throwaway probe dir (so per-remote
# matching has ONE source of truth), and only runs on the uncommon path where
# Claude produced no match. Recovery logging is redirected to a throwaway so the
# probe can't inflate orphan_recovery_count for the real run.
# Cursor presence floor (C3). Cursor has no cheap per-repo count — its workspace
# lives in a JSON `value` blob that is often absent, so a correct count needs a
# per-session filesystem walk (the documented extract hang). Instead we extract
# ALL Cursor sessions ONCE into a throwaway probe, harvest each session's recovered
# git_remote, normalize, and cache the set in a global. detect_child_repos /
# prepare_and_run_for_repo then do a cheap set-membership check so a Cursor-only
# repo (with a remote) is no longer dropped by the zero-session guards, without
# re-extracting per repo. Memoized: runs at most once per upload, and only when a
# repo actually came up empty on the cheaply-counted tools (Claude/Codex/opencode/
# Gemini). No-remote Cursor repos stay dropped (a separate, deferred follow-up).
_PAXEL_CURSOR_REMOTES=""
_PAXEL_CURSOR_PRESCAN_DONE=0
maybe_prescan_cursor_remotes() {
  [ "$_PAXEL_CURSOR_PRESCAN_DONE" -eq 1 ] && return 0
  _PAXEL_CURSOR_PRESCAN_DONE=1
  # jq gates BOTH Cursor sources; sqlite3 gates only the legacy DBs and is
  # handled inside collect_cursor_sessions — a jq-only host (Windows Git
  # Bash) still reads the ~/.cursor/projects transcripts, so the presence
  # floor must see those repos too.
  command -v jq >/dev/null 2>&1 || return 0
  [ -d "${CURSOR_DIR:-}" ] || [ -f "${CURSOR_GLOBAL_DB:-}" ] || [ -d "${CURSOR_PROJECTS_DIR:-}" ] || return 0
  echo "  Scanning Cursor sessions..." >&2
  local probe
  probe=$(mktemp -d 2>/dev/null) || return 0
  local _saved_rmdc="${_RMDC_LOG_FILE:-}"
  _RMDC_LOG_FILE="$probe/.rmdc"
  collect_cursor_sessions "$probe" "" >/dev/null 2>&1 || true
  _RMDC_LOG_FILE="$_saved_rmdc"
  local set="|" f r rn
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    r=$(head -1 "$f" | jq -r '._cursor_meta.git_remote // empty' 2>/dev/null || true)
    [ -z "$r" ] && continue
    rn=$(normalize_remote "$r")
    [ -z "$rn" ] && continue
    case "$set" in *"|${rn}|"*) ;; *) set="${set}${rn}|" ;; esac
  done < <(find "$probe" -path '*/_cursor_*/*.jsonl' 2>/dev/null)
  rm -rf "$probe"
  _PAXEL_CURSOR_REMOTES="$set"
}

# True if `remote` has any Cursor session (per the one-time prescan above). Must be
# called as a condition, NOT in $(...): it triggers the prescan, which sets a global
# that a subshell would discard.
remote_has_cursor_sessions() {
  local remote="$1"
  [ -z "$remote" ] && return 1
  maybe_prescan_cursor_remotes
  local rn
  rn=$(normalize_remote "$remote")
  [ -z "$rn" ] && return 1
  case "$_PAXEL_CURSOR_REMOTES" in *"|${rn}|"*) return 0 ;; *) return 1 ;; esac
}

remote_has_agent_sessions() {
  local remote="$1"
  [ -z "$remote" ] && return 1
  local probe
  probe=$(mktemp -d 2>/dev/null) || return 1

  local _saved_rmdc="${_RMDC_LOG_FILE:-}"
  _RMDC_LOG_FILE="$probe/.rmdc"

  local rc=1
  # Gemini probe FIRST — its extraction needs no jq (sed/cp), so a repo with only
  # Gemini sessions can still be scoped on a host without jq.
  collect_gemini_sessions "$probe" "$remote" >/dev/null 2>&1 || true
  [ -n "$(find "$probe" -path '*/_gemini_*/*.jsonl' -print -quit 2>/dev/null)" ] && rc=0

  # Codex/Cursor/opencode/VS Code Copilot probes require jq; only run them if we
  # haven't matched.
  if [ "$rc" -ne 0 ] && command -v jq >/dev/null 2>&1; then
    collect_codex_sessions "$probe" "$remote" >/dev/null 2>&1 || true
    collect_cursor_sessions "$probe" "$remote" >/dev/null 2>&1 || true
    collect_opencode_sessions "$probe" "$remote" >/dev/null 2>&1 || true
    collect_vscode_copilot_sessions "$probe" "$remote" >/dev/null 2>&1 || true
    if [ -n "$(find "$probe" -path '*/_codex_*/*.jsonl' -print -quit 2>/dev/null)" ] \
      || [ -n "$(find "$probe" -path '*/_cursor_*/*.jsonl' -print -quit 2>/dev/null)" ] \
      || [ -n "$(find "$probe" -path '*/_opencode_*/*.jsonl' -print -quit 2>/dev/null)" ] \
      || [ -n "$(find "$probe" -path '*/_vscode_*/*.jsonl' -print -quit 2>/dev/null)" ]; then
      rc=0
    fi
  fi

  # Antigravity probe — no tool gate: attribution prefers sqlite3 but falls back
  # to the transcript-parsed workspace, so the probe works either way.
  if [ "$rc" -ne 0 ]; then
    collect_antigravity_sessions "$probe" "$remote" >/dev/null 2>&1 || true
    [ -n "$(find "$probe" -path '*/_antigravity_*/*.jsonl' -print -quit 2>/dev/null)" ] && rc=0
  fi

  _RMDC_LOG_FILE="$_saved_rmdc"
  rm -rf "$probe"
  return $rc
}

run_docker_analysis() {
  if [ "$MULTI_REPO_RUNNING" -eq 0 ]; then
    echo "Analyzing your coding sessions — this is the slow part (steps 4-17 below):"
  fi

  # When PAXEL_SERVER points to localhost, the container can't reach the host's
  # localhost directly. Rewrite to host.docker.internal (works on macOS/Windows
  # Docker Desktop and Linux with --add-host).
  local docker_server="$PAXEL_SERVER"
  # Mount logs directory for persistent output on the host
  local log_dir="${HOME}/.paxel/logs"
  # Mirror the label analyze_local.rake uses for the log filename — PAXEL_LOG_LABEL
  # (i.e. MOUNT_LABEL when set), else PROJECT_NAME, else "all" — with the SAME
  # sanitize, so the "Log: …" messages below point at the file actually written.
  # Without this the glob mismatches for --project runs (MOUNT_LABEL unset → file is
  # <project>-*.log, not all-*.log) and for labels with spaces/special chars.
  local _log_label
  _log_label=$(printf '%s' "${MOUNT_LABEL:-${PROJECT_NAME:-all}}" | tr -c 'A-Za-z0-9._-' '_')
  mkdir -p "$log_dir"

  # Pending-upload stash dir (resumable uploads). Stays a host bind mount so the
  # stash payload keeps its disclosed 0600-in-0700 posture in the user's home.
  local data_dir="${HOME}/.paxel/data"
  mkdir -p "$data_dir"
  # Honor the disclosed 0700 on ~/.paxel/data (and the logs dir) even if a
  # pre-change run created them 0755. The 0700 data dir is what shields the
  # pending-upload stash from other host users.
  chmod 700 "$log_dir" "$data_dir" 2>/dev/null || true

  # Persistent LLM result cache lives in a dedicated Docker NAMED VOLUME, not a
  # host bind mount. The container runs non-root (uid 1000); a host-owned 0700
  # bind mount is unwritable when the host uid != 1000 (native Linux / CI /
  # cloud) — that silently disabled the cache and caused full re-spend every run
  # (no cross-run reuse → large histories burn the daily cost cap with zero
  # output). A fresh named volume inherits the image dir's uid-1000 ownership
  # (Dockerfile.client chowns /rails/cache), so the container can always write
  # it. Per-host-user by default (isolation); override with PAXEL_CACHE_VOLUME.
  local cache_volume
  cache_volume="${PAXEL_CACHE_VOLUME:-paxel-cache-$(id -u)}"

  # --clean flag: drop cached LLM results to force fresh analysis. The cache has
  # its own volume (nothing else lives there), so removing the whole volume is
  # safe; guarded so a "volume in use" / missing-volume case can't trip the
  # global ERR trap. Next run re-creates it fresh (correctly uid-1000-owned).
  # Also clears any orphaned legacy cache file from the old ~/.paxel/data path.
  if [ "${CLEAN:-0}" = "1" ]; then
    docker volume rm "$cache_volume" >/dev/null 2>&1 || true
    rm -f "${data_dir}/llm_cache.sqlite3" "${data_dir}/llm_cache.sqlite3-wal" "${data_dir}/llm_cache.sqlite3-shm" 2>/dev/null || true
    echo "  Cleaned cached analysis data"
  fi

  local docker_args=(--rm -v "${log_dir}:/logs" -v "${data_dir}:/rails/data" -v "${cache_volume}:/rails/cache")

  # Mount Claude Code transcripts
  if [ -d "$CLAUDE_DIR" ]; then
    docker_args+=(-v "${CLAUDE_DIR}:/transcripts:ro")
    local cc_count
    cc_count=$(count_sessions "$CLAUDE_DIR")
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
      echo "  Claude Code: ${cc_count} sessions (matched to ${MOUNT_LABEL})"
    else
      echo "  Claude Code: ${cc_count} sessions"
    fi
  else
    # Create empty mount point so container doesn't fail
    docker_args+=(-v "${HOME}/.paxel/empty:/transcripts:ro")
    mkdir -p "${HOME}/.paxel/empty"
  fi

  # Extract Codex sessions on host, mount extracted dir at /codex_sessions:ro.
  # Mirrors the Cursor pattern below: host walks $CODEX_DIR, buckets per-session
  # remote into _codex_<slug>_<hash>/ (or _codex_unattributed/ for sessions
  # without a repository_url), writes a _metadata.json sidecar, and mounts the
  # result. The container's analyze_local.rake merges /codex_sessions into
  # transcript_dir so TranscriptDiscoverer creates a Codex Project per remote.
  #
  # Historical note: PR #604 removed a prior $CODEX_DIR bind-mount because
  # analyze_local.rake had no merge logic — Codex sessions were silently dropped
  # in Docker mode from 2026-02 to 2026-04. Restored here with the missing
  # container-side consumer (see analyze_local.rake:~134).
  if [ -d "$CODEX_DIR" ]; then
    # Scope guard: in filtered (single-project) Docker mode, refuse to
    # extract Codex if we couldn't resolve the project's git_remote.
    # collect_codex_sessions treats an empty selected_remote as --all,
    # so without this guard an auto-detected single-project upload for a
    # repo with no origin would pull in every Codex session across every
    # repo on the machine, widening scope far beyond what the user asked
    # for. In --all mode (CLAUDE_MOUNT_SCOPE=all or unset), empty
    # selected_remote is correct — we want every session.
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && [ -z "${selected_remote:-}" ] && [ -z "${scope_cwd:-}" ]; then
      echo "  Codex CLI: skipped (single-project scope but no resolved remote)"
    else
      local codex_extract_dir="${HOME}/.paxel/cache/codex_extracted-$$"
      rm -rf "$codex_extract_dir"
      mkdir -p "$codex_extract_dir"
      local codex_log="${HOME}/.paxel/logs/codex-extract.log"
      mkdir -p "$(dirname "$codex_log")"
      # scope_cwd (C6): when the run dir resolved no remote (home/parent-dir
      # auto-detect), collect Codex sessions under that dir instead of skipping.
      if ! collect_codex_sessions "$codex_extract_dir" "${selected_remote:-}" "${scope_cwd:-}" 2>"$codex_log"; then
        echo "  Warning: Codex session extraction had errors. Continuing with other sessions."
        [ -s "$codex_log" ] && echo "  Details: $codex_log"
      fi
      local codex_jsonl_count
      codex_jsonl_count=$(find "$codex_extract_dir" -maxdepth 2 -path "*/_codex_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$codex_jsonl_count" -gt 0 ]; then
        docker_args+=(-v "${codex_extract_dir}:/codex_sessions:ro")
        # Phase 3.5 — split by originator so the prelude matches the picker
        # bucketing the user just saw. Standalone (user-launched Codex) =
        # "Codex CLI"; Claude-launched = "Codex launched by Claude".
        local codex_standalone_count=0
        local codex_cross_tool_count=0
        local _cef
        while IFS= read -r _cef; do
          [ -z "$_cef" ] && continue
          local _ceo
          _ceo=$(get_codex_session_originator "$_cef")
          if codex_originator_is_standalone "$_ceo"; then
            codex_standalone_count=$((codex_standalone_count + 1))
          else
            codex_cross_tool_count=$((codex_cross_tool_count + 1))
          fi
        done < <(find "$codex_extract_dir" -maxdepth 2 -path "*/_codex_*/*.jsonl" 2>/dev/null)

        local match_suffix=""
        [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && match_suffix=" (matched to ${MOUNT_LABEL})"
        if [ "$codex_standalone_count" -gt 0 ]; then
          echo "  Codex CLI: ${codex_standalone_count} sessions${match_suffix}"
        fi
        if [ "$codex_cross_tool_count" -gt 0 ]; then
          echo "  Codex launched by Claude: ${codex_cross_tool_count} sessions${match_suffix}"
        fi
      fi
    fi
  fi

  # Loud hint when Cursor data exists but the host lacks the tools to read it —
  # the next `if` requires jq and otherwise skips Cursor with NO output (common
  # on Windows Git Bash, which bundles neither jq nor sqlite3; the container has
  # no sqlite3 CLI either). jq gates both Cursor sources; sqlite3 gates only the
  # legacy state.vscdb path (~/.cursor/projects transcripts are plain JSONL).
  if { [ -d "$CURSOR_DIR" ] || [ -f "$CURSOR_GLOBAL_DB" ] || [ -d "${CURSOR_PROJECTS_DIR:-}" ]; } \
     && ! command -v jq >/dev/null 2>&1; then
    echo "  Cursor IDE: found data but can't read it — install jq (and sqlite3 for older Cursor versions) and re-run" >&2
    echo "    (brew install sqlite3 jq · sudo apt install sqlite3 jq · winget install sqlite.sqlite jqlang.jq)" >&2
  elif { [ -d "$CURSOR_DIR" ] || [ -f "$CURSOR_GLOBAL_DB" ]; } \
     && ! command -v sqlite3 >/dev/null 2>&1; then
    if [ -d "${CURSOR_PROJECTS_DIR:-}" ]; then
      echo "  Cursor IDE: sqlite3 not found — reading only ~/.cursor/projects transcripts. Install sqlite3 for the full history" >&2
    else
      echo "  Cursor IDE: found data but can't read it — install sqlite3 and re-run" >&2
    fi
    echo "    (brew install sqlite3 · sudo apt install sqlite3 · winget install sqlite.sqlite)" >&2
  fi

  # Extract Cursor IDE sessions on host (SQLite + agent-transcripts JSONL →
  # canonical JSONL), mount extracted dir
  if { [ -d "$CURSOR_DIR" ] || [ -f "$CURSOR_GLOBAL_DB" ] || [ -d "${CURSOR_PROJECTS_DIR:-}" ]; } && command -v jq &>/dev/null; then
    # collect_cursor_sessions treats an empty selected_remote as --all, so without
    # this guard an auto-detected single-project upload for a repo with no resolved
    # remote would pull in every Cursor session on the machine. In --all mode
    # (CLAUDE_MOUNT_SCOPE=all/unset) empty is correct. Mirrors the Codex/opencode/
    # Gemini blocks (Cursor was the only collector missing this guard).
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && [ -z "${selected_remote:-}" ]; then
      echo "  Cursor IDE: skipped (single-project scope but no resolved remote)"
    else
      local cursor_extract_dir="${HOME}/.paxel/cache/cursor_extracted-$$"
      rm -rf "$cursor_extract_dir"
      mkdir -p "$cursor_extract_dir"
      echo "  Extracting Cursor IDE sessions..."
      local cursor_log="${HOME}/.paxel/logs/cursor-extract.log"
      mkdir -p "$(dirname "$cursor_log")"
      if ! collect_cursor_sessions "$cursor_extract_dir" "${selected_remote:-}" 2>"$cursor_log"; then
        echo "  Warning: Cursor session extraction had errors. Continuing with other sessions."
        [ -s "$cursor_log" ] && echo "  Details: $cursor_log"
      fi
      local cursor_jsonl_count
      cursor_jsonl_count=$(find "$cursor_extract_dir" -maxdepth 2 -path "*/_cursor_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$cursor_jsonl_count" -gt 0 ]; then
        docker_args+=(-v "${cursor_extract_dir}:/cursor_sessions:ro")
        if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
          echo "  Cursor IDE: ${cursor_jsonl_count} sessions (matched to ${MOUNT_LABEL})"
        else
          echo "  Cursor IDE: ${cursor_jsonl_count} sessions"
        fi
      fi
      # $filtered_dir is dynamic-scoped from prepare_and_run_for_repo / run_docker_mode
      # (the two functions that wrote the archive sidecar with orphan_recovery_count).
      # Cursor extraction above may have triggered resolver calls; update the counter
      # before the container reads the sidecar.
      _refresh_orphan_recovery_count "${filtered_dir:-}/_metadata.json"
    fi
  fi

  # Extract opencode sessions on host (SQLite → opencode-native JSONL), mount
  # extracted dir at /opencode_sessions. Mirrors the Cursor block above; the
  # container's analyze_local merge folds _opencode_* buckets into transcript_dir.
  if { [ -d "$OPENCODE_DIR" ] || { [ -n "${OPENCODE_DB:-}" ] && [ -f "${OPENCODE_DB:-}" ]; }; } && command -v sqlite3 &>/dev/null && command -v jq &>/dev/null; then
    # collect_opencode_sessions treats an empty selected_remote as --all, so
    # without this guard an auto-detected single-project upload for a repo with
    # no resolved remote would pull in every opencode session on the machine.
    # In --all mode (CLAUDE_MOUNT_SCOPE=all/unset) empty is correct. Mirrors the
    # Codex block above.
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && [ -z "${selected_remote:-}" ]; then
      echo "  opencode: skipped (single-project scope but no resolved remote)"
    else
      local opencode_extract_dir="${HOME}/.paxel/cache/opencode_extracted-$$"
      rm -rf "$opencode_extract_dir"
      mkdir -p "$opencode_extract_dir"
      echo "  Extracting opencode sessions..."
      local opencode_log="${HOME}/.paxel/logs/opencode-extract.log"
      mkdir -p "$(dirname "$opencode_log")"
      if ! collect_opencode_sessions "$opencode_extract_dir" "${selected_remote:-}" 2>"$opencode_log"; then
        echo "  Warning: opencode session extraction had errors. Continuing with other sessions."
        [ -s "$opencode_log" ] && echo "  Details: $opencode_log"
      fi
      local opencode_jsonl_count
      opencode_jsonl_count=$(find "$opencode_extract_dir" -maxdepth 2 -path "*/_opencode_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$opencode_jsonl_count" -gt 0 ]; then
        docker_args+=(-v "${opencode_extract_dir}:/opencode_sessions:ro")
        if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
          echo "  opencode: ${opencode_jsonl_count} sessions (matched to ${MOUNT_LABEL})"
        else
          echo "  opencode: ${opencode_jsonl_count} sessions"
        fi
      fi
      _refresh_orphan_recovery_count "${filtered_dir:-}/_metadata.json"
    fi
  fi

  # Extract Gemini CLI sessions on host (raw JSONL copy + subagent relayout), mount
  # at /gemini_sessions. Unlike the SQLite tools above, gemini sessions are plain
  # JSONL — extraction needs neither sqlite3 nor jq (jq only enriches the sidecar),
  # so the gate is just the dir existing.
  if [ -d "$GEMINI_DIR" ]; then
    # collect_gemini_sessions treats an empty selected_remote as --all; guard the
    # single-project-no-remote case so we don't pull every gemini session (mirrors
    # the Codex/opencode blocks).
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && [ -z "${selected_remote:-}" ]; then
      echo "  Gemini CLI: skipped (single-project scope but no resolved remote)"
    else
      local gemini_extract_dir="${HOME}/.paxel/cache/gemini_extracted-$$"
      rm -rf "$gemini_extract_dir"
      mkdir -p "$gemini_extract_dir"
      echo "  Extracting Gemini CLI sessions..."
      local gemini_log="${HOME}/.paxel/logs/gemini-extract.log"
      mkdir -p "$(dirname "$gemini_log")"
      if ! collect_gemini_sessions "$gemini_extract_dir" "${selected_remote:-}" 2>"$gemini_log"; then
        echo "  Warning: Gemini session extraction had errors. Continuing with other sessions."
        [ -s "$gemini_log" ] && echo "  Details: $gemini_log"
      fi
      local gemini_jsonl_count
      gemini_jsonl_count=$(find "$gemini_extract_dir" -maxdepth 2 -path "*/_gemini_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$gemini_jsonl_count" -gt 0 ]; then
        docker_args+=(-v "${gemini_extract_dir}:/gemini_sessions:ro")
        if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
          echo "  Gemini CLI: ${gemini_jsonl_count} sessions (matched to ${MOUNT_LABEL})"
        else
          echo "  Gemini CLI: ${gemini_jsonl_count} sessions"
        fi
      fi
      _refresh_orphan_recovery_count "${filtered_dir:-}/_metadata.json"
    fi
  fi

  # Extract VS Code Copilot sessions on host (big-JSON -> slimmed JSONL via jq),
  # mount at /vscode_sessions. jq is REQUIRED (like Cursor); the per-session raw
  # JSON can reach ~100 MB, so slimming on the host bounds archive + parse memory.
  # VSCODE_DIR is a newline list of workspaceStorage base dirs; gate on jq + at
  # least one base dir existing.
  local _vscode_any_base=0
  if command -v jq &>/dev/null; then
    local _vb
    while IFS= read -r _vb; do
      [ -z "$_vb" ] && continue
      if [ -d "$_vb" ]; then _vscode_any_base=1; break; fi
    done <<< "$VSCODE_DIR"
  fi
  if [ "$_vscode_any_base" -eq 1 ]; then
    # collect_vscode_copilot_sessions treats an empty selected_remote as --all;
    # guard the single-project-no-remote case so we don't pull every Copilot
    # session (mirrors the Codex/opencode/Gemini blocks).
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && [ -z "${selected_remote:-}" ]; then
      echo "  VS Code Copilot: skipped (single-project scope but no resolved remote)"
    else
      local vscode_extract_dir="${HOME}/.paxel/cache/vscode_extracted-$$"
      rm -rf "$vscode_extract_dir"
      mkdir -p "$vscode_extract_dir"
      echo "  Extracting VS Code Copilot sessions..."
      local vscode_log="${HOME}/.paxel/logs/vscode-extract.log"
      mkdir -p "$(dirname "$vscode_log")"
      if ! collect_vscode_copilot_sessions "$vscode_extract_dir" "${selected_remote:-}" 2>"$vscode_log"; then
        echo "  Warning: VS Code Copilot session extraction had errors. Continuing with other sessions."
        [ -s "$vscode_log" ] && echo "  Details: $vscode_log"
      fi
      local vscode_jsonl_count
      vscode_jsonl_count=$(find "$vscode_extract_dir" -maxdepth 2 -path "*/_vscode_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$vscode_jsonl_count" -gt 0 ]; then
        docker_args+=(-v "${vscode_extract_dir}:/vscode_sessions:ro")
        if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
          echo "  VS Code Copilot: ${vscode_jsonl_count} sessions (matched to ${MOUNT_LABEL})"
        else
          echo "  VS Code Copilot: ${vscode_jsonl_count} sessions"
        fi
      fi
      _refresh_orphan_recovery_count "${filtered_dir:-}/_metadata.json"
    fi
  fi

  # Extract Antigravity sessions on host (raw transcript copy + synthetic meta line),
  # mount at /antigravity_sessions. Attribution reads the sibling conversations/<uuid>.db
  # via sqlite3; without it sessions still copy (unattributed). Gate on the dir existing.
  if [ -d "$ANTIGRAVITY_DIR" ]; then
    if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ] && [ -z "${selected_remote:-}" ]; then
      echo "  Antigravity: skipped (single-project scope but no resolved remote)"
    else
      local antigravity_extract_dir="${HOME}/.paxel/cache/antigravity_extracted-$$"
      rm -rf "$antigravity_extract_dir"
      mkdir -p "$antigravity_extract_dir"
      echo "  Extracting Antigravity sessions..."
      local antigravity_log="${HOME}/.paxel/logs/antigravity-extract.log"
      mkdir -p "$(dirname "$antigravity_log")"
      if ! collect_antigravity_sessions "$antigravity_extract_dir" "${selected_remote:-}" 2>"$antigravity_log"; then
        echo "  Warning: Antigravity session extraction had errors. Continuing with other sessions."
        [ -s "$antigravity_log" ] && echo "  Details: $antigravity_log"
      fi
      local antigravity_jsonl_count
      antigravity_jsonl_count=$(find "$antigravity_extract_dir" -maxdepth 2 -path "*/_antigravity_*/*.jsonl" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$antigravity_jsonl_count" -gt 0 ]; then
        docker_args+=(-v "${antigravity_extract_dir}:/antigravity_sessions:ro")
        if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
          echo "  Antigravity: ${antigravity_jsonl_count} sessions (matched to ${MOUNT_LABEL})"
        else
          echo "  Antigravity: ${antigravity_jsonl_count} sessions"
        fi
      fi
      _refresh_orphan_recovery_count "${filtered_dir:-}/_metadata.json"
    fi
  fi

  # Docker --all host-side recovery detection. Populates _RMDC_LOG_FILE
  # so the env-var passthrough below forwards non-zero project_cache /
  # unresolvable / ancestor / worktree_list / jj_workspace_list counts
  # to the container.
  #
  # ORDERING IS LOAD-BEARING: this scan MUST run before the
  # _rmdc_recovery_count_unique / _recovery_source_breakdown reads
  # below, or the env vars ship empty. Pinned by CJ10f bats test.
  if [ "${ALL_PROJECTS:-0}" -eq 1 ]; then
    _docker_all_host_scan_for_recovery "$CLAUDE_DIR"
  fi

  # Extract per-repo git history for --all so the container can sum it into one
  # combined git_metrics (collect_git_data_aggregate). --no-repo opts out, the
  # same way it suppresses the single-repo mount below.
  if [ "${ALL_PROJECTS:-0}" -eq 1 ] && [ "${NO_REPO:-0}" != "1" ]; then
    _docker_all_extract_git_data "$CLAUDE_DIR"
  fi

  # Pass orphan_recovery_count + recovery_breakdown as Docker env vars.
  # ClientPipeline's readers fall back to these env vars when the archive
  # sidecar lacks the fields. Host-side activity only — in-container
  # recoveries flow through the container's own path.
  #
  # The scan above also self-warms ~/.paxel/cache/project-remotes-v2.tsv
  # (via _project_cache_persist_rows) so future runs can recover a
  # deleted Conductor workspace that was live during this run.
  # Symmetric with legacy --all's behavior in collect_all_projects:3376.
  if [ -n "${_RMDC_LOG_FILE:-}" ]; then
    local _rmdc_for_env
    _rmdc_for_env=$(_rmdc_recovery_count_unique)
    docker_args+=(-e "PAXEL_ORPHAN_RECOVERY_COUNT=${_rmdc_for_env:-0}")
    local _rbrk_for_env
    _rbrk_for_env=$(_recovery_source_breakdown)
    docker_args+=(-e "PAXEL_RECOVERY_BREAKDOWN=${_rbrk_for_env}")
  fi

  # Bind-mount the host-written sidecar read-only into the container so
  # TranscriptDiscoverer.read_sidecar can resolve Claude workspace
  # git_remotes for Conductor dead-cwds (host-scan cache hits). Docker
  # --all bind-mounts $CLAUDE_DIR read-only at /transcripts, so there's
  # no archive sidecar to carry these; this secondary mount closes the
  # attribution gap end-to-end. Gated on ALL_PROJECTS=1 and existence of
  # the host-written file (jq-less hosts skip the write, and we skip the
  # mount here too — the container falls back to encoded_name, same as
  # the pre-sidecar baseline).
  if [ "${ALL_PROJECTS:-0}" -eq 1 ]; then
    local _dall_sidecar
    _dall_sidecar="$(_docker_all_sidecar_dir)"
    # OR _git/ so jq-less hosts (which skip the _metadata.json write) still ship aggregate git.
    if [ -f "${_dall_sidecar}/_metadata.json" ] || [ -d "${_dall_sidecar}/_git" ]; then
      docker_args+=(-v "${_dall_sidecar}:/paxel_sidecar:ro")
    fi
  fi

  # Repo mount for on-device code quality analysis (on by default, --no-repo to skip)
  if [ "${NO_REPO:-0}" != "1" ]; then
    local repo_root
    # `|| true` is LOAD-BEARING: when REPO_ROOT is unset (e.g. "Analyze ALL
    # projects" chosen from a non-repo dir like $HOME), git rev-parse exits 128.
    # `2>/dev/null` hides stderr but NOT the exit code, so under `set -Eeuo
    # pipefail` + `set -E` the failure fires the ERR trap (once inside the $()
    # subshell, once for the outer assignment) and aborts the whole upload. The
    # `|| true` keeps the substitution empty-on-failure so the `[ -n ]` guard
    # below simply skips the repo mount. See _paxel_on_error trap above.
    repo_root="${REPO_ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || true)}"
    if [ -n "$repo_root" ]; then
      local mount_repo=1

      if [ "$mount_repo" = "1" ]; then
        echo "  Mounting repo from ${repo_root} (read-only)"
        docker_args+=(-v "${repo_root}:/repo:ro")

        # Extract git metrics on host (bounded to 5000 commits)
        local git_metrics_file="${HOME}/.paxel/git_metrics.txt"
        mkdir -p "${HOME}/.paxel"
        _run_with_timeout "$PAXEL_GIT_TIMEOUT" git -C "$repo_root" log -n 5000 --no-merges --numstat --format='%H|%aI|%s' > "$git_metrics_file" 2>/dev/null || true
        # No file-level chmod: git_metrics.txt is bind-mounted read-only into the
        # container (uid 1000) and is already shielded from other host users by
        # the 0700 ~/.paxel parent dir.
        if [ -s "$git_metrics_file" ]; then
          docker_args+=(-v "${git_metrics_file}:/git_metrics.txt:ro")
          echo "  Extracted git metrics ($(wc -l < "$git_metrics_file" | tr -d ' ') lines)"
        fi
      fi
    fi
  fi

  local is_localhost=0
  if echo "$PAXEL_SERVER" | grep -qE 'https?://(localhost|127\.0\.0\.1)'; then
    docker_server=$(echo "$PAXEL_SERVER" | sed -E 's/(localhost|127\.0\.0\.1)/host.docker.internal/')
    # Linux needs explicit host mapping; macOS/Windows Docker Desktop has it built-in
    docker_args+=(--add-host=host.docker.internal:host-gateway)
    is_localhost=1
  fi

  # LLM proxy URL: rewrite localhost to host.docker.internal for Docker networking
  local llm_proxy_url="${PAXEL_LLM_PROXY}"
  if [ "$is_localhost" -eq 1 ]; then
    llm_proxy_url=$(echo "$PAXEL_LLM_PROXY" | sed -E 's/(localhost|127\.0\.0\.1)/host.docker.internal/')
  fi

  # Allocate a pseudo-TTY when our OUTPUT is a terminal so the container can
  # render a live progress UI (sticky footer + animated bars). Gate on stdout
  # ([ -t 1 ]), NOT stdin ([ -t 0 ]): under `curl … | bash` stdin is the script
  # pipe and never a TTY, but stdout is the user's terminal. We pass -t only
  # (never -i) — the container never reads stdin; all prompts are host-side via
  # /dev/tty — so interactive selection is unaffected. Non-TTY output (CI,
  # `> file`, `| pipe`) skips -t and the pipeline falls back to plain logging.
  if [ -t 1 ]; then
    docker_args+=(-t)
  fi

  docker_args+=(
    -e "YC_TOKEN=${YC_TOKEN}"
    -e "YC_API_KEY=${YC_TOKEN}"
    -e "YC_LLM_PROXY_URL=${llm_proxy_url}"
    -e "YC_RESULTS_ENDPOINT=${docker_server}/api/v1/results"
    -e "PAXEL_LOG_DIR=/logs"
  )

  # Unified [Step N/17] counter on BOTH paths: bash owns steps 1-3
  # (prereq/sign-in/pull, printed once up front), the container owns steps 4-17.
  # Multi-repo runs the container once per repo, so each repo re-runs steps 4-17
  # under its own "═══ [n/total] Analyzing: NAME ═══" banner — same /17 scale as
  # the pull line. Previously multi-repo left the offset unset, so each repo reset
  # to a disjoint [Step 1/14]..[14/14] that clashed with the /17 pull line and read
  # like a restart/stall (risking a needless Ctrl-C mid-batch).
  docker_args+=(-e "PAXEL_STEP_OFFSET=3")

  # Localhost = dev mode, enable verbose logging
  if [ "$is_localhost" -eq 1 ]; then
    docker_args+=(-e "PAXEL_VERBOSE=1")
  fi

  # Propagate PAXEL_CLIENT_MODE into the container. AnthropicClient uses it to
  # pick env-aware remediation text (bin/upload for dev, `curl | bash` for
  # public users) when a Fatal LLM error hits the rake footer.
  # bin/upload sets this to "dev"; public curl|bash runs leave it unset.
  if [ -n "${PAXEL_CLIENT_MODE:-}" ]; then
    docker_args+=(-e "PAXEL_CLIENT_MODE=${PAXEL_CLIENT_MODE}")
  fi

  # Escape hatch for the preflight-signatures handshake (reviewed by
  # AnthropicClient.preflight_signatures!). Host-side env needs explicit
  # `docker -e` forwarding; without this line a host-side
  # `PAXEL_SKIP_PREFLIGHT=1 bin/upload` is a no-op because the container
  # never sees the value.
  if [ "${PAXEL_SKIP_PREFLIGHT:-0}" = "1" ]; then
    docker_args+=(-e "PAXEL_SKIP_PREFLIGHT=1")
  fi

  # Credential-scrub bypass (SecretScrubber + ToolInputSummarizer + related
  # EventExtractor hooks). Default on inside the container. Set
  # PAXEL_TOOL_OUTPUT_SCRUB=0 on the host before bin/upload to disable for
  # admin debugging — chunks.content then carries raw tool_use / text content
  # untouched. Not intended as a user-facing toggle; only forwarded when
  # explicitly set, otherwise container uses its own default (on).
  if [ -n "${PAXEL_TOOL_OUTPUT_SCRUB:-}" ]; then
    docker_args+=(-e "PAXEL_TOOL_OUTPUT_SCRUB=${PAXEL_TOOL_OUTPUT_SCRUB}")
  fi

  # Pass through optional filters
  if [ -n "$SINCE_EPOCH" ]; then
    docker_args+=(-e "SINCE_EPOCH=${SINCE_EPOCH}")
  fi

  if [ -n "$PROJECT_NAME" ]; then
    docker_args+=(-e "PROJECT_NAME=${PROJECT_NAME}")
  fi

  # Signal to the container that the host already filtered transcripts by
  # git remote (more accurate than the container's encoded-name substring
  # match) so analyze_local.rake skips its redundant in-container filter.
  # Without this, the sidecar has been getting dropped on re-filter.
  if [ "${CLAUDE_MOUNT_SCOPE:-all}" = "filtered" ]; then
    docker_args+=(-e "CLAUDE_MOUNT_SCOPE=filtered")
  fi

  # Per-repo log label so each multi-repo container writes an identifiable
  # ${MOUNT_LABEL}-<ts>.log instead of a colliding all-<ts>.log (analyze_local.rake
  # prefers PAXEL_LOG_LABEL over PROJECT_NAME for the filename).
  if [ -n "${MOUNT_LABEL:-}" ]; then
    docker_args+=(-e "PAXEL_LOG_LABEL=${MOUNT_LABEL}")
  fi

  # Pass host-side time estimate for telemetry calibration
  if [ -n "${PAXEL_HOST_ESTIMATE_MINUTES:-}" ]; then
    docker_args+=(-e "PAXEL_HOST_ESTIMATE_MINUTES=${PAXEL_HOST_ESTIMATE_MINUTES}")
  fi

  # Dev-tuning overrides: bump client-side concurrency for faster local runs.
  # Published defaults (20 / 20 / 20 / 20) are production-safe. The YC LLM
  # proxy + Anthropic tier still cap upstream rate, and AnthropicClient
  # retries 429s with backoff — so bumping these is safe, just effective.
  # DB_POOL must scale with concurrency because each worker checks out an
  # AR connection for session.update! / LlmCall writes.
  for var in PAXEL_NARRATIVE_CONCURRENCY PAXEL_EPISODE_CONCURRENCY \
             PAXEL_NARRATIVE_AGGREGATOR_CONCURRENCY PAXEL_CROSS_SESSION_CONCURRENCY \
             DB_POOL; do
    val="${!var:-}"
    if [ -n "$val" ]; then
      docker_args+=(-e "${var}=${val}")
    fi
  done

  # --no-sentry overrides the baked-in DSN with an empty string. The client
  # initializer returns early when CLIENT_SENTRY_DSN is empty, so no events
  # leave your machine. Without this flag, the image's baked DSN (set via
  # --build-arg during prod publish) is used.
  if [ "${NO_SENTRY:-0}" = "1" ]; then
    docker_args+=(-e "CLIENT_SENTRY_DSN=")
  elif [ -n "${CLIENT_SENTRY_DSN:-}" ]; then
    # Host env wins over baked default — useful for dev testing with a scratch DSN.
    docker_args+=(-e "CLIENT_SENTRY_DSN=${CLIENT_SENTRY_DSN}")
  fi

  # Run the client container (disable set -e so we can capture exit code and show a friendly message)
  # MSYS_NO_PATHCONV=1: under Git Bash / MSYS on Windows, the MSYS layer rewrites the
  # container-side mount paths (e.g. -v host:/transcripts → host:C:/Program Files/Git/
  # transcripts), so the container can't see the data (PAXEL report 2026-06-06). Scoping
  # it to this docker invocation disables that rewrite for the mount args only; it's an
  # unused, harmless env var on macOS/Linux.
  local exit_code=0
  MSYS_NO_PATHCONV=1 docker run "${docker_args[@]}" "$PAXEL_CLIENT_IMAGE" || exit_code=$?

  # Exit code 3 == ClientPipeline::EXIT_NO_ANALYZABLE_SESSIONS (kept in sync with
  # the Ruby constant by comment only). Benign: the repo had sessions but they
  # were all too short to analyze — not a failure, so never print the scary
  # "email us" banner. The container already printed the friendly explanation;
  # in --all mode add a "skipping" line and move on to the next repo (mirrors the
  # zero-session pre-skip at the top of the multi-repo flow), in single-repo mode
  # just exit cleanly.
  if [ $exit_code -eq 3 ]; then
    if [ "$MULTI_REPO_RUNNING" -eq 1 ]; then
      echo ""
      echo "No analyzable sessions for ${MOUNT_LABEL:-this project} (sessions too short to analyze) — skipping."
      return 0
    fi
    exit 0
  fi

  # exit 4 (EXIT_UPLOAD_DEFERRED): analysis finished, the upload failed, but it was
  # stashed for replay. Honest message instead of "Upload complete!" — the results
  # aren't lost and the next run auto-uploads them; nothing lands at /reports until then.
  if [ $exit_code -eq 4 ]; then
    echo ""
    echo "⚠  Analysis finished, but the upload to the server didn't go through — your results are saved locally."
    echo "   They'll upload automatically the next time you run, or re-run now to retry."
    echo "   Your report won't appear at ${PAXEL_SERVER}/reports until it uploads."
    if [ "$MULTI_REPO_RUNNING" -eq 1 ]; then return 0; fi
    exit 0
  fi

  # exit 5 (EXIT_UPLOAD_FAILED): analysis finished but the upload failed with no replay
  # artifact (a permanent rejection or an un-stashable result). There's nothing to
  # auto-retry, so tell the user to re-run rather than promising an automatic upload.
  if [ $exit_code -eq 5 ]; then
    echo ""
    echo "⚠  Analysis finished, but the upload to the server didn't go through and couldn't be queued for an automatic retry."
    echo "   Re-run to try the upload again. Your report won't appear at ${PAXEL_SERVER}/reports until it uploads."
    if [ "$MULTI_REPO_RUNNING" -eq 1 ]; then return 0; fi
    exit 0
  fi

  if [ $exit_code -ne 0 ]; then
    echo ""
    # Name the repo + point to its (now per-repo-named) log so a mid-batch failure is
    # diagnosable — the "═══ Analyzing: NAME ═══" header scrolls away, and the
    # generic message used to give the user nothing to act on.
    echo "Analysis failed for ${MOUNT_LABEL:-this project} (exit code: $exit_code)." >&2
    echo "     Log: ${log_dir}/${_log_label}-*.log" >&2
    echo "Try again, or email paxel@ycombinator.com with that log if the problem persists." >&2
    if [ "$MULTI_REPO_RUNNING" -eq 1 ]; then
      return $exit_code
    fi
    exit $exit_code
  fi

  if [ "$MULTI_REPO_RUNNING" -eq 0 ]; then
    echo "Upload complete! Check your results at: ${PAXEL_SERVER}/reports"
    echo "     Logs saved to: ${log_dir}/"
  else
    echo "  Done — log: ${log_dir}/${_log_label}-*.log"
  fi

  # Terminal bell + macOS notification on completion (skip in multi-repo mode, one at the end)
  if [ "$MULTI_REPO_RUNNING" -eq 0 ]; then
    printf '\a'
    if [ "$(uname -s)" = "Darwin" ]; then
      local notify_msg="Analysis uploaded."
      if [ -n "${ESTIMATED_MINUTES:-}" ]; then
        notify_msg="Analysis uploaded. Results in ~${ESTIMATED_MINUTES} minutes."
      fi
      osascript -e "display notification \"${notify_msg}\" with title \"Paxel\"" 2>/dev/null || true
    fi
  fi
}

run_docker_mode() {

  echo ""
  echo "YC Paxel — coding agent analysis"
  echo "Scanning for coding agent transcripts (Claude Code, Codex, Cursor)..."
  echo ""

  check_docker
  load_or_request_token
  register_git_identity

  # Pending-upload replay (from prior failed runs).
  # Replay-and-exit: if a stash exists, replay it and exit WITHOUT running
  # the fresh pipeline. The user re-runs `bin/upload` for a fresh analysis.
  # --no-replay (PAXEL_SKIP_REPLAY) bypasses.
  # PAXEL_IN_REPLAY guards against the rake task re-entering replay.
  if [ -z "${PAXEL_SKIP_REPLAY:-}" ] && [ -z "${PAXEL_IN_REPLAY:-}" ]; then
    local _pending_dir="$HOME/.paxel/data/pending-uploads"
    local _pending_count=0
    if [ -d "$_pending_dir" ]; then
      _pending_count=$(find "$_pending_dir" -maxdepth 1 -type f -name '*.meta.json' 2>/dev/null | wc -l | tr -d ' ')
    fi

    if [ "$_pending_count" -gt 0 ] || [ -n "${PAXEL_RESUME_PENDING_ONLY:-}" ]; then
      if [ "$_pending_count" -eq 0 ]; then
        # --resume-pending with nothing pending — explicit exit (no fresh pipeline).
        echo "[paxel] No pending uploads — nothing to resume."
        exit 0
      fi

      echo ""
      echo "[paxel] Found $_pending_count pending upload(s) from a prior failed run."
      # Pre-replay banner is intentionally neutral — the outcome-specific case
      # statement below emits the correct remediation command. Embedding
      # rerun_phrase here would show the user a pre-baked-token curl BEFORE
      # we know if the replay needs re-authentication (in which case that
      # token is the one to replace). Caught in review by both Codex and Opus.
      echo "[paxel] Replaying, then exiting."
      echo ""

      # Populate $PAXEL_CLIENT_IMAGE for this branch. Reuses the existing helper so
      # dev mode uses the locally-built tag and prod uses GHCR. PAXEL_QUIET_PULL=1
      # suppresses the step-indexed banner + cost-coverage blurb, which are
      # misleading during a replay-and-exit (no 17-step pipeline is about to run).
      PAXEL_QUIET_PULL=1 pull_client_image

      # Mirror the fresh-pipeline's localhost→host.docker.internal rewrite.
      # Uses sed -E for macOS/BSD compatibility (no \b word boundary).
      local _replay_endpoint="${YC_RESULTS_ENDPOINT:-${PAXEL_SERVER}/api/v1/results}"
      _replay_endpoint=$(printf '%s' "$_replay_endpoint" | sed -E 's/(localhost|127\.0\.0\.1)/host.docker.internal/')

      mkdir -p "$HOME/.paxel/logs"
      local _replay_log
      local _replay_exit
      local _reauth_attempted=0

      # Loop runs at most twice: once with the cached/current token; if that
      # exits 2 (reauth_required), clear the cached token, re-prompt via
      # load_or_request_token, and retry ONCE. A second-attempt 2 falls
      # through to the normal case statement below (user intervention
      # required). PAXEL_SKIP_REAUTH_RETRY=1 disables the loop for CI /
      # scripted runs that prefer an explicit exit-2 signal over an
      # interactive prompt.
      while :; do
        # Token: prefer shell env, fall back to the token file (matches load_or_request_token).
        # Re-read each iteration because load_or_request_token on retry replaces it.
        # `|| true` is required: `2>/dev/null` suppresses cat's stderr but NOT
        # its non-zero exit. Under `set -E`, the ERR trap fires on cat failure
        # inside the command substitution even though `local var=$(…)` masks
        # set -e exit propagation. Without it, users whose token file was
        # deleted (or never created — YC_TOKEN env-only path) would see the
        # "email us" banner before the replay runs. Empty `_replay_token` is
        # a valid state: the replay container 401s, falls through to exit=2
        # (reauth), and the user gets the "re-authentication" message.
        local _replay_token="${YC_TOKEN:-$(cat "${PAXEL_TOKEN_FILE:-$HOME/.paxel/token}" 2>/dev/null || true)}"

        # Timestamped per-attempt so first-attempt output isn't clobbered on retry.
        # `.$$` (PID) suffix guards against a same-second collision if two
        # bin/upload invocations race each other — timestamp is second-resolution
        # alone, so concurrent runs would otherwise tee into the same file.
        if [ "$_reauth_attempted" = "1" ]; then
          _replay_log="$HOME/.paxel/logs/replay-$(date +%Y%m%d-%H%M%S)-retry.$$.log"
        else
          _replay_log="$HOME/.paxel/logs/replay-$(date +%Y%m%d-%H%M%S).$$.log"
        fi

        local _replay_args=(
          --rm
          -v "$HOME/.paxel/data:/rails/data:rw"
          -e YC_TOKEN="$_replay_token"
          -e YC_RESULTS_ENDPOINT="$_replay_endpoint"
          -e PAXEL_PENDING_UPLOAD_DIR=/rails/data/pending-uploads
          -e PAXEL_IN_REPLAY=1
        )
        # Propagate PAXEL_CLIENT_MODE into the replay container. Symmetric to
        # the fresh-pipeline forward at :4597 — AnthropicClient's env-aware
        # user_action helpers (rebuild / auth / input_too_large /
        # model_not_allowed / system_prompt_missing) need this to pick
        # dev-appropriate remediation text when a Fatal LLM error hits the
        # replay rake's log. (Added in PR #726.)
        if [ -n "${PAXEL_CLIENT_MODE:-}" ]; then
          _replay_args+=(-e "PAXEL_CLIENT_MODE=${PAXEL_CLIENT_MODE}")
        fi
        # Honor --no-sentry in the replay container (same policy as fresh-path at :4081).
        # The client initializer short-circuits when CLIENT_SENTRY_DSN is empty, so
        # forcing "" here disables telemetry even though the DSN is baked into the image.
        if [ "${NO_SENTRY:-0}" = "1" ]; then
          _replay_args+=(-e "CLIENT_SENTRY_DSN=")
        elif [ -n "${CLIENT_SENTRY_DSN:-}" ]; then
          _replay_args+=(-e "CLIENT_SENTRY_DSN=${CLIENT_SENTRY_DSN}")
        fi
        if [ "$(uname -s)" = "Linux" ]; then
          _replay_args+=(--add-host=host.docker.internal:host-gateway)
        fi
        _replay_args+=(
          --entrypoint /bin/bash
          "$PAXEL_CLIENT_IMAGE"
          -c 'bin/rails pending_uploads:replay'
        )

        # Run and preserve the docker exit code through the tee pipe.
        # `|| true` is LOAD-BEARING: without it, under `set -Eeuo pipefail`, a
        # non-zero docker exit (e.g. deferred=1 on HTTP 504, or a crashed daemon)
        # aborts the LHS group BEFORE `echo "__EXIT__:$?"` runs, skipping the
        # sentinel and firing the ERR trap's "email us" banner twice (once per
        # pipeline command). With `|| true`, bash's set-e exception suppresses
        # errexit for the whole pipeline AND inside the LHS group, so the
        # sentinel is emitted and the case statement below handles the exit code.
        # MSYS_NO_PATHCONV=1: same Windows mount-path fix as the main run above
        # (this run mounts -v …:/rails/data); no-op on macOS/Linux.
        { MSYS_NO_PATHCONV=1 docker run "${_replay_args[@]}"; echo "__EXIT__:$?"; } 2>&1 | tee "$_replay_log" || true
        # `2>/dev/null || true` guards the fallback below: if tee never wrote
        # the log (disk full, unwritable dir), awk returns non-zero and would
        # otherwise trip the ERR trap before the `-z` fallback can assign 99.
        _replay_exit=$(awk -F: '/^__EXIT__:/ { print $2; exit }' "$_replay_log" 2>/dev/null || true)
        # Defensive fallback — if the sentinel is missing (docker crashed before
        # printing, tee write failed, etc.), default to a generic failure code
        # rather than passing "" to `exit` (which bash rejects with "numeric
        # argument required" and leaves the user with a confusing error).
        [ -z "$_replay_exit" ] && _replay_exit=99
        # Strip the sentinel from the log for cleanliness.
        sed -i.bak '/^__EXIT__:/d' "$_replay_log" 2>/dev/null && rm -f "${_replay_log}.bak"

        # Auto-re-auth on reauth_required (exit 2), once. Without this the
        # user has to manually re-run bin/upload after re-authing; the replay
        # itself already knows what needs fixing.
        if [ "$_replay_exit" = "2" ] \
           && [ "$_reauth_attempted" = "0" ] \
           && [ "${PAXEL_SKIP_REAUTH_RETRY:-0}" != "1" ]; then
          echo ""
          echo "[paxel] Your session expired — re-authenticating..."
          # Clear the invalid cached token so load_or_request_token falls
          # through to the baked-token / browser-auth paths. Unset the env
          # var too, since it takes precedence in that function.
          rm -f "${PAXEL_TOKEN_FILE:-$HOME/.paxel/token}" 2>/dev/null || true
          unset YC_TOKEN
          _reauth_attempted=1
          load_or_request_token
          echo ""
          echo "[paxel] Retrying replay with refreshed credentials..."
          continue
        fi
        break
      done

      echo ""
      case "$_replay_exit" in
        0)
          echo "[paxel] Replay complete. $(rerun_phrase fresh)"
          # All stashes cleared, so the next run skips this gate and reaches the
          # picker — re-analyzing any repo a prior multi-repo run didn't finish.
          multi_repo_replay_hint
          ;;
        1)
          echo "[paxel] Replay partial — some stashes deferred. $(rerun_phrase next_upload)"
          ;;
        2)
          if [ "$_reauth_attempted" = "1" ]; then
            echo "[paxel] Replay still needs re-authentication after one retry — your credentials may be revoked."
            echo "[paxel] Sign in again at: ${PAXEL_SERVER}/auth/login"
          else
            echo "[paxel] Replay needs re-authentication. $(rerun_phrase reauth)"
          fi
          ;;
        *)
          echo "[paxel] Replay failed with exit code $_replay_exit. $(rerun_phrase bypass_replay)"
          ;;
      esac
      echo "[paxel] Log: $_replay_log"
      exit "$_replay_exit"
    fi
  fi

  # Deliberately AFTER the replay-and-exit block above: a spent budget must never
  # block delivery of a report that already finished and was paid for. Only NEW
  # analysis is gated, and only here, before anything costs money.
  check_daily_quota

  local match_label=""

  # Auto-scope to current project unless --all was passed.
  # Filtering happens HERE on the host (not in Docker — the container can't
  # see host git repos, so it only has substring matching as a fallback).
  #
  # Even when --project is explicit, we still run this block when invoked
  # from inside a git repo. If the filter produces a match, the resulting
  # sidecar gives TranscriptDiscoverer the git_remote it needs to collapse
  # Conductor worktree scatter. If PROJECT_NAME is set but doesn't match
  # the matched repo's name (e.g. user ran --project yc-backend from inside
  # paxel), we discard the filter below and let the container substring-match.
  if [ "$ALL_PROJECTS" -eq 0 ]; then
    local filtered_dir="${HOME}/.paxel/cache/filtered-transcripts-$$"
    rm -rf "$filtered_dir"
    mkdir -p "$filtered_dir"
    local match_count=0
    match_label=""

    # Strategy 1: match by git remote URL (most accurate for repos with multiple workspaces)
    local cwd_remote
    cwd_remote=$(get_git_remote "$(pwd)")
    if [ -n "$cwd_remote" ]; then
      local repo_name
      repo_name=$(echo "$cwd_remote" | sed 's|.*[:/]||' | sed 's/\.git$//')
      match_label="$repo_name"

      if [ -d "$CLAUDE_DIR" ]; then
        # First pass: collect all dir names, CWDs, and remotes
        local _bfc_names=()
        _bfc_cwds=()
        _bfc_remotes=()
        local _scan_total=0
        local _scan_count=0
        for d in "$CLAUDE_DIR"/*/; do [ -d "$d" ] && _scan_total=$((_scan_total + 1)); done
        echo "  Finding your coding sessions..." >&2
        for dir in "$CLAUDE_DIR"/*/; do
          [ -d "$dir" ] || continue
          _scan_count=$((_scan_count + 1))
          if [ $((_scan_count % 500)) -eq 0 ]; then
            echo "  ...${_scan_count}/${_scan_total} checked" >&2
          fi
          local dir_name
          dir_name=$(basename "$dir")
          local dir_cwd
          dir_cwd=$(get_project_cwd "$dir_name")
          local dir_remote
          dir_remote=$(get_git_remote "$dir_cwd")
          _bfc_names+=("$dir_name")
          _bfc_cwds+=("$dir_cwd")
          _bfc_remotes+=("$dir_remote")
        done

        # Backfill remotes for deleted Conductor workspaces
        backfill_conductor_remotes
        # Recover remotes for non-Conductor orphan cwds
        local _orphan_j=0
        while [ $_orphan_j -lt ${#_bfc_cwds[@]} ]; do
          if [ -z "${_bfc_remotes[$_orphan_j]}" ]; then
            local _orphan_recovered
            _orphan_recovered=$(resolve_remote_for_dead_cwd "${_bfc_cwds[$_orphan_j]}")
            [ -n "$_orphan_recovered" ] && _bfc_remotes[$_orphan_j]="$_orphan_recovered"
          fi
          _orphan_j=$((_orphan_j + 1))
        done

        # Second pass: filter by matching remote
        local i=0
        while [ $i -lt ${#_bfc_names[@]} ]; do
          if [ "${_bfc_remotes[$i]}" = "$cwd_remote" ]; then
            # CoW clone, mtime-preserving (-p) so --since (container File.mtime
            # filter) works. Bare under active errexit → a copy failure aborts loud.
            _paxel_cp_transcripts "$CLAUDE_DIR/${_bfc_names[$i]}" "$filtered_dir/${_bfc_names[$i]}"
            match_count=$((match_count + 1))
          fi
          i=$((i + 1))
        done
      fi
    fi

    # Strategy 2: match by current directory path (works without git)
    if [ "$match_count" -eq 0 ]; then
      local current_dir
      current_dir=$(pwd)
      # Encode current path the same way Claude does: it replaces BOTH "/" AND
      # "." with "-" (e.g. /a/b.c -> -a-b-c). Matching only "/" (the old
      # `sed 's|/|-|g'`) silently broke Strategy-2 path matching for any cwd
      # containing a dot — a repo/domain/dir like x70.one or qerdp.co.uk, even a
      # macOS /var/folders/.../T/tmp.X path — so a no-remote repo fell through to
      # "None of your sessions match this directory." See SESSION_DETECTION.md
      # §3a. ("." is a literal inside the [] bracket expression on BSD + GNU sed.)
      local encoded_cwd
      encoded_cwd=$(encode_claude_dir_name "$current_dir")
      match_label="$(basename "$current_dir")"

      if [ -d "$CLAUDE_DIR" ]; then
        for dir in "$CLAUDE_DIR"/*/; do
          [ -d "$dir" ] || continue
          local dir_name
          dir_name=$(basename "$dir")
          # Exact match (this workspace) or prefix match (subdirectory)
          if [ "$dir_name" = "$encoded_cwd" ]; then
            # CoW clone, mtime-preserving (-p) so --since (container File.mtime
            # filter) works. Bare under active errexit → a copy failure aborts loud.
            _paxel_cp_transcripts "$dir" "$filtered_dir/$dir_name"
            match_count=$((match_count + 1))
          fi
        done
      fi
    fi

    # PROJECT_NAME override safety: if the user passed --project NAME and the
    # auto-filter matched a DIFFERENT repo (e.g. ran --project yc-backend from
    # inside paxel), discard the filter so the container's substring match can
    # pick the right thing. Matches repo_name loosely (case-insensitive, -/_
    # treated the same).
    if [ "$match_count" -gt 0 ] && [ -n "$PROJECT_NAME" ]; then
      local _pn_norm
      _pn_norm=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr '_' '-')
      local _rn_norm
      _rn_norm=$(echo "${match_label}" | tr '[:upper:]' '[:lower:]' | tr '_' '-')
      case "$_rn_norm" in
        *"$_pn_norm"*) : ;;  # matched project-name substring — keep the filter
        *)
          echo "  --project $PROJECT_NAME given, but current dir is '${match_label}'. Deferring to container substring match." >&2
          rm -rf "$filtered_dir"
          mkdir -p "$filtered_dir"
          match_count=0
          ;;
      esac
    fi

    if [ "$match_count" -gt 0 ]; then
      # Check: if match_count is low AND this directory has child repos with more data,
      # prefer the multi-repo picker over a weak single-project match.
      # This handles the case where ~/git itself is a repo but the user really wants
      # to analyze child repos inside ~/git.
      local child_repo_override=0
      if [ "$match_count" -le 2 ]; then
        local self_sessions
        self_sessions=$(count_sessions "$filtered_dir")
        if detect_child_repos && [ ${#CHILD_REPO_NAMES[@]} -ge 2 ]; then
          # Sum child repo sessions
          local child_total=0
          local cr=0
          while [ $cr -lt ${#CHILD_REPO_SESSIONS[@]} ]; do
            child_total=$((child_total + ${CHILD_REPO_SESSIONS[$cr]}))
            cr=$((cr + 1))
          done
          # If child repos have significantly more data, prefer multi-repo
          if [ "$child_total" -gt $((self_sessions * 3)) ]; then
            child_repo_override=1
          fi
        fi
      fi

      if [ "$child_repo_override" -eq 1 ]; then
        # Discard the weak single-project match, use multi-repo path instead
        rm -rf "$filtered_dir"
        show_child_repo_menu
        run_selected_child_repos
      fi

      local orig_claude_dir="$CLAUDE_DIR"

      # Compute OLDEST_SESSION_EPOCH from source files (before cp changed mtime)
      # Uses original CLAUDE_DIR files, not filtered_dir copies
      if [ -z "$OLDEST_SESSION_EPOCH" ]; then
        local _oldest
        # Trailing `|| true` swallows the SIGPIPE (141) from `head -1` closing
        # upstream `stat` writes under `set -euo pipefail` — with 4000+ jsonls,
        # head reliably closes before stat drains and without this the whole
        # pipeline returns 141, killing the script mid-scan.
        # GNU stat -c %Y first: BSD stat -f on Linux exits 0 with filesystem
        # info, so BSD-first would silently poison the result on the CI runner.
        _oldest=$(find "$orig_claude_dir" -name "*.jsonl" -not -name "_*" -maxdepth 3 2>/dev/null \
          | while read -r f; do stat -c '%Y' "$f" 2>/dev/null || stat -f '%m' "$f" 2>/dev/null; done \
          | sort -n | head -1 || true)
        [ -n "$_oldest" ] && OLDEST_SESSION_EPOCH="$_oldest"
      fi

      CLAUDE_DIR="$filtered_dir"
      CLAUDE_MOUNT_SCOPE="filtered"
      MOUNT_LABEL="$match_label"
      # Scope Cursor extraction to the same remote so cross-repo Cursor sessions
      # don't leak into a single-project upload. Without this, collect_cursor_sessions
      # gets an empty filter and pulls in every workspace's Cursor history.
      selected_remote="$cwd_remote"
      # C6: when the run dir has NO git remote (a home/parent / non-repo dir, e.g.
      # kelvin running from ~), an empty selected_remote made the no-remote-skip guards
      # gut Codex/etc. Instead, scope to this dir: the collectors keep only sessions
      # whose cwd is under it (the home SUBTREE, not the whole machine — /tmp, other
      # volumes are excluded), group them by their own recovered remote when possible,
      # and cwd-bucket the rest. Use the LOGICAL cwd ($PWD, not `pwd -P`) for the
      # descendant prefix match — tools record the logical cwd, so a symlinked home
      # (e.g. ~ -> /private/...) would miss against a physical path.
      if [ -z "$cwd_remote" ]; then
        scope_cwd="${PWD:-$(pwd 2>/dev/null || true)}"
      fi
      echo "Auto-detected project: ${match_label} (${match_count} workspaces)" >&2

      # Low-count warning: if we matched very few workspaces but there are many more available
      if [ "$match_count" -le 3 ]; then
        local total_dirs=0
        for d in "$orig_claude_dir"/*/; do
          [ -d "$d" ] && total_dirs=$((total_dirs + 1))
        done
        if [ "$total_dirs" -ge $((match_count * 3)) ]; then
          local total_sessions
          total_sessions=$(count_sessions "$orig_claude_dir" 2>/dev/null || echo "many")
          echo "" >&2
          echo "  Tip: You have ${total_sessions} total sessions across ${total_dirs} projects." >&2
          echo "  To include all:    $(rerun_cmd --all)" >&2
          echo "  To pick a different project: $(rerun_cmd --project NAME)" >&2
        fi
      fi

      # Collect git metadata for Docker mode (Docker can't see host git repos)
      # Write _metadata.json + _git/ dir with commits and numstat
      # Use backfill-resolved data from _bfc_* arrays when available (Strategy 1),
      # fall back to direct resolution for Strategy 2 matches.
      if [ -z "${_bfc_names+x}" ]; then _bfc_names=(); _bfc_cwds=(); _bfc_remotes=(); fi
      local git_data_dir="${filtered_dir}/_git"
      mkdir -p "$git_data_dir"
      local docker_metadata="{}"
      local _author_cwds_done=""

      for dir in "$filtered_dir"/*/; do
        [ -d "$dir" ] || continue
        local dir_name
        dir_name=$(basename "$dir")

        # Look up resolved CWD/remote from backfill arrays if available
        local dir_cwd=""
        local dir_remote=""
        if [ -n "${_bfc_names+x}" ] && [ ${#_bfc_names[@]} -gt 0 ]; then
          local _lookup=0
          while [ $_lookup -lt ${#_bfc_names[@]} ]; do
            if [ "${_bfc_names[$_lookup]}" = "$dir_name" ]; then
              dir_cwd="${_bfc_cwds[$_lookup]}"
              dir_remote="${_bfc_remotes[$_lookup]}"
              break
            fi
            _lookup=$((_lookup + 1))
          done
        fi
        # Fall back to direct resolution (Strategy 2 matches)
        if [ -z "$dir_cwd" ]; then
          dir_cwd=$(get_project_cwd "$dir_name")
          dir_remote=$(get_git_remote "$dir_cwd")
          if [ -z "$dir_remote" ] && [ -n "$dir_cwd" ] && [ ! -e "$dir_cwd" ]; then
            dir_remote=$(resolve_remote_for_dead_cwd "$dir_cwd")
                fi
        fi

        # Build metadata sidecar
        if [ -n "$dir_remote" ] || [ -n "$dir_cwd" ]; then
          docker_metadata=$(echo "$docker_metadata" | jq \
            --arg dir "$dir_name" \
            --arg remote "$dir_remote" \
            --arg cwd "$dir_cwd" \
            '. + {($dir): {"git_remote": $remote, "cwd": $cwd}}' 2>/dev/null || echo "$docker_metadata")
        fi

        # Collect git commits + numstat if this is a git repo
        if [ -n "$dir_cwd" ] && [ -e "$dir_cwd/.git" ]; then
          local encoded
          encoded=$(echo "$dir_name" | sed 's/[^a-zA-Z0-9_-]/_/g')
          local since_flag=""
          [ -n "$SINCE_EPOCH" ] && since_flag="--since=$(date -r "$SINCE_EPOCH" '+%Y-%m-%d' 2>/dev/null || date -d "@$SINCE_EPOCH" '+%Y-%m-%d' 2>/dev/null || echo '')"

          # Total commit count (for accurate reporting — cheap, no data)
          git -C "$dir_cwd" rev-list --count HEAD \
            > "${git_data_dir}/${encoded}_commit_count.txt" 2>/dev/null || true

          # Recent commits with author emails (TSV, subject LAST) — team-wide for
          # velocity context; robust to quotes/backslashes in subjects (audit C13).
          git -C "$dir_cwd" log -${COMMIT_LIMIT:-1000} $since_flag \
            --format='%H%x09%h%x09%aN%x09%aE%x09%aI%x09%s' \
            > "${git_data_dir}/${encoded}_commits.jsonl" 2>/dev/null || true

          # Numstat with author emails (same format as legacy upload) — team-wide for velocity
          _run_with_timeout "$PAXEL_GIT_TIMEOUT" \
            git -C "$dir_cwd" log -${COMMIT_LIMIT:-1000} $since_flag \
            --format='COMMIT_BOUNDARY %H %aI %aN <%aE>' --numstat \
            > "${git_data_dir}/${encoded}_numstat.txt" 2>/dev/null || true

          # Author-filtered commits for episode linking (collect once per remote, copy for others)
          local _dedup_key="${dir_remote:-${dir_cwd}}"
          local _first_encoded=""
          case "$_author_cwds_done" in
            *"|${_dedup_key}="*)
              _first_encoded=$(echo "$_author_cwds_done" | grep -o "|${_dedup_key}=[^|]*|" | sed "s#|${_dedup_key}=##;s#|##")
              if [ -n "$_first_encoded" ]; then
                cp -f "${git_data_dir}/${_first_encoded}_author_commits.jsonl" "${git_data_dir}/${encoded}_author_commits.jsonl" 2>/dev/null || true
                cp -f "${git_data_dir}/${_first_encoded}_author_numstat.txt" "${git_data_dir}/${encoded}_author_numstat.txt" 2>/dev/null || true
              fi
              ;;
            *)
              local author_emails
              author_emails=$(detect_author_emails "$dir_cwd" "$filtered_dir")
              if [ -n "$author_emails" ]; then
                # Clamp the author-commit floor to --since when active: OLDEST_SESSION_EPOCH
                # is the absolute-oldest session, which can predate the requested window.
                # Local var so we don't mutate the shared global. (Mirrors the picker path.)
                local _floor_epoch="$OLDEST_SESSION_EPOCH"
                if [ -n "$SINCE_EPOCH" ]; then
                  if [ -z "$_floor_epoch" ] || [ "$_floor_epoch" -lt "$SINCE_EPOCH" ]; then
                    _floor_epoch="$SINCE_EPOCH"
                  fi
                fi
                local oldest_date=""
                if [ -n "$_floor_epoch" ]; then
                  oldest_date=$(date -r "$_floor_epoch" '+%Y-%m-%d' 2>/dev/null || date -d "@$_floor_epoch" '+%Y-%m-%d' 2>/dev/null || echo '')
                fi
                collect_author_commits "$dir_cwd" "$git_data_dir" "$encoded" "$author_emails" "$oldest_date"
                _author_cwds_done="${_author_cwds_done}|${_dedup_key}=${encoded}|"
              fi
              ;;
          esac
        fi
      done

      # Write _metadata.json sidecar
      local _rmdc_total
      _rmdc_total=$(_rmdc_recovery_count_unique)
      if command -v jq &>/dev/null; then
        jq -n --argjson dirs "$docker_metadata" \
          --argjson recoveries "${_rmdc_total:-0}" \
          '{"version": 1, "directories": $dirs, "orphan_recovery_count": $recoveries}' \
          > "${filtered_dir}/_metadata.json"
      fi
    elif [ -n "$cwd_remote" ] && remote_has_agent_sessions "$cwd_remote"; then
      # No Claude Code history for this repo, but Codex/Cursor/opencode have
      # sessions here — set up a Claude-LESS filtered run so they get scoped to
      # this project and uploaded, instead of falling to the "none match" prompt.
      # This makes auto-detect tool-agnostic: any tool or combination works
      # without Claude. The empty filtered_dir means no Claude transcripts;
      # run_docker_analysis still mounts it at /transcripts (0 sessions is fine),
      # extracts the agent tools filtered to selected_remote, and analyze_local
      # merges their buckets in. The cwd repo is mounted for code quality as usual.
      CLAUDE_DIR="$filtered_dir"
      CLAUDE_MOUNT_SCOPE="filtered"
      MOUNT_LABEL="$match_label"
      selected_remote="$cwd_remote"
      if command -v jq >/dev/null 2>&1; then
        echo '{"version": 1, "directories": {}}' > "${filtered_dir}/_metadata.json"
      fi
      echo "Auto-detected project: ${match_label} (matched Codex/Cursor/opencode/Gemini/VS Code Copilot sessions; no Claude Code history here)" >&2
    elif detect_child_repos; then
      # Strategy 3: parent directory with child repos that have transcript data
      rm -rf "$filtered_dir"
      show_child_repo_menu
      run_selected_child_repos
    else
      # No matches — confirm with user before processing everything
      rm -rf "$filtered_dir"
      echo "None of your sessions match this directory." >&2
      echo "  To analyze a specific project: $(rerun_cmd --project NAME)" >&2
      if [ -c /dev/tty ]; then
        echo "" >&2
        echo "Options:" >&2
        echo "  1) Analyze ALL projects" >&2
        echo "  2) Cancel" >&2
        echo "" >&2
        local choice
        user_read -rp "Choose [1-2]: " choice
        case "$choice" in
          1) ALL_PROJECTS=1 ;;
          *) echo "Cancelled."; exit 0 ;;
        esac
      else
        echo "To specify what to analyze:" >&2
        echo "  $(rerun_cmd --project NAME)" >&2
        echo "  $(rerun_cmd --all)" >&2
        exit 1
      fi
    fi
  fi

  # Count sessions and show time estimate (or abort if zero)
  local claude_count
  claude_count=$(count_sessions "$CLAUDE_DIR")

  # Codex sessions split by originator: the user's mental model is "I ran
  # codex N times" (standalone), distinct from "Claude dispatched codex M
  # times" (cross-tool, looks like a subagent invocation). codex-companion
  # writes payload.originator="Claude Code" for the latter; codex_cli_rs etc.
  # for the former. Server picks up the same distinction post-link via
  # CrossToolLinker (cross_tool_origin column).
  local codex_standalone_count=0
  local codex_cross_tool_count=0
  if [ -d "$CODEX_DIR" ] && [ -z "${TRANSCRIPT_DIR:-}" ]; then
    if [ -n "${selected_remote:-}" ]; then
      # Single-project mode: count only sessions matching project remote
      # (mirrors collect_codex_sessions filter applied during extraction).
      # Keep get_codex_session_remote unchanged — it has cwd-fallback semantics
      # used by collect_codex_sessions; classify originator separately.
      local _sr_norm
      _sr_norm=$(normalize_remote "$selected_remote")
      while IFS= read -r _cf; do
        [ -z "$_cf" ] && continue
        if [ -n "$SINCE_EPOCH" ]; then
          local _fm
          _fm=$(stat -c %Y "$_cf" 2>/dev/null || stat -f %m "$_cf" 2>/dev/null || echo "0")
          [ "$_fm" -lt "$SINCE_EPOCH" ] 2>/dev/null && continue
        fi
        local _cr
        _cr=$(get_codex_session_remote "$_cf")
        [ "$_cr" != "$_sr_norm" ] && continue
        local _co
        _co=$(get_codex_session_originator "$_cf")
        if codex_originator_is_standalone "$_co"; then
          codex_standalone_count=$((codex_standalone_count + 1))
        else
          codex_cross_tool_count=$((codex_cross_tool_count + 1))
        fi
      done < <(find "$CODEX_DIR" -name "*.jsonl" -maxdepth 6 2>/dev/null)
    else
      # Orphan-cwd path: no remote to filter on, count every Codex JSONL
      # split by originator.
      while IFS= read -r _cf; do
        [ -z "$_cf" ] && continue
        local _co
        _co=$(get_codex_session_originator "$_cf")
        if codex_originator_is_standalone "$_co"; then
          codex_standalone_count=$((codex_standalone_count + 1))
        else
          codex_cross_tool_count=$((codex_cross_tool_count + 1))
        fi
      done < <(find "$CODEX_DIR" -name "*.jsonl" -maxdepth 6 2>/dev/null)
    fi
  fi

  # opencode sessions (SQLite-backed) matching this project's remote. Folded
  # into N so an opencode-only user isn't told "No sessions found".
  local opencode_count
  opencode_count=$(count_opencode_sessions "${selected_remote:-}")

  # Gemini CLI sessions matching this project's remote. Folded into N so a
  # Gemini-only user isn't told "No sessions found".
  local gemini_count
  gemini_count=$(count_gemini_sessions "${selected_remote:-}")

  # VS Code Copilot sessions matching this project's remote. Folded into N so a
  # Copilot-only user isn't told "No sessions found".
  local vscode_count
  vscode_count=$(count_vscode_copilot_sessions "${selected_remote:-}")

  # Antigravity sessions matching this project's remote. Folded into N so an
  # Antigravity-only user isn't told "No sessions found".
  local antigravity_count
  antigravity_count=$(count_antigravity_sessions "${selected_remote:-}")

  # Cross-tool Codex is folded into the subagent total below — it appears in
  # M (subagents), NOT in N (sessions). No double-count.
  local session_count=$((claude_count + codex_standalone_count + opencode_count + gemini_count + vscode_count + antigravity_count))

  if [ "$session_count" -eq 0 ]; then
    echo ""
    echo "No sessions found in this directory."
    echo "Run from a project directory with coding agent sessions, or include all:"
    echo "  $(rerun_cmd --all)"
    exit 1
  fi

  local subagent_count
  # NOTE — counts ALL subagents under $CLAUDE_DIR globally, not just this
  # project's. claude_count (line above) has the same global scope, so the
  # ratio is internally consistent for this prelude display. Project-scoping
  # requires mapping selected_remote → matched Claude project dirs (the same
  # mapping the multi-repo flow does in prepare_and_run_for_repo); deferred
  # to Phase 4 since neither subagent_count nor claude_count drive any
  # downstream gate — they're prelude display only. (Phase 3.5 callout)
  subagent_count=$(count_subagent_sessions "$CLAUDE_DIR")
  # Fold Codex-via-Claude into subagents — they look like subagent invocations
  # to the user. print_estimate displays each component on its own line so the
  # mix is legible.
  local subagent_total=$((subagent_count + codex_cross_tool_count))

  local data_mb
  data_mb=$(get_data_size "$CLAUDE_DIR")
  ESTIMATED_MINUTES=""

  if [ -n "$PROJECT_NAME" ]; then
    echo ""
    echo "This usually takes a few minutes."
    echo ""
    echo "  ★  You'll get an email when your report is ready."
    echo ""
    ESTIMATED_MINUTES="5"
  else
    print_estimate "$session_count" "$data_mb" "$claude_count" "$codex_standalone_count" "$codex_cross_tool_count" "$match_label" "$subagent_total"
    # opencode sessions are folded into the $session_count total above; show
    # the per-tool line too so the breakdown sums (mirrors the Codex CLI line).
    [ "$opencode_count" -gt 0 ] && echo "  opencode: ${opencode_count} sessions"
    [ "$gemini_count" -gt 0 ] && echo "  Gemini CLI: ${gemini_count} sessions"
    [ "$vscode_count" -gt 0 ] && echo "  VS Code Copilot: ${vscode_count} sessions"
  fi

  # Pass estimate to Docker for telemetry
  export PAXEL_HOST_ESTIMATE_MINUTES="${ESTIMATED_MINUTES:-}"

  # Set selected_remote so Cursor extraction filters by this project's remote
  selected_remote="${cwd_remote:-}"

  pull_client_image
  run_docker_analysis
}

# --- Main ---

while [ $# -gt 0 ]; do
  case "$1" in
    --project)
      PROJECT_NAME="$2"
      shift 2
      ;;
    --since)
      SINCE_EPOCH=$(parse_since "$2")
      shift 2
      ;;
    --all)
      ALL_PROJECTS=1
      shift
      ;;
    --no-repo)
      NO_REPO=1
      shift
      ;;
    --with-repo)
      # On by default now. Kept for backward compatibility.
      shift
      ;;
    --clean)
      CLEAN=1
      shift
      ;;
    --no-sentry)
      NO_SENTRY=1
      shift
      ;;
    --commits)
      COMMIT_LIMIT="$2"
      shift 2
      ;;
    --no-orphan-recovery)
      PAXEL_NO_ORPHAN_RECOVERY=1
      export PAXEL_NO_ORPHAN_RECOVERY
      shift
      ;;
    --clear-cache)
      # Clear legacy v1 (raw git URLs) and current v2 (normalized) caches.
      _cleared=0
      for _cache_file in \
        "$HOME/.paxel/cache/project-remotes.tsv" \
        "$HOME/.paxel/cache/project-remotes-v2.tsv"; do
        if [ -f "$_cache_file" ]; then
          rm -f "$_cache_file"
          echo "[paxel] Cleared project-remotes cache ($_cache_file)" >&2
          _cleared=$((_cleared + 1))
        fi
      done
      [ "$_cleared" -eq 0 ] && echo "[paxel] No project-remotes cache to clear" >&2
      unset _cache_file _cleared
      shift
      ;;
    --clear-pending)
      _pending_dir="$HOME/.paxel/data/pending-uploads"
      if [ -d "$_pending_dir" ]; then
        _count=$(find "$_pending_dir" -type f \( -name '*.json*' -o -name '*.meta.json' -o -name '*.error.json' \) 2>/dev/null | wc -l | tr -d ' ')
        rm -rf "$_pending_dir"
        echo "[paxel] Cleared $_count pending upload artifact(s)" >&2
      else
        echo "[paxel] No pending uploads to clear" >&2
      fi
      unset _pending_dir _count
      exit 0
      ;;
    --resume-pending)
      PAXEL_RESUME_PENDING_ONLY=1
      export PAXEL_RESUME_PENDING_ONLY
      shift
      ;;
    --no-replay)
      PAXEL_SKIP_REPLAY=1
      export PAXEL_SKIP_REPLAY
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--project NAME] [--since DURATION] [--commits N] [--all] [--no-repo] [--no-sentry] [--clean] [--no-orphan-recovery] [--clear-cache] [--clear-pending] [--resume-pending] [--no-replay]"
      echo "  or:  $(rerun_cmd '[OPTIONS]')"
      exit 1
      ;;
  esac
done

# Docker mode. File bodies stay local; aggregate metrics + metadata
# (paths, commit numstat, session events) upload. See /data-handling.
run_docker_mode
