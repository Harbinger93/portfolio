import { useEffect, useRef } from 'react';

export default function GlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const circles = [
      { x: 0.2, y: 0.15, r: 300, color: 'rgba(125, 211, 252, 0.04)' },
      { x: 0.8, y: 0.3, r: 250, color: 'rgba(34, 211, 238, 0.03)' },
      { x: 0.5, y: 0.7, r: 350, color: 'rgba(59, 130, 246, 0.03)' },
      { x: 0.1, y: 0.8, r: 200, color: 'rgba(125, 211, 252, 0.02)' },
      { x: 0.9, y: 0.6, r: 280, color: 'rgba(34, 211, 238, 0.02)' },
    ];

    let time = 0;

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      time += 0.002;

      circles.forEach((c, i) => {
        const pulse = 1 + Math.sin(time + i * 1.5) * 0.05;
        const cx = canvas!.width * c.x;
        const cy = canvas!.height * c.y;
        const r = c.r * pulse;

        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, c.color);
        grad.addColorStop(1, 'transparent');
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
