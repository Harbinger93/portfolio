import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { ChevronDown, HelpCircle } from 'lucide-react';
import GlowCard from '../ui/GlowCard';

export default function Faqs() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    { qKey: 'faqs.q1', aKey: 'faqs.a1' },
    { qKey: 'faqs.q2', aKey: 'faqs.a2' },
    { qKey: 'faqs.q3', aKey: 'faqs.a3' },
    { qKey: 'faqs.q4', aKey: 'faqs.a4' },
    { qKey: 'faqs.q5', aKey: 'faqs.a5' },
  ];

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="py-24 relative z-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent-primary)] blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
              {t('faqs.subtitle')}
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] max-w-2xl leading-tight mb-4">
              {t('faqs.title')}
            </h2>
            <p className="text-[var(--text-secondary)] md:text-base max-w-xl">
              {t('faqs.desc')}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <GlowCard 
                  key={index} 
                  className={`border border-[var(--glass-border)] rounded-2xl overflow-hidden transition-all duration-300 bg-[var(--bg-secondary)]/40 backdrop-blur-md ${
                    isOpen ? 'border-[var(--accent-primary)]/40 shadow-[0_0_20px_rgba(0,242,254,0.05)]' : 'hover:border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isOpen ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]/70'}`} />
                      <span className={`text-sm font-extrabold text-[var(--text-primary)] leading-snug transition-colors duration-300 ${isOpen ? 'text-gradient' : ''}`}>
                        {t(item.qKey as any)}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-glass-border flex items-center justify-center shrink-0 transition-all duration-300 bg-white/[0.01] hover:bg-white/[0.05] ${isOpen ? 'rotate-180 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 border-t border-[var(--glass-border)]/45' : 'max-h-0 opacity-0 pointer-events-none'
                    } overflow-hidden`}
                  >
                    <div className="p-6 text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed bg-white/[0.01]">
                      {t(item.aKey as any)}
                    </div>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
