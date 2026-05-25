import { useI18n } from '../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { Quote } from 'lucide-react';

export default function Coaching() {
  const { t } = useI18n();

  return (
    <section id="coaching" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
            {t('coaching.subtitle')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-slate-150 mb-12">
            {t('coaching.title')}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <div className="relative glass rounded-2xl p-8 md:p-10 border-l-2 border-ice-300/30">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-ice-300/10" />
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                {t('coaching.desc')}
              </p>
              <div className="mt-6 pt-6 border-t border-glass-border">
                <p className="text-xs uppercase tracking-wider text-ice-300">
                  INDELSER — 2021
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Certified Ontological Coach
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
