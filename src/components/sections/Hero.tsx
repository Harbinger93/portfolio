import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import AuroraBackground from '../ui/AuroraBackground';
import { GooeyInput } from '../ui/gooey-input';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-32 pb-16 relative z-10 overflow-hidden"
    >
      {/* Animated Aurora Background */}
      <AuroraBackground />

      <div className="max-w-4xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Avatar badge */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-3 glass border border-[var(--glass-border)] rounded-full py-2 px-4 mb-8 glass-hover">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-glow"></div>
            <span className="text-sm text-[var(--text-secondary)] font-medium">
              {t('hero.greeting')} <span className="text-[var(--text-primary)]">{t('hero.name')}</span>
            </span>
          </div>
        </ScrollReveal>

        {/* Main Title */}
        <ScrollReveal direction="up" delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] text-[var(--text-primary)]">
            <span className="block text-gradient">
              {t('hero.title')}
            </span>
          </h1>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal direction="up" delay={0.3}>
          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </p>
        </ScrollReveal>

        {/* Buttons */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a href="#projects">
              <button className="px-8 py-3 rounded-full bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(125,211,252,0.3)]">
                {t('hero.cta.projects')}
              </button>
            </a>
            <a href="#contact">
              <button className="px-8 py-3 rounded-full glass border border-[var(--glass-border)] text-[var(--text-primary)] font-medium hover:bg-glass-hover transition-colors">
                {t('hero.cta.contact')}
              </button>
            </a>
          </div>
        </ScrollReveal>

        {/* Badges / Stats below */}
        <ScrollReveal direction="up" delay={0.5}>
          <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm mb-16">
            <div className="px-4 py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)] flex items-center gap-2">
              <span className="font-bold text-[var(--text-primary)]">7+</span> {t('hero.badge1')}
            </div>
            <div className="px-4 py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)]">
              {t('hero.badge2')}
            </div>
            <div className="px-4 py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)]">
              {t('hero.badge3')}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.6}>
          <div className="flex justify-center mb-10 relative z-50">
            <GooeyInput placeholder="Search projects..." />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

