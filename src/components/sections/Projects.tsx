import { useI18n } from '../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import GlassCard from '../ui/GlassCard';
import { projects } from '../../config/data';
import {
  GraduationCap,
  ShoppingCart,
  Server,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  ShoppingCart,
  Server,
  Shield,
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Projects() {
  const { t, locale } = useI18n();
  const currentProjects = projects[locale];

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
            {t('projects.subtitle')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-slate-150 mb-12">
            {t('projects.title')}
          </h2>
        </ScrollReveal>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {currentProjects.map((project) => {
            const Icon = iconMap[project.icon] || Shield;
            return (
              <motion.div key={project.id} variants={cardVariant}>
                <GlassCard className="h-full group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0 group-hover:border-ice-300/20 transition-all duration-300">
                      <Icon className="w-5 h-5 text-ice-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-slate-150 mb-2">
                        {t(project.titleKey)}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {t(project.descKey)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full bg-deep-700/50 text-slate-500 border border-glass-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
