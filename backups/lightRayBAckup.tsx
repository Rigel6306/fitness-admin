"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion } from "motion/react"
import { twMerge } from "tailwind-merge"

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
}

type LightRay = {
  id: string
  left: number
  top: number
  width: number
  height: number
  delay: number
  duration: number
  intensity: number
}

const createRays = (count: number, cycle: number): LightRay[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    const left = -40 + Math.random() * 180
    // Keep it pulled well above the visual frame (-60% down to -30%)
    const top = -60 + Math.random() * 30
    
    const width = 400 + Math.random() * 220 
    const height = 450 + Math.random() * 220 
    const delay = Math.random() * cycle
    const duration = cycle * (1.2 + Math.random() * 0.8) 
    const intensity = 0.75 + Math.random() * 0.45

    return {
      id: `${index}-${Math.round(left * 10)}`,
      left,
      top,
      width,
      height,
      delay,
      duration,
      intensity,
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
}: LightRay) => {
  // Moderated drift y so it doesn't drop the top edge below the overflow clip
  const driftX = 15 + Math.random() * 35;
  const driftY = 5 + Math.random() * 15;

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full mix-blend-screen blur-(--light-rays-blur) will-change-transform"
      style={
        {
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}px`,
          height: `${height}px`,
          background: "var(--light-rays-gradient)",
          transformOrigin: "center center",
          transform: "translateZ(0)", 
        } as CSSProperties
      }
      animate={{
        opacity: [0.25, 0.7 * intensity, 0.4, 0.75 * intensity, 0.25],
        
        x: [0, driftX, -driftX, driftX * 0.5, 0],
        y: [0, -driftY, driftY, -driftY * 0.3, 0],
        
        scale: [1, 1.2, 0.95, 1.12, 1],
        rotate: [0, 5, -8, 3, 0]
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
  count = 6, 
  blur = 45, // Slightly higher blur to seamlessly diffuse the new transparent transitions
  speed = 4, 
  length = "55vh",
  ref,
  ...props
}: LightRaysProps) {
  const [rays, setRays] = useState<LightRay[]>([])
  const cycleDuration = Math.max(speed, 0.2)

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
          /* FIXED GRADIENT: Added a transparent cushion at the top (0% to 15%) 
             This forces the smoky colors to fade out COMPLETELY before reaching the box's top boundary */
          "--light-rays-gradient":
            "linear-gradient(to bottom, transparent 70%, #ff007f 35%, #ffaa00 15%, #00ff66 35%, #00f0ff 50%, transparent 100%)",
          "--light-rays-blur": `${blur}px`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {/* Outer Viewport Buffer: Pushes the inner workspace upwards, 
          ensuring structural rendering anomalies happen completely off-screen */}
      <div className="absolute -top-32 bottom-0 left-0 right-0 overflow-hidden">
        
        { <motion.div
          aria-hidden
          className="absolute inset-0 mix-blend-screen will-change-transform"
          animate={{
            opacity: [0.4, 0.65, 0.35, 0.55, 0.4],
            scale: [1, 1.12, 1, 1.05, 1],
            x: [0, 10, -10, 5, 0],
            y: [0, -5, 10, -5, 0]
          }}
          transition={{
            duration: cycleDuration * 1.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={
            {
              // Pushed the radial focus point out towards the top boundary safely
              background:
                "radial-gradient(circle at 15% 55%, #9746e3 10%, transparent 55%)",
              transform: "translateZ(0)",
            } as CSSProperties
          }
        /> }

        {/* Dynamic Nebulous Horizon Glow (Underlay 2) */}
        <motion.div
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
                "radial-gradient(circle at 100% 15%, #9ed94c 0%, #683bd1 31%, transparent 55%)",
              transform: "translateZ(0)",
            } as CSSProperties
          }
        />

        {/* Smooth Cloudy Nebula Fluid Matrix */}
        {rays.map((ray) => (
          <Ray key={ray.id} {...ray} />
        ))}
      </div>
    </div>
  )
} 