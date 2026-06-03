import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export const AuroraBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse following
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transform mouse values to subtle offsets
  const x1 = useTransform(springX, [0, 1], [0, 100]);
  const y1 = useTransform(springY, [0, 1], [0, 100]);
  
  const x2 = useTransform(springX, [0, 1], [0, -80]);
  const y2 = useTransform(springY, [0, 1], [0, -80]);

  const x3 = useTransform(springX, [0, 1], [0, 50]);
  const y3 = useTransform(springY, [0, 1], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to 0-1
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="absolute inset-0 opacity-50 dark:opacity-40">
        {/* Aurora 1 */}
        <motion.div
          style={{ x: x1, y: y1 }}
          animate={{
            scale: [1, 1.3, 0.9, 1],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 90, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[80px] bg-[var(--accent-primary)]"
        />
        
        {/* Aurora 2 */}
        <motion.div
          style={{ x: x2, y: y2 }}
          animate={{
            scale: [1, 0.9, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [360, 180, 90, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[100px] bg-cyan-500/50"
        />

        {/* Aurora 3 */}
        <motion.div
          style={{ x: x3, y: y3 }}
          animate={{
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, -90, -180, -360],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[90px] bg-[var(--accent-secondary)]/60"
        />
      </div>
      
      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};
