import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ExternalLink, ArrowRight, ShieldCheck, Zap, Award, CheckCircle2, Globe, ArrowUpRight } from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';

export interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  siteUrl?: string;
  isAvailable: boolean;
}

interface SponsorsPageProps {
  theme: 'dark' | 'light';
  sponsors: SponsorSlot[];
  checkoutUrl: string;
  onNavigateHome: () => void;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({
  theme,
  sponsors,
  checkoutUrl,
  onNavigateHome,
}) => {
  const { trigger: triggerHaptic } = useWebHaptics();
  const isDark = theme === 'dark';

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
      
      {/* Hero Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
      >
        <Heart className="w-3.5 h-3.5 fill-emerald-400" />
        <span>Support Open Source</span>
      </motion.div>

      {/* Title & Subtitle */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center max-w-2xl mb-12"
      >
        <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          Sponsor Amicro
        </h1>
        <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Put your brand in front of thousands of developers, designers, and engineers exploring modern web micro-interactions.
        </p>
      </motion.div>

      {/* Grid of Sponsors */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {sponsors.map((slot, index) => {
          if (!slot.isAvailable) {
            return (
              <motion.a
                key={slot.id}
                href={slot.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => triggerHaptic('light')}
                className={`group relative p-6 rounded-[24px] transition-all duration-300 flex flex-col justify-between min-h-[160px] ${
                  isDark
                    ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020] text-white'
                    : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'
                }`}
              >
                <div className="flex items-start justify-between">
                  {slot.logoType === 'ossium' ? (
                    <div className="flex items-center gap-2 font-bold text-base tracking-tight">
                      <img
                        src="https://ossium.live/_next/image?url=%2Fossium_logo.webp&w=256&q=75"
                        alt="Ossium Logo"
                        className="w-6 h-6 object-contain rounded-md"
                      />
                      <span className={`font-extrabold text-lg ${isDark ? 'text-white' : 'text-black'}`}>Ossium</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 font-bold text-base text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{slot.companyName}</span>
                    </div>
                  )}

                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
                    isDark ? 'bg-white/5 border-white/10 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                  }`}>
                    <span>Active Partner</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                <p className={`text-sm mt-4 font-normal leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {slot.description}
                </p>
              </motion.a>
            );
          } else {
            return (
              <motion.button
                key={slot.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  triggerHaptic('medium');
                  window.open(checkoutUrl, '_blank');
                }}
                className={`group relative p-6 rounded-[24px] border border-dashed text-left flex flex-col justify-between min-h-[160px] cursor-pointer transition-all duration-300 ${
                  isDark
                    ? 'border-white/15 hover:border-emerald-500/60 bg-[#181818] hover:bg-[#202020] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                    : 'border-neutral-300 hover:border-emerald-500/60 bg-white hover:bg-neutral-50 text-black shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                      +
                    </span>
                    <span>Available Slot #{slot.id}</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    $49 / month
                  </span>
                </div>

                <div className="mt-4">
                  <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Featured logo placement, custom link, and high-visibility exposure across Amicro documentation & components.
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-3 group-hover:translate-x-1 transition-transform">
                    <span>Reserve Sponsor Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.button>
            );
          }
        })}
      </div>

      {/* Sponsorship Perks Section */}
      <div className={`w-full max-w-4xl p-8 sm:p-10 rounded-3xl border ${
        isDark ? 'bg-[#121215] border-white/10' : 'bg-white border-neutral-200 shadow-xl'
      }`}>
        <h3 className={`text-xl font-bold tracking-tight mb-6 text-center ${isDark ? 'text-white' : 'text-black'}`}>
          Why Sponsor Amicro?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>High Reach</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Over 50,000+ monthly developer impressions from frontend engineers & product teams.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Open Source Impact</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Directly fund independent open source UI component development and maintenance.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Instant Setup</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Automated Polar checkout updates your logo & backlink on the live platform immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
