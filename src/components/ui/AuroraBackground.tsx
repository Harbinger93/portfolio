import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="absolute inset-0 opacity-40 dark:opacity-30">
        {/* Aurora 1 */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[100px] bg-[var(--accent-primary)] opacity-30"
        />
        
        {/* Aurora 2 */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.8, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 2 }}
          className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[120px] bg-[var(--accent-secondary)] opacity-20"
        />

        {/* Aurora 3 */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 4 }}
          className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-screen blur-[90px] bg-[var(--accent-tertiary)] opacity-30"
        />
      </div>
      
      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
}
