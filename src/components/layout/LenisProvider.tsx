import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children?: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle scroll/resize and hash links on page load or client-side navigation
    const handlePageLoad = () => {
      lenis.resize();
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash;
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            lenis.scrollTo(element, { offset: -80, duration: 1.5, immediate: false });
          }
        }, 100);
      } else {
        // Reset scroll position to top on page change
        lenis.scrollTo(0, { immediate: true });
      }
    };

    // Listen to Astro's client router page-load event
    document.addEventListener('astro:page-load', handlePageLoad);

    // Run once on initial layout mount
    handlePageLoad();

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

