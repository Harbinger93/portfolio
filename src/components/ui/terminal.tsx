import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
  type ComponentType,
  type RefAttributes,
} from "react"
import {
  motion,
  type DOMMotionComponents,
  type HTMLMotionProps,
  type MotionProps,
} from "framer-motion"
import { cn } from "@/lib/utils"

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>
type TerminalTypingMotionComponent = ComponentType<
  Omit<HTMLMotionProps<"span">, "ref"> & RefAttributes<HTMLElement>
>

interface AnimatedSpanProps extends MotionProps {
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

  // Keep a stable ref to onComplete so updates to it do not trigger the typing/animation effects
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
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={hasStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={cn("grid text-sm font-normal tracking-tight", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface TypingAnimationProps extends Omit<MotionProps, "children"> {
  children: string
  className?: string
  duration?: number
  delay?: number
  as?: MotionElementType
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

  const MotionComponent = motionElements[
    Component
  ] as TerminalTypingMotionComponent

  const [displayedText, setDisplayedText] = useState<string>("")
  const [started, setStarted] = useState(false)

  // Keep a stable ref to onComplete to avoid resetting the typing interval
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

  return (
    <MotionComponent
      className={cn("text-sm font-normal tracking-tight", className)}
      {...props}
    >
      {displayedText}
    </MotionComponent>
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

  // Count only valid React elements to ensure proper indexing and completion check
  const validElementsCount = useMemo(() => {
    return Children.toArray(children).filter(isValidElement).length
  }, [children])

  // Stable callback handler for child completion that prevents recreating callbacks
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
