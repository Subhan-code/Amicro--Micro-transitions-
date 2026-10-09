import React, { useState } from 'react';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { SponsorSection, SponsorItem } from './SponsorSection';
import { RegistryMode, getStoredRegistryMode, setStoredRegistryMode } from '../utils/registryPreference';

interface CliPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  sponsors?: SponsorItem[];
  checkoutUrl?: string;
  onNavigateSponsors?: () => void;
}

export function CliPage({ theme, sponsors, checkoutUrl, onNavigateSponsors }: CliPageProps) {
  const [registryMode, setRegistryMode] = useState<RegistryMode>(getStoredRegistryMode());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { trigger: triggerHaptic } = useWebHaptics();

  const handleModeSwitch = (mode: RegistryMode) => {
    triggerHaptic('light');
    setRegistryMode(mode);
    setStoredRegistryMode(mode);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        triggerHaptic('light');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      })
      .catch((err) => {
        triggerHaptic('error');
        console.error('Failed to copy: ', err);
      });
  };

  const componentsJsonText = `{\n  "registries": {\n    "@amicro": "https://amicro.vercel.app/r/{name}.json"\n  }\n}`;

  const isDark = theme === 'dark';

  return (
    <div className={`w-full min-h-dvh pb-24 transition-colors select-none ${
      isDark ? 'bg-[#08080a] text-[#ededed] selection:bg-neutral-800' : 'bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200'
    }`}>
      {/* Header, left-aligned */}
      <section className="w-full max-w-[960px] 2xl:max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        <div className="flex w-full flex-col gap-[4px]">
          <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
            isDark ? 'text-white/40' : 'text-neutral-500'
          }`}>
            Install
          </p>
          <h1 className={`text-2xl sm:text-3xl 2xl:text-4xl font-semibold tracking-[-0.6px] m-0 ${
            isDark ? 'text-[#fafafa]' : 'text-neutral-900'
          }`}>
            CLI
          </h1>
        </div>

        {/* Segmented control under the title */}
        <div className="mt-4 flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleModeSwitch('shadcn')}
            className={`px-3 py-1.5 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer border-0 ${
              registryMode === 'shadcn'
                ? isDark
                  ? 'bg-white/[0.08] text-[#fafafa]'
                  : 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60'
                : isDark
                  ? 'bg-transparent text-[#a3a3a3] hover:text-white'
                  : 'bg-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            shadcn/ui
          </button>
          
          <button
            type="button"
            onClick={() => handleModeSwitch('amicro')}
            className={`px-3 py-1.5 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer border-0 ${
              registryMode === 'amicro'
                ? isDark
                  ? 'bg-white/[0.08] text-[#fafafa]'
                  : 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60'
                : isDark
                  ? 'bg-transparent text-[#a3a3a3] hover:text-white'
                  : 'bg-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            @subhanhq/amicro
          </button>
        </div>
      </section>

      {/* Install Block Shell */}
      <section className="w-full max-w-[960px] 2xl:max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shell */}
        <div className={`relative overflow-hidden rounded-[16px] outline -outline-offset-1 ${
          isDark ? 'outline-white/[0.03]' : 'outline-black/[0.04]'
        }`}>
          {/* Grid inside shell */}
          <div className="grid grid-cols-1 gap-3">
            {registryMode === 'shadcn' ? (
              <>
                {/* 1. Registry */}
                <div className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}>
                  <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                    isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                  }`}>
                    Registry
                  </p>
                  <div className="flex items-center justify-between gap-[16px]">
                    <code className={`text-[14px] leading-[20px] font-medium font-mono select-all truncate ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}>
                      npx shadcn@latest add @amicro/download-button
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npx shadcn@latest add @amicro/download-button', 'cmd-reg')}
                      className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                        isDark
                          ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                          : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                      }`}
                    >
                      {copiedId === 'cmd-reg' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* 2. Endpoint */}
                <div className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}>
                  <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                    isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                  }`}>
                    Endpoint
                  </p>
                  <div className="flex items-center justify-between gap-[16px]">
                    <code className={`text-[14px] leading-[20px] font-medium font-mono select-all truncate ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}>
                      npx shadcn@latest add https://amicro.vercel.app/r/download-button.json
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npx shadcn@latest add https://amicro.vercel.app/r/download-button.json', 'cmd-endpoint')}
                      className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                        isDark
                          ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                          : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                      }`}
                    >
                      {copiedId === 'cmd-endpoint' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* 3. components.json */}
                <div className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}>
                  <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                    isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                  }`}>
                    components.json
                  </p>
                  <div className="flex items-start justify-between gap-[16px]">
                    <pre className={`text-[14px] leading-[20px] font-medium font-mono select-all m-0 overflow-x-auto whitespace-pre ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}>
                      {componentsJsonText}
                    </pre>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(componentsJsonText, 'cmd-json')}
                      className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                        isDark
                          ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                          : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                      }`}
                    >
                      {copiedId === 'cmd-json' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 1. Install */}
                <div className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}>
                  <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                    isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                  }`}>
                    Install
                  </p>
                  <div className="flex items-center justify-between gap-[16px]">
                    <code className={`text-[14px] leading-[20px] font-medium font-mono select-all truncate ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}>
                      npm i @subhanhq/amicro
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npm i @subhanhq/amicro', 'cmd-npm')}
                      className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                        isDark
                          ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                          : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                      }`}
                    >
                      {copiedId === 'cmd-npm' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* 2. Initialize */}
                <div className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}>
                  <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                    isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                  }`}>
                    Initialize
                  </p>
                  <div className="flex items-center justify-between gap-[16px]">
                    <code className={`text-[14px] leading-[20px] font-medium font-mono select-all truncate ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}>
                      npx @subhanhq/amicro@latest init
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npx @subhanhq/amicro@latest init', 'cmd-init')}
                      className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                        isDark
                          ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                          : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                      }`}
                    >
                      {copiedId === 'cmd-init' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* 3. Add component */}
                <div className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}>
                  <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                    isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                  }`}>
                    Add component
                  </p>
                  <div className="flex items-center justify-between gap-[16px]">
                    <code className={`text-[14px] leading-[20px] font-medium font-mono select-all truncate ${
                      isDark ? 'text-white/80' : 'text-neutral-700'
                    }`}>
                      npx @subhanhq/amicro@latest add download-button
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npx @subhanhq/amicro@latest add download-button', 'cmd-add')}
                      className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                        isDark
                          ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                          : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                      }`}
                    >
                      {copiedId === 'cmd-add' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footnote under the shell */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[14px] leading-[20px]">
          <p className="text-neutral-500 m-0">
            Registry resolves from amicro.vercel.app.
          </p>
          <a
            href="https://amicro.vercel.app/r/download-button.json"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer flex-shrink-0 items-center justify-center gap-[5px] text-blue-600 hover:text-blue-700 font-medium no-underline transition-colors focus:outline-none"
          >
            <span>View registry</span>
            <span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
                <path d="M11.9985 4L4 11.9985M11.9985 4L4.00146 4.00146M11.9985 4L12 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* Sponsors Section preserved */}
      {sponsors && sponsors.length > 0 && (
        <div className="mt-16">
          <SponsorSection
            theme={theme}
            sponsors={sponsors}
            checkoutUrl={checkoutUrl || "https://buy.polar.sh/polar_cl_1sD84lka9aX34JuZpm6ACJxGQPMjiBGQCtfRo1RSfGh"}
            onNavigateSponsors={onNavigateSponsors}
            triggerHaptic={triggerHaptic}
          />
        </div>
      )}
    </div>
  );
}
