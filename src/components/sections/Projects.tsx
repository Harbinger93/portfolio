import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import GlassCard from '../ui/GlassCard';
import { projects } from '../../config/data';
import {
  MessageSquare,
  MessageCircle,
  Calculator,
  Layout,
  Container,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  MessageCircle,
  Calculator,
  Layout,
  Container,
  ShoppingCart,
};

export default function Projects() {
  const { t, locale } = useI18n();
  const currentProjects = projects[locale];

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-3">
            {t('projects.subtitle')}
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-12 max-w-lg leading-tight">
            {t('projects.title')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentProjects.map((project, index) => {
            const Icon = iconMap[project.icon] || Layout;
            const isFeatured = index === 0;

            return (
              <motion.div 
                key={project.id} 
                className={isFeatured ? "md:col-span-2" : "col-span-1"}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`h-full group overflow-hidden p-0 rounded-2xl flex flex-col glass ${isFeatured ? 'md:flex-row' : ''}`}>
                  
                  {/* Fake Image Area */}
                  <div className={`relative bg-[var(--bg-secondary)] ${isFeatured ? 'md:w-1/2 min-h-[250px]' : 'h-48'} overflow-hidden border-b md:border-b-0 border-[var(--glass-border)] flex items-center justify-center p-6`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/10 to-transparent"></div>
                    {/* Abstract placeholder visual */}
                    <div className="w-full h-full border border-[var(--glass-border)] rounded-xl bg-[var(--bg-tertiary)]/50 shadow-2xl overflow-hidden relative">
                       <div className="absolute top-0 left-0 w-full h-8 bg-[var(--bg-primary)]/80 flex items-center px-3 gap-1.5 border-b border-[var(--glass-border)]">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                       </div>
                       <div className="mt-12 mx-4 h-24 rounded-lg bg-gradient-to-r from-[var(--glass-bg)] to-transparent border border-[var(--glass-border)]"></div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className={`p-6 md:p-8 flex-1 flex flex-col justify-center ${isFeatured ? 'md:w-1/2' : ''}`}>
                    {isFeatured && (
                      <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider bg-[var(--accent-primary)]/10 px-3 py-1 rounded-full w-fit">
                           Destacado
                         </p>
                      </div>
                    )}
                    
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">
                      {t(project.titleKey)}
                    </h3>
                    
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                      {t(project.descKey)}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[11px] font-medium rounded-full bg-[var(--glass-bg)] text-[var(--text-primary)] border border-[var(--glass-border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
