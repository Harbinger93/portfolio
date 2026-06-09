import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: {
    firstColor: string;
    secondColor: string;
  };
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  children,
  className,
  borderSize = 1.5,
  borderRadius = 20,
  neonColors = {
    firstColor: "#00F2FE", // Cian
    secondColor: "#9c40ff", // Violeta/Púrpura
  },
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [children]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={
        {
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--neon-first-color": neonColors.firstColor,
          "--neon-second-color": neonColors.secondColor,
          "--card-width": `${dimensions.width}px`,
          "--card-height": `${dimensions.height}px`,
        } as CSSProperties
      }
      className={cn(
        "relative z-10 h-full w-full rounded-[var(--border-radius)]",
        className
      )}
      {...props}
    >
      {/* Animación local auto-contenida para el degradado en movimiento */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neon-background-position {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        .animate-neon-gradient-shift::before,
        .animate-neon-gradient-shift::after {
          animation: neon-background-position 6s linear infinite !important;
        }
      `}} />

      <div
        className={cn(
          "relative h-full w-full rounded-[var(--border-radius)] border border-transparent bg-clip-border",
          "before:absolute before:-inset-[var(--border-size)] before:-z-10 before:block before:h-[calc(100%+var(--border-size)*2)] before:w-[calc(100%+var(--border-size)*2)] before:rounded-[var(--border-radius)] before:content-['']",
          "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-[length:100%_200%] before:bg-left-top",
          "after:absolute after:-inset-[var(--border-size)] after:-z-10 after:block after:h-[calc(100%+var(--border-size)*2)] after:w-[calc(100%+var(--border-size)*2)] after:rounded-[var(--border-radius)] after:blur-[20px] after:opacity-40 after:content-['']",
          "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-[length:100%_200%] after:bg-left-top",
          "animate-neon-gradient-shift"
        )}
      >
        <div className="relative z-10 h-full w-full rounded-[calc(var(--border-radius)-var(--border-size))] bg-[var(--bg-secondary)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
