import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Home, FileImage, Gauge, Radar } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ToolsLaunchpad() {
  const { locale } = useI18n();
  const [currentPath, setCurrentPath] = useState('');

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
    <div className="sticky bottom-6 left-0 right-0 w-full flex justify-center z-50 pointer-events-none">
      <div className="bg-[var(--glass-bg)]/80 border border-glass-border backdrop-blur-xl px-4 py-2.5 rounded-full flex gap-3 items-center shadow-lg border-white/5 pointer-events-auto">
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
              
              {/* Tooltip */}
              <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--text-primary)] bg-[var(--bg-secondary)]/95 border border-glass-border rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
