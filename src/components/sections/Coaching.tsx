import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { aboutCards } from '../../config/data';
import { CheckCircle, Target, Users, ThumbsUp, Calendar, TrendingUp, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  CheckCircle,
  Target,
  Users,
  ThumbsUp,
  Calendar,
  TrendingUp,
};

export default function Coaching() {
  const { t, locale } = useI18n();
  const currentCards = aboutCards[locale];

  return (
    <section id="coaching" className="py-24 relative z-10 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-3">
            {t('coaching.subtitle')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-16 leading-tight max-w-xl">
            {t('coaching.title')}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCards.map((card, i) => {
            const Icon = iconMap[card.icon] || CheckCircle;
            return (
              <ScrollReveal key={card.titleKey} direction="up" delay={i * 0.1}>
                <div className="p-6 rounded-2xl glass hover:border-[var(--accent-primary)] transition-colors group h-full">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--glass-border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {t(card.descKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
