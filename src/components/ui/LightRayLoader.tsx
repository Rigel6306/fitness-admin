"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion, useAnimation } from "motion/react"
import { twMerge } from "tailwind-merge"

interface EtherealFogLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // Progress from 0 to 100
  max?: number
  blur?: number // Core fog softness factor
  speed?: number // Lower = faster turbulence, Higher = calmer smoke drift
  onComplete?: () => void // Optional callback fired after explosion finishes
}

type FogCloud = {
  id: string
  left: number
  top: number
  size: number
  delay: number
  duration: number
  intensity: number
  gradient: string
  borderRadius: string
  explodeX: number
  explodeY: number
}

// BIFROST HIGH-CONTRAST COSMIC MATRIX
const BIFROST_COLOR_PALETTES = [
 "linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 215, 0, 0.85) 15%, rgba(139, 92, 246, 0.6) 60%, rgba(76, 29, 149, 0) 100%)",

  // 2. Quantum Aurora (Electric Mint -> Ghostly Aquamarine -> Deep Space Navy)
  "linear-gradient(to bottom, rgba(52, 211, 153, 0.9) 0%, rgba(45, 212, 191, 0.75) 25%, rgba(59, 130, 246, 0.5) 65%, rgba(30, 58, 138, 0) 100%)",

  // 3. Dark Matter Flare (Electric Magenta -> Ultraviolet -> Midnight Blue)
  "linear-gradient(to bottom, rgba(244, 63, 94, 0.9) 0%, rgba(217, 70, 239, 0.75) 30%, rgba(79, 70, 229, 0.5) 70%, rgba(15, 23, 42, 0) 100%)",
//   "linear-gradient(to bottom, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.8) 20%, rgba(168, 85, 247, 0.5) 65%, rgba(168, 85, 247, 0) 100%)"
]

const createFogClouds = (count: number, speedFactor: number): FogCloud[] => {
  return Array.from({ length: count }, (_, index) => {
    const r1 = 35 + Math.random() * 40
    const r2 = 35 + Math.random() * 40
    const r3 = 35 + Math.random() * 40
    const r4 = 35 + Math.random() * 40
    
    const angle = Math.random() * Math.PI * 2
    const distance = 320 + Math.random() * 380 

    return {
      id: `bifrost-cloud-${index}-${Math.random().toString(36).substr(2, 9)}`,
      left: Math.random() * 100, 
      top: -40 + Math.random() * 50,   
      size: 60 + Math.random() * 70,   
      delay: Math.random() * speedFactor * 0.15,
      duration: speedFactor * (0.6 + Math.random() * 0.8), 
      intensity: 0.85 + Math.random() * 0.15, // Higher baseline visibility for defined smoke shapes
      gradient: BIFROST_COLOR_PALETTES[Math.floor(Math.random() * BIFROST_COLOR_PALETTES.length)],
      borderRadius: `${r1}% ${100 - r1}% ${r2}% ${100 - r2}% / ${r3}% ${r4}% ${100 - r4}% ${100 - r3}%`,
      explodeX: Math.cos(angle) * distance,
      explodeY: Math.sin(angle) * distance * 1.15
    }
  })
}

