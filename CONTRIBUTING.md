# Contributing to Amicro

Thank you for your interest in contributing to Amicro! We welcome contributions to make this micro-interaction library even better.

Please take a moment to review this document to ensure a smooth and efficient collaboration.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### 1. Reporting Bugs
If you find a bug, please open an issue using our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md). Be sure to include:
- A clear description of the issue.
- Steps to reproduce.
- Expected vs. actual behavior.
- Relevant system configurations.

### 2. Suggesting Features
To suggest new micro-transitions, animations, or UI layouts, open an issue using our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

### 3. Submitting Pull Requests
We gladly accept Pull Requests (PRs)! Here is a quick guide to setting up the environment:

#### Development Setup
1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Amicro--Micro-transitions-.git
   cd Amicro--Micro-transitions-
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or the configured port) to interact with the development environment.

#### Code Guidelines
- Write clean, modular React components using TypeScript.
- For animations, use the `motion` package (`motion/react` or `framer-motion` syntax).
- Ensure styling uses pure Tailwind classes. Follow the established color tokens and styling system.
- Before committing, verify TypeScript and type-safety:
  ```bash
  npm run lint
  ```
- Build the production bundle to verify compilation is successful:
  ```bash
  npm run build
  ```

#### Submitting a PR
1. Create a branch for your feature or bug fix:
   ```bash
   git checkout -b feature/my-new-transition
   ```
2. Commit your changes with clear, descriptive commit messages.
3. Push to your fork and open a Pull Request against the main branch. Fill out the [Pull Request Template](.github/pull_request_template.md) completely.
