import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import SkillBar from '../ui/SkillBar';
import { techStack } from '../../config/data';

export default function TechStack() {
  const { t, locale } = useI18n();
  const currentData = techStack[locale];

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
            {t('techstack.subtitle')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-16 leading-tight max-w-xl">
            {t('techstack.title')}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.map((category, i) => (
            <ScrollReveal key={category.id} direction="up" delay={i * 0.1}>
              <div className="h-full flex flex-col p-6 glass rounded-2xl hover:border-[var(--accent-primary)] transition-colors duration-300">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {t(category.titleKey)}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 flex-1">
                  {t(category.itemsKey)}
                </p>
                <div className="mb-6">
                  <SkillBar 
                    label={t(category.titleKey)} 
                    percentage={category.percentage || 90} 
                    color="bg-gradient-primary" 
                    delay={i * 0.1} 
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {category.tags.map((tag) => (
                    <div 
                      key={tag} 
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[10px] font-medium text-[var(--text-secondary)] flex items-center gap-1.5 hover:border-[var(--accent-primary)]/50 transition-colors cursor-default"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
