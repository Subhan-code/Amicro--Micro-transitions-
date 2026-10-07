import React, { useState } from 'react';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { SponsorSection, SponsorItem } from './SponsorSection';

interface SkillsPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  sponsors?: SponsorItem[];
  checkoutUrl?: string;
  onNavigateSponsors?: () => void;
}

interface SkillItem {
  id: string;
  title: string;
  command: string;
  isCommand: boolean;
}

const ALL_SKILLS: SkillItem[] = [
  {
    id: 'main-skill',
    title: 'Main Skill Setup',
    command: 'npx skills add Subhan-code/Amicro--Micro-transitions-',
    isCommand: true,
  },
  {
    id: 'design-system',
    title: 'Design System Add-on',
    command: 'npx skills add Subhan-code/Amicro--Micro-transitions- -s amicro-design-system',
    isCommand: true,
  },
  {
    id: 'prompt-dropdowns',
    title: 'Dropdowns Prompt',
    command: 'Update dropdowns transition based on amicro-design-system skill',
    isCommand: false,
  },
  {
    id: 'prompt-icon-swaps',
    title: 'Icon Swaps Prompt',
    command: 'Update all icon swap transitions based on amicro-design-system skill',
    isCommand: false,
  },
  {
    id: 'prompt-modals',
    title: 'Modals Prompt',
    command: 'Update all modals transitions based on amicro-design-system skill',
    isCommand: false,
  },
];

export function SkillsPage({ theme, sponsors, checkoutUrl, onNavigateSponsors }: SkillsPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'commands'>('all');
  const { trigger: triggerHaptic } = useWebHaptics();

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

  const displayedSkills = activeTab === 'commands'
    ? ALL_SKILLS.filter((item) => item.isCommand)
    : ALL_SKILLS;

  const isDark = theme === 'dark';

  return (
    <div className={`w-full min-h-dvh pb-24 transition-colors select-none ${
      isDark ? 'bg-[#08080a] text-[#ededed] selection:bg-neutral-800' : 'bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200'
    }`}>
      {/* Header, left-aligned */}
      <section className="w-full max-w-[960px] mx-auto px-4 sm:px-6 pt-16 pb-6">
        <div className="flex w-full flex-col gap-[4px]">
          <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
            isDark ? 'text-white/40' : 'text-neutral-500'
          }`}>
            Agent context
          </p>
          <h1 className={`text-[24px] leading-[30px] font-semibold tracking-[-0.6px] m-0 ${
            isDark ? 'text-[#fafafa]' : 'text-neutral-900'
          }`}>
            Skills
          </h1>
        </div>

        {/* Segmented control under the title */}
        <div className="mt-4 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer border-0 ${
              activeTab === 'all'
                ? isDark
                  ? 'bg-white/[0.08] text-[#fafafa]'
                  : 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60'
                : isDark
                  ? 'bg-transparent text-[#a3a3a3] hover:text-white'
                  : 'bg-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Setup &amp; Prompts
          </button>
          
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('commands');
            }}
            className={`px-3 py-1.5 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer border-0 ${
              activeTab === 'commands'
                ? isDark
                  ? 'bg-white/[0.08] text-[#fafafa]'
                  : 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60'
                : isDark
                  ? 'bg-transparent text-[#a3a3a3] hover:text-white'
                  : 'bg-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Commands
          </button>
        </div>
      </section>

      {/* Skills Block Shell */}
      <section className="w-full max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Shell */}
        <div className={`relative overflow-hidden rounded-[16px] outline -outline-offset-1 ${
          isDark ? 'outline-white/[0.03]' : 'outline-black/[0.04]'
        }`}>
          {/* Grid inside shell */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedSkills.map((card) => (
              <div
                key={card.id}
                className={`relative flex flex-col gap-[20px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[20px] transition-colors ${
                  isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                    : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                }`}
              >
                {/* Title */}
                <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
                  isDark ? 'text-[#f5f5f5]' : 'text-neutral-900'
                }`}>
                  {card.title}
                </p>

                {/* Command + Ghost Copy Button */}
                <div className="flex items-center justify-between gap-[16px] mt-auto">
                  <p className={`text-[14px] leading-[20px] font-medium font-mono line-clamp-2 select-all m-0 ${
                    isDark ? 'text-white/80' : 'text-neutral-700'
                  }`}>
                    {card.command}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(card.command, card.id)}
                    className={`h-[36px] shrink-0 rounded-[8px] px-[16px] text-[14px] leading-[18px] font-medium transition-colors flex items-center justify-center cursor-pointer border-0 ${
                      isDark
                        ? 'bg-white/[0.08] text-[#fafafa] hover:bg-white/[0.14]'
                        : 'bg-black/[0.05] text-neutral-800 hover:bg-black/[0.10]'
                    }`}
                  >
                    {copiedId === card.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footnote under the shell */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[14px] leading-[20px]">
          <p className="text-neutral-500 m-0">
            Skills install into your agent, not your app bundle.
          </p>
          <a
            href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer flex-shrink-0 items-center justify-center gap-[5px] text-blue-600 hover:text-blue-700 font-medium no-underline transition-colors focus:outline-none"
          >
            <span>View on GitHub</span>
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
            checkoutUrl={checkoutUrl || "https://polar.sh/checkout/polar_c_aJ9w76csnccSI8uNxJ6rIopDFzVFJkzobaGNC17YNtS"}
            onNavigateSponsors={onNavigateSponsors}
            triggerHaptic={triggerHaptic}
          />
        </div>
      )}
    </div>
  );
}
