export default function GlowBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* CSS-based radial glow circles with GPU-accelerated keyframe animation */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-[rgba(125,211,252,0.04)] blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-[aurora-glow-1_30s_ease-in-out_infinite_alternate]"
        style={{ top: '15%', left: '20%' }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-[rgba(34,211,238,0.03)] blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-[aurora-glow-2_35s_ease-in-out_infinite_alternate]"
        style={{ top: '30%', left: '80%' }}
      />
      <div 
        className="absolute w-[700px] h-[700px] rounded-full bg-[rgba(59,130,246,0.03)] blur-[140px] -translate-x-1/2 -translate-y-1/2 animate-[aurora-glow-1_25s_ease-in-out_infinite_alternate]"
        style={{ top: '70%', left: '50%' }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full bg-[rgba(125,211,252,0.02)] blur-[90px] -translate-x-1/2 -translate-y-1/2 animate-[aurora-glow-2_40s_ease-in-out_infinite_alternate]"
        style={{ top: '80%', left: '10%' }}
      />
      <div 
        className="absolute w-[560px] h-[560px] rounded-full bg-[rgba(34,211,238,0.02)] blur-[110px] -translate-x-1/2 -translate-y-1/2 animate-[aurora-glow-1_35s_ease-in-out_infinite_alternate]"
        style={{ top: '60%', left: '90%' }}
      />
    </div>
  );
}
