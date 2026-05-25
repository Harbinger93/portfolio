import { useI18n } from '../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import SkillBar from '../ui/SkillBar';
import GlassCard from '../ui/GlassCard';
import { techStack } from '../../config/data';

export default function TechStack() {
  const { t, locale } = useI18n();
  const currentData = techStack[locale];

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
            {t('techstack.subtitle')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-slate-150 mb-12">
            {t('techstack.title')}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {currentData.map((skill, i) => (
            <ScrollReveal key={skill.id} direction="up" delay={i * 0.15}>
              <GlassCard className="h-full">
                <h3 className="text-sm font-medium text-slate-150 mb-1">
                  {t(skill.titleKey)}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {t(skill.itemsKey)}
                </p>
                <SkillBar
                  label={t(skill.titleKey)}
                  percentage={skill.percentage}
                  color={skill.color}
                  delay={i * 0.2}
                />
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
