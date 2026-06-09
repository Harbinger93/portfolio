import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react"
import { cn } from "@/lib/utils"

type TerminalElementTypes =
  | "article"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li"
  | "p"
  | "section"
  | "span"

interface AnimatedSpanProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number
  className?: string
  active?: boolean
  onComplete?: () => void
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  active = false,
  onComplete,
  ...props
}: AnimatedSpanProps) => {
  const [hasStarted, setHasStarted] = useState(false)

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (active && !hasStarted) {
      setHasStarted(true)
    }
  }, [active, hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const transitionDuration = 300 // 0.3s transition duration
    const timer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current()
      }
    }, delay + transitionDuration)

    return () => clearTimeout(timer)
  }, [hasStarted, delay])

  return (
    <div
      className={cn(
        "grid text-sm font-normal tracking-tight transition-all duration-300 ease-out",
        className
      )}
      style={{
        opacity: hasStarted ? 1 : 0,
        transform: hasStarted ? 'translateY(0)' : 'translateY(-5px)',
        transitionDelay: `${delay}ms`,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

interface TypingAnimationProps extends React.HTMLAttributes<HTMLElement> {
  children: string
  className?: string
  duration?: number
  delay?: number
  as?: TerminalElementTypes
  active?: boolean
  onComplete?: () => void
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  active = false,
  onComplete,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string.")
  }

  const [displayedText, setDisplayedText] = useState<string>("")
  const [started, setStarted] = useState(false)

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (active && !started) {
      const timer = setTimeout(() => {
        setStarted(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [active, started, delay])

  useEffect(() => {
    let typingEffect: ReturnType<typeof setInterval> | null = null

    if (started) {
      let i = 0
      typingEffect = setInterval(() => {
        if (i < children.length) {
          setDisplayedText(children.substring(0, i + 1))
          i++
        } else {
          if (typingEffect !== null) {
            clearInterval(typingEffect)
          }
          if (onCompleteRef.current) {
            onCompleteRef.current()
          }
        }
      }, duration)
    }

    return () => {
      if (typingEffect !== null) {
        clearInterval(typingEffect)
      }
    }
  }, [children, duration, started])

  const Tag = Component as any

  return (
    <Tag
      className={cn("text-sm font-normal tracking-tight", className)}
      {...props}
    >
      {displayedText}
    </Tag>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
  onComplete?: () => void
  title?: string
}

export const Terminal = ({
  children,
  className,
  onComplete,
  title = "~/gabrielvazquez – zsh",
}: TerminalProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const validElementsCount = useMemo(() => {
    return Children.toArray(children).filter(isValidElement).length
  }, [children])

  const handleChildComplete = useCallback((index: number) => {
    setActiveIndex((current) => {
      const next = index === current ? current + 1 : current
      if (next === validElementsCount && onComplete) {
        onComplete()
      }
      return next
    })
  }, [validElementsCount, onComplete])

  const wrappedChildren = useMemo(() => {
    let elementIndex = 0
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        const currentIndex = elementIndex
        elementIndex++
        return cloneElement(child, {
          active: activeIndex >= currentIndex,
          onComplete: () => handleChildComplete(currentIndex),
        } as any)
      }
      return child
    })
  }, [children, activeIndex, handleChildComplete])

  return (
    <div
      className={cn(
        "border border-[var(--glass-border)] bg-[var(--bg-secondary)]/80 backdrop-blur-md z-0 w-full max-w-md rounded-2xl shadow-xl overflow-hidden font-mono",
        className
      )}
    >
      <div className="border-b border-[var(--glass-border)] flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)]/80">
        <div className="flex flex-row gap-x-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="text-[10px] font-medium text-[var(--text-secondary)]">{title}</span>
        <div className="w-10"></div>
      </div>
      <pre className="p-5 font-mono text-xs leading-relaxed text-[var(--text-primary)]">
        <code className="grid gap-y-2 overflow-auto">{wrappedChildren}</code>
      </pre>
    </div>
  )
}
