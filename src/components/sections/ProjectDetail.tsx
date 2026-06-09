import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/context';
import { projects } from '../../config/data';
import TechIcon from '../ui/TechIcon';
import ScrollReveal from '../ui/ScrollReveal';
import { ArrowLeft, ExternalLink, Globe, LayoutGrid, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Backlight } from '../ui/backlight';
import { RainbowButton } from '../ui/rainbow-button';

interface ProjectDetailProps {
  id: string;
}

const getShortTitle = (id: string) => {
  const shortNames: Record<string, string> = {
    'ga4-portal': 'GA4 Portal',
    'adiwapp': 'Adiwapp',
    'koyobo': 'Koyobo',
    'intranet': 'Intranet',
    'somosmigrantes': 'SomosMigrantes',
    'iesa': 'IESA',
    'simpletv': 'SimpleTV'
  };
  return shortNames[id] || id;
};

export default function ProjectDetail({ id }: ProjectDetailProps) {
  const { t, locale } = useI18n();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenis = (window as any).lenis;
      if (isZoomOpen) {
        lenis?.stop();
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.classList.add('lenis-stopped');
      } else {
        lenis?.start();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.classList.remove('lenis-stopped');
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        const lenis = (window as any).lenis;
        lenis?.start();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.classList.remove('lenis-stopped');
      }
    };
  }, [isZoomOpen]);

  // Get project list based on current locale
  const currentProjects = projects[locale as keyof typeof projects] || projects['en'];
  const projectIndex = currentProjects.findIndex((p) => p.id === id);
  const project = currentProjects[projectIndex];

  const prevProject = currentProjects[projectIndex - 1] || currentProjects[currentProjects.length - 1];
  const nextProject = currentProjects[projectIndex + 1] || currentProjects[0];

  if (!project) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {locale === 'es' ? 'Proyecto no encontrado' : 'Project not found'}
        </h2>
        <a href="/#projects" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {locale === 'es' ? 'Volver a proyectos' : 'Back to projects'}
        </a>
      </div>
    );
  }

  // Resolve image assets
  const getImgSrc = (img: any) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.src) return img.src;
    return '';
  };

  const resolvedImages = (project.images && project.images.length > 0 ? project.images : [project.imageUrl]).map((img: any) => {
    if (typeof img === 'object' && img.original) {
      return {
        src: getImgSrc(img.original),
        thumb: getImgSrc(img.thumb)
      };
    }
    const srcVal = getImgSrc(img);
    return { src: srcVal, thumb: srcVal };
  });
  const activeMedia = resolvedImages[activeMediaIndex]?.src || '';

  const isVideo = (url: string) => {
    return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('.mp4');
  };

  useEffect(() => {
    if (!isZoomOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveMediaIndex((prev) => (prev === 0 ? resolvedImages.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveMediaIndex((prev) => (prev === resolvedImages.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setIsZoomOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, resolvedImages.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMediaIndex((prev) => (prev === 0 ? resolvedImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMediaIndex((prev) => (prev === resolvedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="pt-40 pb-24 relative z-10 min-h-screen overflow-clip">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Full-Width Header Block */}
        <ScrollReveal direction="down">
          <div className="flex flex-col gap-4 mb-8">
            <a
              href="/#projects"
              className="group inline-flex items-center gap-2 text-xs md:text-sm font-medium tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 w-fit cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              {locale === 'es' ? 'Volver a proyectos' : 'Back to projects'}
            </a>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] font-bold text-[var(--accent-primary)] uppercase tracking-widest bg-[var(--accent-primary)]/10 px-3 py-1 rounded-full border border-[var(--accent-primary)]/20">
                {locale === 'es' ? 'Caso de estudio' : 'Case study'}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] leading-tight uppercase tracking-tight max-w-4xl mt-2 text-left">
              {t(project.titleKey)}
            </h1>
          </div>
        </ScrollReveal>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
          
          {/* Left Column: Visuals & Carousel (7 cols) */}
          <div className="lg:col-span-7 lg:sticky lg:top-36 self-start h-fit flex flex-col gap-6 w-full z-20">
            <ScrollReveal direction="up" delay={0.1}>
              
              <div className="relative w-full aspect-video">
                {/* Backlight glow for video - placed behind the mockup to prevent clipping by overflow-hidden */}
                {isVideo(activeMedia) && (
                  <div className="absolute -inset-4 bg-[var(--accent-primary)]/15 rounded-3xl blur-3xl -z-10 pointer-events-none animate-pulse-glow"></div>
                )}
                
                {/* Browser Mockup Wrapper */}
                <div className="relative rounded-2xl overflow-hidden border border-glass-border bg-[var(--bg-secondary)] shadow-2xl flex flex-col w-full h-full">
                  
                  {/* Browser Header dots */}
                  <div className="h-10 bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center px-4 gap-2 border-b border-glass-border z-10 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/85"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/85"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/85"></div>
                    <div className="ml-4 flex-1 h-5.5 bg-[var(--bg-secondary)]/50 rounded-md text-[9px] text-[var(--text-secondary)]/50 flex items-center px-3 font-mono overflow-hidden whitespace-nowrap select-none">
                      gabrielvazquez.dev/projects/{project.id}
                    </div>
                  </div>

                  {/* Display active media */}
                    <div 
                      className="flex-1 w-full relative overflow-hidden bg-[#0a0a0b] hover:overflow-y-auto scroll-smooth custom-scrollbar"
                      data-lenis-prevent
                    >
                      <div
                        key={activeMediaIndex}
                        className="w-full h-full animate-[fadeIn_0.25s_ease-out_forwards]"
                      >
                        {isVideo(activeMedia) ? (
                          <video
                            src={activeMedia}
                            controls
                            autoPlay
                            muted
                            playsInline
                            loop
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <img
                            src={activeMedia}
                            alt={t(project.titleKey)}
                            className="w-full min-h-full h-auto object-cover object-top block cursor-zoom-in"
                            onClick={() => setIsZoomOpen(true)}
                          />
                        )}
                      </div>
                    </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Interactive gallery thumbnails */}
            {resolvedImages.length > 1 && (
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-wrap gap-2.5 py-1 justify-start items-center">
                  {resolvedImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMediaIndex(i)}
                      className={`relative w-16 md:w-20 aspect-video rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${
                        i === activeMediaIndex
                          ? 'border-[var(--accent-primary)] scale-105 shadow-md shadow-[var(--accent-primary)]/10'
                          : 'border-glass-border opacity-50 hover:opacity-100'
                      }`}
                    >
                      {isVideo(img.src) ? (
                        <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center text-[9px] font-mono text-[var(--accent-primary)] uppercase select-none">
                          Video
                        </div>
                      ) : (
                        <img
                          src={img.thumb}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right Column: Description & Specs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full text-left">
            
            {/* Description Block */}
            <ScrollReveal direction="up" delay={0.15}>
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {locale === 'es' ? 'Descripción del Proyecto' : 'Project Description'}
                </h3>
                <p className="text-[var(--text-primary)] text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {t(project.fullDescKey || project.descKey)}
                </p>
              </div>
            </ScrollReveal>

            {/* Implemented Solution Block */}
            {project.solutionKey && (
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-col gap-3 border-t border-glass-border pt-6 mt-4">
                  <h3 className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                    {locale === 'es' ? 'Solución Implementada' : 'Solution Implemented'}
                  </h3>
                  <p className="text-[var(--text-primary)] text-sm md:text-base leading-relaxed">
                    {t(project.solutionKey)}
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Tech Stack card */}
            <ScrollReveal direction="up" delay={0.25}>
              <div className="border border-glass-border rounded-xl p-5 bg-[var(--bg-secondary)]/25 backdrop-blur-xl">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  {locale === 'es' ? 'Tecnologías utilizadas' : 'Technologies used'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full bg-[var(--glass-bg)] text-[var(--text-primary)] border border-glass-border"
                    >
                      <TechIcon name={tag} className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Action buttons */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-col gap-3.5 w-full mt-2">
                {project.url && project.url !== '#' && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-primary text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.2)] hover:shadow-[0_0_25px_rgba(0,242,254,0.35)] cursor-pointer text-sm w-full"
                  >
                    <Globe className="w-4 h-4" />
                    {locale === 'es' ? 'Visitar Sitio Web' : 'Visit Live Project'}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <RainbowButton
                  variant="outline"
                  asChild
                  className="rounded-full w-full py-6 text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 font-bold cursor-pointer"
                >
                  <a href="/#contact" className="flex items-center justify-center gap-2">
                    {locale === 'es' ? 'Cotizar sistema similar' : 'Quote similar system'}
                  </a>
                </RainbowButton>
              </div>
            </ScrollReveal>

          </div>
          
        </div>

        {/* Project Navigation Footer */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="border-t border-glass-border mt-16 pt-10 flex flex-row items-center justify-between gap-4">
            <a
              href={`/projects/${prevProject.id}`}
              className="group flex flex-col items-start gap-1 text-left w-full max-w-[45%]"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">
                {locale === 'es' ? '← Anterior' : '← Previous'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate w-full block">
                {getShortTitle(prevProject.id)}
              </span>
            </a>

            <div className="h-8 w-[1px] bg-glass-border shrink-0"></div>

            <a
              href={`/projects/${nextProject.id}`}
              className="group flex flex-col items-end gap-1 text-right w-full max-w-[45%]"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">
                {locale === 'es' ? 'Siguiente →' : 'Next →'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors truncate w-full block">
                {getShortTitle(nextProject.id)}
              </span>
            </a>
          </div>
        </ScrollReveal>

      </div>

      {/* Image Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          data-lenis-prevent
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 md:p-10 cursor-zoom-out select-none animate-[fadeIn_0.2s_ease-out_forwards]"
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-[110]"
            aria-label="Close zoom"
          >
            <X className="w-5 h-5" />
          </button>

          {resolvedImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer z-[110] backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer z-[110] backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="relative max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg bg-[var(--bg-secondary)] border border-glass-border p-2 custom-scrollbar cursor-default animate-[zoomIn_0.2s_ease-out_forwards]"
          >
            {isVideo(activeMedia) ? (
              <video
                src={activeMedia}
                controls
                autoPlay
                muted
                playsInline
                loop
                className="w-full max-h-[75vh] object-contain rounded-md"
              />
            ) : (
              <img
                src={activeMedia}
                alt={`Zoomed project view ${activeMediaIndex + 1}`}
                className="w-full h-auto rounded-md"
              />
            )}
          </div>

          {resolvedImages.length > 1 && (
            <div className="absolute bottom-6 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium tracking-wider backdrop-blur-sm">
              {activeMediaIndex + 1} / {resolvedImages.length}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
