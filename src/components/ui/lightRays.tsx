"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion } from "motion/react"
import { twMerge } from "tailwind-merge"

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
  count?: number
  blur?: number
  speed?: number // Lower = faster cycle, Higher = slower drift. Default is 4.
}

type LightRay = {
  id: string
  left: number
  top: number
  width: number
  height: string // Changed to string to support dynamic viewport heights (e.g., "25vh")
  delay: number
  duration: number
  intensity: number
  gradient: string
}

const RAY_COLOR_PALETTES = [
  // 1. Supernova Core (Blinding White -> Solar Gold -> Deep Velvet Violet)
  "linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 215, 0, 0.85) 15%, rgba(139, 92, 246, 0.6) 60%, rgba(76, 29, 149, 0) 100%)",

  // 2. Quantum Aurora (Electric Mint -> Ghostly Aquamarine -> Deep Space Navy)
  "linear-gradient(to bottom, rgba(52, 211, 153, 0.9) 0%, rgba(45, 212, 191, 0.75) 25%, rgba(59, 130, 246, 0.5) 65%, rgba(30, 58, 138, 0) 100%)",

  // 3. Dark Matter Flare (Electric Magenta -> Ultraviolet -> Midnight Blue)
  "linear-gradient(to bottom, rgba(244, 63, 94, 0.9) 0%, rgba(217, 70, 239, 0.75) 30%, rgba(79, 70, 229, 0.5) 70%, rgba(15, 23, 42, 0) 100%)",
  "linear-gradient(to bottom, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.8) 20%, rgba(168, 85, 247, 0.5) 65%, rgba(168, 85, 247, 0) 100%)"
]
const createRays = (count: number, speedFactor: number): LightRay[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    const left = -10 + Math.random() * 120

    const top = -5 + Math.random() * 5
    const randomHeight = 20 + Math.random() * 18
    const height = `${randomHeight}vh`
    const width = 150 + Math.random() * 250 
    const delay = Math.random() * speedFactor
    const duration = speedFactor * (0.8 + Math.random() * 0.8) 
    const intensity = 0.5 + Math.random() * 0.5
    const gradient = RAY_COLOR_PALETTES[Math.floor(Math.random() * RAY_COLOR_PALETTES.length)]

    return {
      id: `ray-${index}-${Math.random().toString(36).substr(2, 9)}`,
      left,
      top,
      width,
      height,
      delay,
      duration,
      intensity,
      gradient
    }
  })
}

const Ray = ({
  left,
  top,
  width,
  height,
  delay,
  duration,
  intensity,
  gradient,
}: LightRay) => {
  // Gentle sway settings
  const driftX = 8 + Math.random() * 15;
  const driftY = 2 + Math.random() * 6;

  return (
    <motion.div
      className="pointer-events-none absolute rounded-b-full mix-blend-screen blur-(--light-rays-blur) will-change-transform"
      style={
        {
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}px`,
          height: height, // Applies the unique 1/3 viewport height
          background: gradient,
          transformOrigin: "top center", // Crucial: forces scales and rotations to anchor at the top ceiling
          transform: "translateZ(0)", 
        } as CSSProperties
      }
      animate={{
        opacity: [0.1, 2.75 * intensity, 1.5, 0.0 * intensity, 0.1],
        x: [0, driftX, -driftX, driftX * 0.4, 0],
        y: [0, driftY, -driftY, driftY * 0., 0],
        // Controlled scaleY keeps them strictly bound to their 1/3 viewport limit
        scaleY: [1, 1.1, 0.95, 1.05, 1], 
        rotate: [-3, 1, -2, 2, -3]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut", 
        delay: delay,
      }}
    />

    
  )
}

export function LightRays({
  className,
  style,
  count = 10, 
  blur = 35,  
  speed = 2, // CONTROL SPEED HERE: Higher = slower/calmer, Lower (e.g. 2) = fast/energetic
  ref,
  ...props
}: LightRaysProps) {
  const [rays, setRays] = useState<LightRay[]>([])
  const cycleDuration = Math.max(speed, 0.1)

  useEffect(() => {
    setRays(createRays(count, cycleDuration))
  }, [count, cycleDuration])

  return (


    <div
      ref={ref}
      className={twMerge(
        "pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]",
        className
      )}
      style={
        {
          "--light-rays-blur": `${blur}px`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >


        {/* <motion.div
                  aria-hidden
                  className="absolute inset-0 mix-blend-screen will-change-transform"
                  animate={{
                    opacity: [0.01,0.21, 0.35, 0.46, 0.25, 0.01],
                    scale: [1, 1.09, 1.01, 1, 1],
                    x: [0, 45, 0, 5, 0],
                    y: [0, 10, -5, 5, 0]
                  }}
                  transition={{
                    duration: cycleDuration ,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={
                    {
                      background:
                        "radial-gradient(circle at 50% 115%, #9ed94c 0%, #683bd1 11%, transparent 35%)",
                      transform: "translateZ(0)",
                    } as CSSProperties
                  }
                /> */}

      
      <div className="absolute inset-0 overflow-hidden">
        {rays.map((ray) => (
          <Ray key={ray.id} {...ray} />
        ))}
      </div>
    </div>
  )
}