import { useId, type ReactElement } from "react"

type BacklightProps = {
  children?: ReactElement
  className?: string
  blur?: number
  color?: string
  opacity?: number
  glowOnly?: boolean
}

export function Backlight({ blur = 20, children, className, color, opacity = 1, glowOnly = false }: BacklightProps) {
  const id = useId()

  return (
    <div className={className}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id={id} y="-50%" x="-50%" width="200%" height="200%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={blur}
            result="blurred"
          ></feGaussianBlur>
          {color ? (
            <>
              <feFlood floodColor={color} floodOpacity={opacity} result="flood" />
              <feComposite operator="in" in="flood" in2="blurred" result="coloredGlow" />
              {!glowOnly && <feComposite in="SourceGraphic" operator="over" in2="coloredGlow" />}
            </>
          ) : (
            <>
              <feColorMatrix
                type="saturate"
                in="blurred"
                values="4"
                result="saturated"
              ></feColorMatrix>
              {!glowOnly && <feComposite in="SourceGraphic" operator="over" in2="saturated"></feComposite>}
            </>
          )}
        </filter>
      </svg>

      <div style={{ filter: `url(#${id})` }}>{children}</div>
    </div>
  )
}

