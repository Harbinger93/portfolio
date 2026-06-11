import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import { NeonGradientCard } from '../ui/NeonGradientCard';
import { FileImage, Gauge, ArrowRight, Sparkles, Radar } from 'lucide-react';

export default function ToolsPreview() {
  const { t, locale } = useI18n();

  const toolsList = [
    {
      id: 'optimizer',
      href: '/herramientas/optimizador',
      titleKey: 'tools.optimizer.title',
      descKey: 'tools.optimizer.desc',
      Icon: FileImage,
      color: 'from-[#00F2FE]/20 to-[#7C3AED]/20',
      neonColors: { firstColor: '#00F2FE', secondColor: '#7C3AED' }
    },
    {
      id: 'analyzer',
      href: '/herramientas/analizador',
      titleKey: 'tools.analyzer.title',
      descKey: 'tools.analyzer.desc',
      Icon: Gauge,
      color: 'from-[#00F2FE]/20 to-[#7C3AED]/20',
      neonColors: { firstColor: '#00F2FE', secondColor: '#7C3AED' }
    },
    {
      id: 'radar',
      href: '/herramientas/radar',
      titleKey: 'tools.radar.title',
      descKey: 'tools.radar.desc',
      Icon: Radar,
      color: 'from-[#00F2FE]/20 to-[#7C3AED]/20',
      neonColors: { firstColor: '#00F2FE', secondColor: '#7C3AED' }
    }
  ];

  return (
    <section id="tools" className="py-24 relative z-10 overflow-hidden">
      {/* Background glow to make the section pop out */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[var(--accent-primary)]/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          {/* Glowing Premium Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/15 to-purple-500/15 border border-[var(--accent-primary)]/30 text-[10px] font-bold tracking-widest text-[var(--accent-primary)] uppercase mb-5 shadow-[0_0_20px_rgba(0,242,254,0.08)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{locale === 'es' ? 'Utilidades Gratuitas y Privadas' : 'Free & Private Utilities'}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
            {t('tools.title')}
          </h2>
          <p className="text-base text-[var(--text-secondary)] mb-12 max-w-2xl leading-relaxed">
            {t('tools.desc')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolsList.map((tool) => {
            const Icon = tool.Icon;
            return (
              <a
                key={tool.id}
                href={tool.href}
                className="group relative block h-full cursor-pointer rounded-2xl transition-transform duration-300 hover:-translate-y-1.5"
              >
                <NeonGradientCard
                  borderSize={1.5}
                  borderRadius={16}
                  neonColors={tool.neonColors}
                  className="h-full w-full"
                >
                  <div className="p-6 md:p-8 flex flex-col h-full justify-between relative z-10">
                    <div>
                      {/* Icon Container with glowing background */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 border border-white/5`}>
                        <Icon className="w-7 h-7 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" />
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                        {t(tool.titleKey)}
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                        {t(tool.descKey)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300 mt-auto">
                      <span>{t('tools.cta')}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </NeonGradientCard>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
