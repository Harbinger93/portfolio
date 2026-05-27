import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-32 relative z-10 overflow-hidden">
      {/* Background glow for contact section */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[var(--accent-primary)] blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <ScrollReveal direction="up">
          <p className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-3">
            {t('contact.subtitle')}
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-10 leading-tight">
            {t('contact.title')}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://instagram.com/tu_usuario" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(125,211,252,0.3)]"
            >
              {t('contact.instagram')}
            </a>
            <a 
              href="mailto:dev.gabo23@gmail.com"
              className="px-8 py-3 rounded-full glass border border-[var(--glass-border)] text-[var(--text-primary)] font-medium hover:bg-glass-hover transition-colors"
            >
              {t('contact.email_label')}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
