import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass flex items-center justify-center text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors shadow-lg ${!isVisible ? 'pointer-events-none' : 'pointer-events-auto'}`}
      aria-label="Scroll to top"
    >
      {/* Circular Progress */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--grad-from)" />
            <stop offset="100%" stopColor="var(--grad-to)" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          strokeWidth="4"
          className="stroke-[var(--glass-border)]"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          strokeWidth="4"
          stroke="url(#scrollGradient)"
          className="drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]"
          style={{ pathLength: scaleX }}
          strokeLinecap="round"
        />
      </svg>
      <ChevronUp className="w-6 h-6 relative z-10" />
    </motion.button>
  );
}
