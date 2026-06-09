import React, {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  useRef,
  useState,
  useEffect,
} from "react"

import { twMerge } from "tailwind-merge"
interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  numCircles?: number
  mainCircleOpacity?: number
}

export const Ripple = React.memo(function Ripple({
  numCircles = 8,
  mainCircleOpacity = 0.24,
  className,
  ...props
}: RippleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize(Math.min(width, height))
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,blue,transparent)] select-none",
        className
      )}
      {...props}
    >
      { containerSize>0 && Array.from({ length: numCircles }, (_, i) => {
        // scale circle sizes relative to container
        const step = containerSize / (numCircles+1 )
        const size = step * (i + 1)
        const opacity = mainCircleOpacity - i * 0
        const animationDelay = `${i * 0.4}s`

        return (
          <div
            key={i}
            className="animate-ripple bg-[#0cceff]  absolute rounded-full border shadow-xl"
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: `var(--foreground)`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
})

Ripple.displayName = "Ripple"
