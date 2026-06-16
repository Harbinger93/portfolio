import { useEffect, useState, useRef } from 'react';
import { useI18n } from '../../i18n/context';
import { Home, FileImage, Gauge, Radar } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ToolsLaunchpad() {
  const { locale } = useI18n();
  const [currentPath, setCurrentPath] = useState('');
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(false);
  const [isTooltipFading, setIsTooltipFading] = useState(false);
  const [isLaunchpadVisible, setIsLaunchpadVisible] = useState(true);
  const [bottomOffset, setBottomOffset] = useState(24);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    handlePathChange();
    document.addEventListener('astro:page-load', handlePathChange);
    
    return () => {
      document.removeEventListener('astro:page-load', handlePathChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (window.location.pathname === '/') {
        // Show after scrolling 40% of viewport height
        const threshold = window.innerHeight * 0.4;
        if (window.scrollY > threshold) {
          setIsLaunchpadVisible(true);
        } else {
          setIsLaunchpadVisible(false);
        }
      } else {
        setIsLaunchpadVisible(true);
      }

      // Calculate collision with footer to prevent overlapping
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        if (footerRect.top < viewportHeight) {
          const overlap = viewportHeight - footerRect.top;
          setBottomOffset(24 + overlap);
        } else {
          setBottomOffset(24);
        }
      } else {
        setBottomOffset(24);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial check and timeouts for layout shifts after page load/navigation
    handleScroll();
    const t1 = setTimeout(handleScroll, 100);
    const t2 = setTimeout(handleScroll, 500);

    document.addEventListener('astro:page-load', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('astro:page-load', handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isLaunchpadVisible) {
      setShowWelcomeTooltip(false);
      return;
    }

    const hasSeen = sessionStorage.getItem('has_seen_tools_tooltip');
    if (hasSeen) return;

    // Show tooltip after a short delay on first visit/scroll visible
    const timerShow = setTimeout(() => {
      setShowWelcomeTooltip(true);
    }, 1000);

    // Fade out after 4.5 seconds
    const timerFade = setTimeout(() => {
      setIsTooltipFading(true);
    }, 5000);

    // Remove from DOM
    const timerRemove = setTimeout(() => {
      setShowWelcomeTooltip(false);
      sessionStorage.setItem('has_seen_tools_tooltip', 'true');
    }, 5500);

    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerFade);
      clearTimeout(timerRemove);
    };
  }, [isLaunchpadVisible]);

  const launchpadItems = [
    {
      id: 'home',
      href: '/',
      labelEs: 'Inicio',
      labelEn: 'Home',
      Icon: Home
    },
    {
      id: 'optimizer',
      href: '/herramientas/optimizador',
      labelEs: 'Optimizador',
      labelEn: 'Optimizer',
      Icon: FileImage
    },
    {
      id: 'analyzer',
      href: '/herramientas/analizador',
      labelEs: 'Analizador Web',
      labelEn: 'Web Analyzer',
      Icon: Gauge
    },
    {
      id: 'radar',
      href: '/herramientas/radar',
      labelEs: 'Radar (Dólar/Bs)',
      labelEn: 'Radar (Rates)',
      Icon: Radar
    }
  ];

  return (
    <div 
      ref={containerRef}
      style={{ bottom: `${bottomOffset}px` }}
      className={cn(
        "fixed left-0 right-0 w-full flex justify-center z-50 pointer-events-none transition-[opacity,transform] duration-500 ease-out",
        isLaunchpadVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
    >
      <div className="relative bg-[var(--glass-bg)]/80 border border-glass-border backdrop-blur-xl px-4 py-2.5 rounded-full flex gap-3 items-center shadow-lg border-white/5 pointer-events-auto">
        
        {/* Welcome Tools Tooltip */}
        {showWelcomeTooltip && (
          <div 
            className={cn(
              "absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-black bg-gradient-to-r from-[var(--accent-primary)] to-teal-400 rounded-xl shadow-[0_0_15px_rgba(0,242,254,0.4)] border border-[var(--accent-primary)]/20 transition-all duration-500 z-50 flex items-center gap-1.5 select-none pointer-events-none",
              isTooltipFading ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0 animate-bounce"
            )}
          >
            <span>{locale === 'es' ? 'Herramientas' : 'Tools'}</span>
            <span className="animate-[pulse_1s_infinite]">🛠️</span>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-teal-400" />
          </div>
        )}

        {launchpadItems.map((item) => {
          const Icon = item.Icon;
          const isActive = currentPath === item.href;
          const label = locale === 'es' ? item.labelEs : item.labelEn;

          return (
            <div key={item.id} className="relative group flex items-center justify-center">
              <a
                href={item.href}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border border-transparent",
                  isActive
                    ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 hover:border-white/5"
                )}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--text-primary)] bg-[var(--bg-secondary)]/95 border border-glass-border rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0 z-50">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
