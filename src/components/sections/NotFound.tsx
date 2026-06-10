import { useI18n } from '../../i18n/context';
import { RainbowButton } from '../ui/rainbow-button';
import { Backlight } from '../ui/backlight';
import { Home, ArrowRight, ShieldAlert, Image, Activity } from 'lucide-react';

export default function NotFound() {
  const { t, locale } = useI18n();

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden py-12">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[var(--accent-secondary)]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Floating 3D-like icon */}
      <div className="mb-6 relative z-10 opacity-0 animate-slide-down">
        <Backlight blur={10} color="var(--accent-primary)" opacity={0.2} glowOnly>
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] flex items-center justify-center">
            <ShieldAlert className="w-16 h-16 text-[var(--accent-primary)] animate-[float_4s_ease-in-out_infinite]" />
          </div>
        </Backlight>
      </div>

      {/* Large 404 Text */}
      <h1
        className="text-8xl md:text-9xl font-extrabold tracking-tighter text-gradient mb-2 select-none opacity-0 animate-zoom-in-404"
        style={{ animationDelay: '100ms' }}
      >
        404
      </h1>

      {/* Subtitle & Description */}
      <h2
        className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 opacity-0 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        {t('404.subtitle')}
      </h2>

      <p
        className="text-[var(--text-secondary)] text-sm md:text-base max-w-md mb-8 leading-relaxed opacity-0 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        {t('404.message')}
      </p>

      {/* Primary CTA Button */}
      <div
        className="mb-12 relative z-10 opacity-0 animate-fade-in"
        style={{ animationDelay: '400ms' }}
      >
        <RainbowButton variant="default" asChild className="rounded-full px-8 py-5 text-sm font-bold hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer">
          <a href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4 text-[var(--accent-primary)]" />
            {t('404.cta')}
          </a>
        </RainbowButton>
      </div>

      {/* Suggested Tools Section */}
      <div
        className="w-full max-w-lg mt-4 relative z-10 opacity-0 animate-slide-up"
        style={{ animationDelay: '500ms' }}
      >
        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          {t('404.suggested')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Optimizer Tool Link */}
          <a
            href="/herramientas/optimizador"
            className="flex items-start gap-4 p-4 rounded-xl glass border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--glass-hover)] transition-all duration-300 text-left group"
          >
            <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {locale === 'es' ? 'Optimizador' : 'Optimizer'}
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                {t('tools.optimizer.desc')}
              </p>
            </div>
          </a>

          {/* Speed Analyzer Tool Link */}
          <a
            href="/herramientas/analizador"
            className="flex items-start gap-4 p-4 rounded-xl glass border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--glass-hover)] transition-all duration-300 text-left group"
          >
            <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {locale === 'es' ? 'Analizador Web' : 'Web Analyzer'}
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                {t('tools.analyzer.desc')}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
