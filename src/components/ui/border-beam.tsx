"use client"

import { cn } from "../../utils/cn"

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number
  /**
   * The duration of the border beam.
   */
  duration?: number
  /**
   * The delay of the border beam.
   */
  delay?: number
  /**
   * The color of the border beam from.
   */
  colorFrom?: string
  /**
   * The color of the border beam to.
   */
  colorTo?: string
  /**
   * The class name of the border beam.
   */
  className?: string
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number
  /**
   * The border width of the beam.
   */
  borderWidth?: number
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  style,
  reverse = false,
  borderWidth = 1,
}: BorderBeamProps) => {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] border-beam-mask", className)}
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
          borderWidth: "var(--border-beam-width)",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            animation: `${reverse ? 'border-beam-reverse' : 'border-beam'} ${duration}s linear infinite`,
            animationDelay: `${-delay}s`,
            ...style,
          } as React.CSSProperties
        }
      />
    </div>
  )
}
