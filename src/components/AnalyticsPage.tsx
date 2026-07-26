import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ArrowLeft, Terminal, Cpu, Code2, Globe, Rocket, HelpCircle, AlertCircle } from 'lucide-react';

interface AnalyticsPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
}

type PackageManager = 'npm' | 'yarn' | 'pnpm';
type Framework = 'nextjs' | 'vite' | 'remix' | 'astro';

export function AnalyticsPage({ theme, onNavigateHome }: AnalyticsPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [packageManager, setPackageManager] = useState<PackageManager>('npm');
  const [selectedFramework, setSelectedFramework] = useState<Framework>('nextjs');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(id);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };

  const isDark = theme === 'dark';

  const installCommands: Record<PackageManager, string> = {
    npm: 'npm i @vercel/analytics',
    yarn: 'yarn add @vercel/analytics',
    pnpm: 'pnpm add @vercel/analytics',
  };

  const codeSample = `import { Analytics } from "@vercel/analytics/next"`;

  const frameworks = [
    { id: 'nextjs', name: 'Next.js', active: true },
    { id: 'vite', name: 'Vite / React', active: false, label: 'Coming Soon' },
    { id: 'remix', name: 'Remix', active: false, label: 'Coming Soon' },
    { id: 'astro', name: 'Astro', active: false, label: 'Coming Soon' },
  ];

  return (
    <div className={`relative w-full min-h-dvh flex flex-col font-sans antialiased transition-colors duration-300 ${isDark ? 'bg-[#121212] text-[#ffffff] selection:bg-neutral-850' : 'bg-[#f8f9fa] text-black selection:bg-neutral-200'}`}>
      
      {/* Breadcrumb Navbar */}
      <div className="w-full max-w-[1240px] mx-auto px-6 pt-6">
        <button 
          onClick={onNavigateHome}
          className={`flex items-center gap-2 text-[13px] font-medium transition-colors cursor-pointer border-0 bg-transparent p-0 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Components
        </button>
      </div>

      <div className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-6 flex flex-col items-center">
        
        {/* Centered Hero Section */}
        <div className="mt-12 mb-12 text-center w-full flex flex-col items-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium mb-6 border ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'
          }`}>
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Vercel Analytics Integration</span>
          </div>

          <h1 className={`text-[42px] sm:text-[62px] font-bold leading-[1.1] tracking-tight mb-4 font-sans transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
            Get Started
          </h1>
          
          <p className={`text-[16px] sm:text-[18px] leading-[26px] max-w-[550px] transition-colors duration-300 ${isDark ? 'text-[#a3a3a3]' : 'text-neutral-600'}`}>
            To start counting visitors and page views, follow these steps.
          </p>
        </div>

        {/* Framework Selector Tabs */}
        <div className="w-full max-w-[700px] mb-10">
          <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${
            isDark ? 'bg-neutral-900/50 border-neutral-850' : 'bg-neutral-200/40 border-neutral-200'
          }`}>
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => framework.active && setSelectedFramework(framework.id as Framework)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer border-0 bg-transparent ${
                  !framework.active 
                    ? 'opacity-40 cursor-not-allowed text-neutral-500' 
                    : selectedFramework === framework.id
                      ? (isDark ? 'text-white' : 'text-black')
                      : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                }`}
              >
                {selectedFramework === framework.id && (
                  <motion.div
                    layoutId="activeFramework"
                    className={`absolute inset-0 rounded-lg shadow-sm -z-10 ${
                      isDark ? 'bg-neutral-800' : 'bg-white'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{framework.name}</span>
                {framework.label && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-neutral-950 text-neutral-400' : 'bg-neutral-300/50 text-neutral-650'
                  }`}>
                    {framework.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Integration Steps */}
        <div className="w-full max-w-[700px] flex flex-col gap-12 mb-24">
          
          {/* Step 1: Install Package */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-[14px] font-bold ${
                isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-black'
              }`}>
                1
              </span>
              <h3 className="text-[18px] font-bold tracking-tight">Install our package</h3>
            </div>
            
            <p className={`text-[14.5px] leading-relaxed pl-11 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Start by installing <code className="px-1.5 py-0.5 rounded font-mono text-[13px] bg-neutral-200/50 dark:bg-neutral-800 text-emerald-500 font-semibold">@vercel/analytics</code> in your existing project.
            </p>

            <div className="pl-11 flex flex-col gap-3">
              {/* Package Manager selector */}
              <div className="flex gap-2">
                {(['npm', 'yarn', 'pnpm'] as PackageManager[]).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPackageManager(pm)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer border transition-colors ${
                      packageManager === pm
                        ? (isDark ? 'bg-white border-white text-black' : 'bg-neutral-950 border-neutral-950 text-white')
                        : (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black')
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              {/* Install Code Terminal */}
              <div className={`relative flex items-center justify-between gap-4 p-4 pl-5 rounded-xl border font-mono ${
                isDark ? 'bg-[#181818] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-black'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>$</span>
                  <code className="text-[13.5px] font-mono text-emerald-400">{installCommands[packageManager]}</code>
                </div>
                <button 
                  onClick={() => copyToClipboard(installCommands[packageManager], 'install-cmd')}
                  className={`p-2 rounded-lg cursor-pointer border-0 transition-colors ${
                    isDark ? 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                  }`}
                  aria-label="Copy installation command"
                >
                  {copiedText === 'install-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Add Component */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-[14px] font-bold ${
                isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-black'
              }`}>
                2
              </span>
              <h3 className="text-[18px] font-bold tracking-tight">Add the React component</h3>
            </div>
            
            <p className={`text-[14.5px] leading-relaxed pl-11 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Import and use the <code className="px-1.5 py-0.5 rounded font-mono text-[13px] bg-neutral-200/50 dark:bg-neutral-800 text-blue-500 dark:text-blue-400 font-semibold">&lt;Analytics/&gt;</code> React component into your app's layout.
            </p>

            <div className="pl-11 flex flex-col gap-4">
              {/* Code window */}
              <div className={`relative rounded-xl border flex flex-col overflow-hidden ${
                isDark ? 'bg-[#181818] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                {/* Window header */}
                <div className={`flex items-center justify-between px-4 py-2 border-b text-[12px] font-medium font-sans ${
                  isDark ? 'bg-[#1e1e1e] border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    <span className="ml-2 font-mono text-[11px]">app/layout.tsx</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(codeSample, 'code-sample')}
                    className={`p-1.5 rounded transition-colors border-0 bg-transparent flex items-center gap-1 ${
                      isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-black'
                    }`}
                  >
                    {copiedText === 'code-sample' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Code area */}
                <div className="p-4 overflow-x-auto font-mono text-[13.5px] leading-relaxed">
                  <pre className="m-0">
                    <span className="text-[#e06c75] dark:text-[#ff7b72]">import</span>{' '}
                    <span className="text-[#abb2bf] dark:text-[#c9d1d9]">{'{'}</span>{' '}
                    <span className="text-[#e5c07b] dark:text-[#79c0ff]">Analytics</span>{' '}
                    <span className="text-[#abb2bf] dark:text-[#c9d1d9]">{'}'}</span>{' '}
                    <span className="text-[#e06c75] dark:text-[#ff7b72]">from</span>{' '}
                    <span className="text-[#98c379] dark:text-[#a5d6ff]">"@vercel/analytics/next"</span>
                  </pre>
                </div>
              </div>

              {/* Documentation reference banner */}
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                isDark ? 'bg-blue-950/20 border-blue-900/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-[13.5px] leading-relaxed">
                  For full examples and further reference, please refer to our{' '}
                  <a 
                    href="https://vercel.com/docs/analytics" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-bold underline hover:opacity-80 transition-opacity"
                  >
                    documentation
                  </a>.
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Deploy & Visit */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-[14px] font-bold ${
                isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-black'
              }`}>
                3
              </span>
              <h3 className="text-[18px] font-bold tracking-tight">Deploy & Visit your Site</h3>
            </div>
            
            <p className={`text-[14.5px] leading-relaxed pl-11 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Deploy your changes and visit the deployment to collect your page views.
            </p>

            <div className="pl-11 flex flex-col gap-4">
              {/* Premium listening card */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'bg-[#181818] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Listening for events...</h4>
                    <p className={`text-[12px] m-0 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Visit your live app to generate page view activity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDark ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    Live Check
                  </span>
                </div>
              </div>

              {/* Warning/Content blocker notice */}
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                isDark ? 'bg-amber-950/20 border-amber-900/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-[13px] leading-relaxed">
                  If you don't see data after 30 seconds, please check for content blockers and try to navigate between pages on your site.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
