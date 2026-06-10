import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/context';
import { useTheme } from '../../utils/theme';
import { Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler';
import { navigate } from 'astro:transitions/client';

const sections = ['home', 'projects', 'skills', 'coaching', 'contact'];

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none flex justify-center">
      <div 
        className={`pointer-events-auto relative w-full max-w-4xl rounded-full transition-all duration-500 flex items-center justify-between px-6 h-16 shadow-lg border border-glass-border backdrop-blur-xl ${
          scrolled
            ? 'bg-[var(--bg-primary)]/70'
            : 'bg-[var(--glass-bg)]'
        }`}
      >
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center justify-center shrink-0 gap-3 group"
          aria-label="Home"
        >
          <img
            src="/avatar-nav.webp"
            alt="GV"
            className="w-10 h-10 rounded-full object-cover border-2 border-glass-border group-hover:border-[var(--accent-primary)] transition-colors"
            onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=GV&background=0D8ABC&color=fff'; }}
          />
          <span className="font-semibold text-sm tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
            Gabriel Vazquez
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`text-[11px] font-medium uppercase tracking-[0.2em] cursor-pointer transition-all duration-300 ${
                active === s
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t(`nav.${s}`)}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 border-l border-glass-border pl-4 ml-4">
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
          
          <AnimatedThemeToggler 
            theme={theme}
            onThemeChange={(newTheme) => setTheme(newTheme)}
            className="p-2 rounded-full hover:bg-glass-hover text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors flex items-center justify-center cursor-pointer [&_svg]:size-4"
            variant="circle"
            duration={500}
          />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <AnimatedThemeToggler 
            theme={theme}
            onThemeChange={(newTheme) => setTheme(newTheme)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors flex items-center justify-center cursor-pointer [&_svg]:size-5"
            variant="circle"
            duration={500}
          />
          <button
            className="text-[var(--text-primary)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div
            className="absolute top-20 left-0 right-0 bg-[var(--bg-secondary)] backdrop-blur-xl rounded-2xl border border-glass-border overflow-hidden shadow-2xl animate-[dropdownFadeIn_0.2s_ease-out_forwards]"
          >
            <div className="flex flex-col p-4 gap-2">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`p-4 text-sm font-medium uppercase tracking-widest text-center rounded-xl cursor-pointer transition-colors ${
                    active === s 
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' 
                      : 'text-[var(--text-secondary)] hover:bg-glass-hover'
                  }`}
                >
                  {t(`nav.${s}`)}
                </button>
              ))}
              
              <div className="h-px bg-glass-border my-2 mx-4" />
              
              <button
                onClick={() => {
                  setLocale(locale === 'es' ? 'en' : 'es');
                  setMenuOpen(false);
                }}
                className="p-4 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
              >
                <Languages className="w-4 h-4" />
                {locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
