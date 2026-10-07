import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SponsorFAQProps {
  isDark?: boolean;
}

export const SponsorFAQ: React.FC<SponsorFAQProps> = ({ isDark = true }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the slot placement on Amicro work?',
      a: 'Slots are reserved on a monthly basis. Premier sponsors occupy top-tier slots alongside our headline partner Vercel. Gold and Silver slots occupy the featured tiers below. Once booked, your logo and link go live immediately across documentation and showcase pages.',
    },
    {
      q: 'Can we change our logo, link, or slogan during the sponsorship term?',
      a: 'Yes, absolutely. Sponsors have access to update assets, UTM links, or announcements anytime by reaching out to our core team.',
    },
    {
      q: 'What audience will our brand reach on Amicro?',
      a: 'Over 85% of Amicro visitors are active frontend engineers, full-stack builders, design engineers, and technical founders looking for developer tooling, cloud infrastructure, UI component registries, and hosting solutions.',
    },
    {
      q: 'How are payments handled, and do you provide invoices for corporate accounting?',
      a: 'Sponsorship payments support all major global credit/debit cards, Apple Pay, Google Pay, UPI, and multi-currency localized checkout with full automated tax and VAT receipts.',
    },
  ];

  return (
    <section
      className={`w-full max-w-3xl mx-auto px-0 py-14 sm:py-18 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'
        }`}
    >
      <div className="text-center mb-8">

        <h2
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'
            }`}
        >
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-colors overflow-hidden ${isDark
                  ? 'bg-[#111114] border-zinc-800/80'
                  : 'bg-white border-zinc-200 shadow-none'
                }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`w-full px-5 py-4 flex items-center justify-between text-left text-sm font-medium transition-colors cursor-pointer ${isDark
                    ? 'text-white hover:text-zinc-200'
                    : 'text-zinc-950 hover:text-black'
                  }`}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''
                    } ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
                />
              </button>

              {isOpen && (
                <div
                  className={`px-5 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 ${isDark
                      ? 'text-zinc-400 border-zinc-800/40'
                      : 'text-zinc-600 border-zinc-100'
                    }`}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