export function EtherealFogLoader({
  className,
  style,
  value = 0,
  max = 100,
  blur = 12, // Reduced slightly to sharpen and make the colors pop inside the track
  speed = 2.2, 
  onComplete,
  ...props
}: EtherealFogLoaderProps) {
  const [clouds, setClouds] = useState<FogCloud[]>([])
  const [isExploding, setIsExploding] = useState(false)
  const progressPercentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const controls = useAnimation()

  useEffect(() => {
    setClouds(createFogClouds(30, speed)) 
  }, [speed])

  useEffect(() => {
    if (progressPercentage >= 100 && !isExploding) {
      setIsExploding(true)
      controls.start("explode").then(() => {
        if (onComplete) onComplete()
      })
    } else if (progressPercentage < 100 && isExploding) {
      setIsExploding(false)
      controls.start("loop")
    }
  }, [progressPercentage, isExploding, controls, onComplete])

  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-12 select-none pointer-events-none z-50">
      
      <div
        className={twMerge("w-full max-w-2xl relative overflow-visible flex items-center justify-center", className)}
        style={{ "--fog-blur": `${blur}px`, ...style } as CSSProperties}
        {...props}
      >
        {/* Outer Conduit Track - Imbued with deep layered external bloom values */}
        <motion.div 
          className="relative h-4.5 w-full rounded-full bg-slate-950/95 border border-white/20 overflow-visible flex items-center shadow-[0_0_30px_rgba(0,255,213,0.45),0_0_60px_rgba(255,0,128,0.3),0_0_90px_rgba(147,51,234,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]"
          animate={isExploding ? { scale: [1, 1.05, 0.95], opacity: 0, filter: "blur(6px)" } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          
          {/* Enhanced Thick Volumetric Blooming Exterior Aura */}
          <motion.div 
            className="absolute inset-y-0 left-0 rounded-full mix-blend-screen pointer-events-none opacity-85"
            style={{ 
              width: `${progressPercentage}%`,
              background: "linear-gradient(90deg, #ffaa00 0%, #ff0080 35%, #9333ea 70%, #00ffd5 100%)",
              filter: "blur(28px)", // Blown out radiant corona footprint
            }}
            animate={isExploding ? { scale: 5.0, opacity: 0 } : { opacity: [0.65, 0.9, 0.65] }}
            transition={isExploding ? { duration: 1.2, ease: "easeOut" } : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Progress Mask Container */}
          <div 
            className={twMerge(
              "absolute inset-0 h-full rounded-full transition-all duration-500 ease-out",
              isExploding ? "overflow-visible" : "overflow-hidden"
            )}
            style={{ width: isExploding ? "100%" : `${progressPercentage}%` }}
          >
            {/* Ultra-Vibrant Underlying Fluidic Laser Bed */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-pink-600/30 to-cyan-500/30 mix-blend-color-dodge animate-pulse" />

            {/* Billowing High-Contrast Inside Smoke Particles */}
            <div className="absolute inset-0 overflow-visible">
              {clouds.map((cloud) => {
                const driftX = 25 + Math.random() * 35
                const driftY = 10 + Math.random() * 16

                const cloudVariants = {
                  loop: {
                    opacity: [0.2, cloud.intensity, cloud.intensity * 0.6, 0.1, 0.2],
                    x: [-driftX * 0.1, driftX, -driftX * 0.3, driftX * 0.6, -driftX * 0.1],
                    y: [0, -driftY, driftY, -driftY * 0.2, 0],
                    rotate: [0, 180, 360],
                    scale: [0.9, 1.25, 0.85, 1.15, 0.9],
                    transition: {
                      duration: cloud.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: cloud.delay,
                    }
                  },
                  explode: {
                    x: cloud.explodeX,
                    y: cloud.explodeY,
                    scale: [1, 4.5, 6.5], 
                    opacity: [null, cloud.intensity * 2.0, 0], 
                    filter: "blur(calc(var(--fog-blur) * 2.5))", 
                    transition: {
                      duration: 1.3 + Math.random() * 0.4,
                      ease: [0.05, 0.85, 0.15, 1], 
                    }
                  }
                }

                return (
                  <motion.div
                    key={cloud.id}
                    className="absolute mix-blend-screen will-change-transform opacity-0"
                    style={{
                      left: `${cloud.left}%`,
                      top: `${cloud.top}%`,
                      width: `${cloud.size}px`,
                      height: `${cloud.size}px`,
                      background: cloud.gradient,
                      borderRadius: cloud.borderRadius,
                      filter: "blur(calc(var(--fog-blur) * 0.5))", // Sharper gas containment factor
                    }}
                    variants={cloudVariants}
                    animate={controls}
                    initial="loop"
                  />
                )
              })}
            </div>

            {/* Leading Edge Tip - Bifrost Gateway Core Element */}
            {!isExploding && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-36 -mr-12 pointer-events-none overflow-visible">
                <motion.div 
                  className="w-full h-full bg-gradient-to-l from-white via-cyan-400 to-transparent rounded-full mix-blend-screen absolute inset-0 shadow-[0_0_40px_rgba(0,255,213,0.9)]"
                  style={{ filter: "blur(8px)" }}
                  animate={{ scale: [0.9, 1.2, 0.95, 1.1, 0.9] }}
                  transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-full h-full bg-gradient-to-l from-pink-500 via-amber-400/40 to-transparent rounded-full mix-blend-screen absolute inset-0"
                  style={{ filter: "blur(12px)" }}
                  animate={{ 
                    scale: [1, 1.25, 0.9, 1.2, 1],
                    y: ["-51%", "-49%", "-50.5%", "-49.5%", "-51%"]
                  }}
                  transition={{ duration: speed * 1.1, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>

          {/* Protective Polished Structural Framing Rings */}
          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none mix-blend-overlay bg-gradient-to-b from-white/15 to-transparent" />
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent mix-blend-screen" />
        </motion.div>
      </div>
    </div>
  )
}