import { useI18n } from '../../i18n/context';
import ScrollReveal from '../ui/ScrollReveal';
import TechIcon from '../ui/TechIcon';
import { projects } from '../../config/data';
import {
  LayoutDashboard,
  CreditCard,
  Compass,
  Building2,
  UserCheck,
  Layout,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  CreditCard,
  Compass,
  Building2,
  UserCheck,
  Layout,
};

// Helper to resolve images imported locally vs external URLs
const getImgSrc = (img: any) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.src) return img.src;
  return '';
};

export default function Projects() {
  const { t, locale } = useI18n();

  try {
    const currentProjects = projects[locale as keyof typeof projects] || projects['en'];
    console.log("Projects Render - Locale:", locale, "Projects count:", currentProjects?.length);
    
    if (!currentProjects) {
      throw new Error(`No projects data found for locale "${locale}"`);
    }

    return (
      <section id="projects" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-[10px] font-bold text-gradient uppercase tracking-widest mb-3">
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
              <a 
                key={project.id} 
                href={`/projects/${project.id}`}
                className={`group block cursor-pointer ${isFeatured ? 'md:col-span-2' : 'col-span-1'}`}
              >
                <div className={`relative h-full overflow-hidden p-0 rounded-2xl flex flex-col glass transition-all duration-300 hover:border-[var(--accent-primary)]/50 ${isFeatured ? 'md:flex-row bg-[var(--bg-primary)] border border-[var(--accent-primary)]/40 shadow-[0_0_20px_rgba(0,242,254,0.1)]' : ''}`}>
                  
                  {/* Real Image Area with Hover Scroll */}
                  <div className={`relative bg-[var(--bg-secondary)] ${isFeatured ? 'md:w-1/2 min-h-[250px]' : 'h-64'} overflow-hidden border-b md:border-b-0 border-[var(--glass-border)] group/image block`}>
                    
                    {/* Browser Mockup Header */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-[var(--bg-primary)]/90 backdrop-blur-md flex items-center px-3 gap-1.5 border-b border-[var(--glass-border)] z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    </div>
                    
                    {/* Image with hover scroll (using object-position) */}
                    <div className="w-full h-full pt-8 relative overflow-hidden">
                      <img 
                        src={getImgSrc(project.imageUrl) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000'} 
                        alt={t(project.titleKey)}
                        loading={isFeatured ? "eager" : "lazy"}
                        className={`w-full h-full object-cover object-top transition-all ease-in-out ${project.isDashboard ? 'duration-[4000ms]' : 'duration-[3000ms]'} group-hover/image:object-bottom`}
                      />
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
                    
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                      {t(project.titleKey)}
                    </h3>
                    
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                      {t(project.descKey)}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full bg-[var(--glass-bg)] text-[var(--text-primary)] border border-[var(--glass-border)] group-hover:border-[var(--glass-hover)] transition-colors"
                        >
                          <TechIcon name={tag} className="w-3 h-3 text-[var(--accent-primary)]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
    );
  } catch (error: any) {
    console.error("Error in Projects component:", error);
    return (
      <section id="projects" className="py-24 relative z-10 text-center text-red-500">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-lg font-semibold">Error al cargar la sección de proyectos</p>
          <pre className="text-xs mt-4 p-4 bg-red-950/20 border border-red-500/20 rounded-lg text-left overflow-x-auto max-w-lg mx-auto font-mono">
            {error.stack || error.message || String(error)}
          </pre>
        </div>
      </section>
    );
  }
}
