import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import { Languages } from 'lucide-react';

const sections = ['home', 'projects', 'skills', 'coaching', 'contact'];

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-glass-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="text-lg font-light tracking-wider text-slate-150 hover:text-ice-300 transition-colors"
        >
          GV
        </button>

        <div className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                active === s
                  ? 'text-ice-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t(`nav.${s}`)}
            </button>
          ))}

          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-all duration-300 ml-4 pl-4 border-l border-glass-border"
          >
            <Languages className="w-3.5 h-3.5" />
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
        </div>

        <button
          className="md:hidden text-slate-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[3px]' : ''
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[3px]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-b border-glass-border">
          <div className="flex flex-col px-6 py-4 gap-4">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`text-sm uppercase tracking-[0.2em] text-left transition-all ${
                  active === s ? 'text-ice-300' : 'text-slate-500'
                }`}
              >
                {t(`nav.${s}`)}
              </button>
            ))}
            <button
              onClick={() => {
                setLocale(locale === 'es' ? 'en' : 'es');
                setMenuOpen(false);
              }}
              className="text-sm uppercase tracking-wider text-slate-500 text-left pt-2 border-t border-glass-border"
            >
              {locale === 'es' ? 'English' : 'Español'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
