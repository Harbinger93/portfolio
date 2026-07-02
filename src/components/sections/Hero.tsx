import React, { useState, useEffect, Suspense } from 'react';
import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
const DotField = React.lazy(() => import('../ui/DotField'));
const ColorBends = React.lazy(() => import('../ui/ColorBends'));
import { ArrowUpRight } from 'lucide-react';
import { AuroraText } from '../ui/aurora-text';
import { RainbowButton } from '../ui/rainbow-button';

export default function Hero() {
  const { t } = useI18n();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable heavy WebGL animations on desktop to preserve mobile battery/performance
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const titleText = t('hero.title');
  const hasAmpersand = titleText.includes('&');
  const titleLine1 = hasAmpersand ? titleText.split('&')[0].trim() : titleText;
  const titleLine2 = hasAmpersand ? `& ${titleText.split('&')[1].trim()}` : '';

  return (
    <section id="home" className="w-full bg-[var(--bg-primary)] relative min-h-[70vh] md:min-h-[75vh] flex items-end justify-center pt-24 pb-0 overflow-hidden">
      
      {/* Background effects from ReactBits - Conditionally loaded only on Desktop */}
      <div className="absolute inset-0 z-0 pointer-events-auto hidden md:block">
        {isDesktop && (
          <Suspense fallback={null}>
            <ColorBends 
              className="absolute inset-0 w-full h-full"
              colors={['#3B82F6', '#1E3A8A', '#0F172A']} // Using arrays for colors as requested by the component
              speed={0.2}
              frequency={1.0}
              noise={0.15}
              bandWidth={0.14}
              rotation={90}
              iterations={1}
              intensity={1.3}
            />
            <DotField 
              className="absolute inset-0 w-full h-full mix-blend-screen"
            />
          </Suspense>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-20 flex flex-col md:flex-row items-end justify-between gap-0 h-full">
        
        {/* Left Column: Text content */}
        <div className="flex-1 flex flex-col items-start text-left z-20 pb-4 md:pb-12 pt-10 md:pt-24">
          
          {/* Availability / Status */}
          <ScrollReveal>
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
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight leading-[1.05] text-[var(--text-primary)] uppercase">
              {t('hero.name')}
            </h1>
            <h2 className="text-lg md:text-3xl font-light tracking-wide mb-6 leading-tight">
              <AuroraText>
                {titleLine1}
                {hasAmpersand && (
                  <>
                    <br />
                    {titleLine2}
                  </>
                )}
              </AuroraText>
            </h2>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal>
            <p className="text-[var(--text-secondary)] text-sm md:text-lg leading-relaxed max-w-xl mb-8 md:mb-12">
              {t('hero.subtitle')}
            </p>
          </ScrollReveal>

          {/* Action Area */}
          <ScrollReveal>
            <RainbowButton 
              variant="default" 
              asChild 
              className="rounded-full px-8 py-6 text-sm md:text-base hover:scale-105 active:scale-95 transition-transform duration-300 font-semibold cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.15)]"
            >
              <a href="#contact" className="flex items-center gap-2.5">
                Quiero digitalizar mi negocio
                <ArrowUpRight className="w-5 h-5 text-[var(--accent-primary)] animate-pulse" />
              </a>
            </RainbowButton>
          </ScrollReveal>

          {/* Badges / Stats below */}
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 md:gap-4 mt-10 md:mt-16 text-[10px] md:text-sm">
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)] flex items-center gap-2">
                <span className="font-bold text-[var(--text-primary)]">7+</span> {t('hero.badge1')}
              </div>
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl glass border border-[var(--glass-border)] text-[var(--text-secondary)]">
                {t('hero.badge3')}
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Right Column: Avatar Image */}
        <div className="flex-1 relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[620px] xl:h-[720px] w-full mt-4 md:mt-0 flex justify-center items-end self-end">
          <ScrollReveal className="relative z-20 w-full h-full flex justify-center items-end">
            <div className="group relative w-full h-full flex justify-center items-end">
              {/* Clean crisp foreground portrait image */}
              <picture className="relative z-20 h-full max-h-full drop-shadow-2xl flex justify-center items-end">
                <source media="(max-width: 768px)" srcSet="/avatar-mobile.webp" />
                <img 
                  src="/avatar.webp" 
                  alt="Gabriel Vazquez" 
                  width={700}
                  height={925}
                  loading="eager"
                  fetchPriority="high"
                  className="object-contain h-full max-h-full object-bottom block"
                />
              </picture>
            </div>
          </ScrollReveal>
          {/* Decorative sphere behind avatar */}
          <div className="absolute bottom-10 md:bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-64 md:h-64 rounded-full bg-[var(--accent-primary)]/10 md:bg-[var(--accent-primary)]/20 md:blur-xl border border-[var(--glass-border)] z-10 md:shadow-inner md:mix-blend-overlay"></div>
        </div>
        </div>
    </section>
  );
}
