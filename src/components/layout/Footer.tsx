import { useI18n } from '../../i18n/context';
import { Heart } from 'lucide-react';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative mt-24">
      <BackgroundBeamsWithCollision className="border-t border-glass-border">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center gap-6 text-xs text-[var(--text-secondary)] relative z-10 text-center">
          
          <div className="flex flex-col items-center gap-2">
            <img src="/avatar-nav.webp" alt="Gabriel Vazquez" width={48} height={48} className="w-12 h-12 rounded-full border border-[var(--glass-border)] grayscale hover:grayscale-0 transition-all opacity-80" />
            <p className="font-bold text-[var(--text-primary)] text-sm tracking-wide mt-2">GABRIEL VAZQUEZ</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full mt-4 pt-8 border-t border-[var(--glass-border)] gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p>
                &copy; {new Date().getFullYear()} Gabriel Vazquez. {t('footer.rights')}
              </p>
              <span className="hidden sm:inline opacity-30">|</span>
              <a 
                href="/legal" 
                className="hover:text-[var(--accent-primary)] transition-colors duration-300 font-bold uppercase tracking-wider text-[10px]"
              >
                {t('legal.link')}
              </a>
            </div>
            <p className="flex items-center gap-1">
              {t('footer.built')} <Heart className="w-3 h-3 text-rose-500 animate-pulse" /> con Astro, React & Tailwind
            </p>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </footer>
  );
}
