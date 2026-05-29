import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import AuroraBackground from '../ui/AuroraBackground';
import { ArrowUpRight, Play } from 'lucide-react';
import { GooeyInput } from '../ui/gooey-input';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="home"
      className="min-h-screen flex items-end justify-center pt-24 relative z-10 overflow-hidden"
    >
      {/* Animated Aurora Background */}
      <AuroraBackground />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-end justify-between gap-12 h-full">
        
        {/* Left Column: Text content */}
        <div className="flex-1 flex flex-col items-start text-left z-20 pb-4 md:pb-20 pt-10 md:pt-32">
          
          {/* Availability / Status */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="mb-6 md:mb-8">
              <p className="text-xs md:text-base text-[var(--text-primary)] font-medium">
                Currently Available For Freelance
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs md:text-base text-[var(--text-secondary)]">Worldwide</span>
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-[var(--text-secondary)]" />
              </div>
              <div className="h-[1px] w-32 md:w-48 bg-[var(--glass-border)] mt-4"></div>
            </div>
          </ScrollReveal>

          {/* Main Title */}
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight leading-[1.05] text-[var(--text-primary)] uppercase">
              {t('hero.name')}
            </h1>
            <h2 className="text-lg md:text-3xl font-light text-gradient uppercase tracking-wide mb-6">
              {t('hero.title')}
            </h2>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-[var(--text-secondary)] text-sm md:text-lg leading-relaxed max-w-xl mb-8 md:mb-12">
              {t('hero.subtitle')}
            </p>
          </ScrollReveal>

          {/* Action Area */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex items-center gap-8">
              <div className="relative">
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -left-12 -top-4 text-[var(--text-secondary)] w-8 h-12 opacity-50 hidden md:block">
                  <path d="M10 10 Q30 30 10 50" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M5 45 L10 50 L15 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                <a href="#projects" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-[var(--text-primary)] flex items-center justify-center group-hover:bg-[var(--text-primary)] transition-colors duration-300">
                    <Play className="w-4 h-4 md:w-6 md:h-6 text-[var(--text-primary)] group-hover:text-[var(--bg-primary)] fill-current transition-colors duration-300" />
                  </div>
                  <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-[var(--text-primary)]">
                    Work<br/>Process
                  </span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Badges / Stats below */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="flex flex-wrap gap-3 md:gap-4 mt-10 md:mt-16 text-[10px] md:text-sm">
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)] flex items-center gap-2">
                <span className="font-bold text-[var(--text-primary)]">7+</span> {t('hero.badge1')}
              </div>
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)]">
                {t('hero.badge2')}
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Right Column: Avatar Image */}
        <div className="flex-1 relative h-[45vh] md:h-full w-full mt-4 md:mt-0 flex justify-center items-end self-end">
          <ScrollReveal direction="up" delay={0.3} className="relative z-20 w-full h-full flex justify-center items-end">
            <img 
              src="/avatar.png" 
              alt="Gabriel Vazquez" 
              className="object-contain h-full md:max-h-[85vh] drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-500 object-bottom"
            />
          </ScrollReveal>
          {/* Decorative sphere behind avatar */}
          <div className="absolute bottom-10 md:bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-64 md:h-64 rounded-full bg-black/50 blur-xl border border-white/5 z-10 shadow-inner mix-blend-overlay"></div>
        </div>

        {/* Project search bar inside Hero */}
        <ScrollReveal direction="up" delay={0.6}>
          <div className="flex justify-center mb-10 relative z-50">
            <GooeyInput placeholder="Search projects..." />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
