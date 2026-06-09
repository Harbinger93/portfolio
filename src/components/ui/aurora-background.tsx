export const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="absolute inset-0 opacity-50 dark:opacity-40">
        {/* Aurora 1 */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[80px] bg-[var(--accent-primary)]"
          style={{
            animation: 'aurora-1 8s ease-in-out infinite',
          }}
        />
        
        {/* Aurora 2 */}
        <div
          className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen blur-[100px] bg-cyan-500/50"
          style={{
            animation: 'aurora-2 10s ease-in-out infinite',
          }}
        />

        {/* Aurora 3 */}
        <div
          className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-screen blur-[90px] bg-[var(--accent-secondary)]/60"
          style={{
            animation: 'aurora-3 12s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};
