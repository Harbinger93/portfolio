import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const beams = [
    {
      id: 1,
      left: "5%",
      duration: "7s",
      delay: "2s",
      className: "h-14",
    },
    {
      id: 2,
      left: "40%",
      duration: "3s",
      delay: "4s",
      className: "h-14",
    },
    {
      id: 3,
      left: "15%",
      duration: "7s",
      delay: "0s",
      className: "h-6",
    },
    {
      id: 4,
      left: "30%",
      duration: "5s",
      delay: "4s",
      className: "h-14",
    },
    {
      id: 5,
      left: "60%",
      duration: "11s",
      delay: "2s",
      className: "h-20",
    },
    {
      id: 6,
      left: "75%",
      duration: "4s",
      delay: "2s",
      className: "h-12",
    },
    {
      id: 7,
      left: "90%",
      duration: "6s",
      delay: "2s",
      className: "h-6",
    },
  ];

  return (
    <div
      className={cn(
        "relative flex items-center w-full justify-center overflow-hidden bg-transparent",
        className
      )}
    >
      {beams.map((beam) => (
        <div
          key={beam.id}
          className={cn(
            "absolute top-0 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent pointer-events-none",
            beam.className
          )}
          style={{
            left: beam.left,
            animation: `beam-fall ${beam.duration} linear infinite`,
            animationDelay: beam.delay,
            transform: 'translateY(-200px)',
          }}
        />
      ))}

      {children}
      <div
        className="absolute bottom-0 bg-transparent w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};
