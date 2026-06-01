import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n/context';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  tags: string[];
  imageUrl: string;
  isDashboard: boolean;
  images?: string[];
  url?: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [project.imageUrl];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[var(--bg-primary)] border border-glass-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header / Slider */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[var(--bg-secondary)] flex-shrink-0 group">
              <img
                src={images[currentIndex]}
                alt={t(project.titleKey)}
                className="w-full h-full object-cover object-top transition-all duration-500"
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] text-[var(--text-primary)] backdrop-blur-sm transition-colors z-10 shadow-sm border border-[var(--glass-border)]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Slider Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--bg-primary)]/70 hover:bg-[var(--bg-primary)] text-[var(--text-primary)] backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-sm border border-[var(--glass-border)]"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--bg-primary)]/70 hover:bg-[var(--bg-primary)] text-[var(--text-primary)] backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-sm border border-[var(--glass-border)]"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                {t(project.titleKey)}
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--glass-bg)] text-[var(--text-primary)] border border-[var(--glass-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                {t(project.descKey)}
              </p>

              <div className="flex justify-end mt-auto">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-white font-medium hover:scale-105 transition-transform"
                  >
                    Visitar Proyecto
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
