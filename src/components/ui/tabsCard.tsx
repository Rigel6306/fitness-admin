"use client"

import { useState } from "react"
import { motion, LayoutGroup } from "motion/react"

interface CustomTabsProps {
  setMode: (mode: boolean) => void
}

export const CustomTabsWithTooltips = ({ setMode }: CustomTabsProps) => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [type, setType] = useState("noAi")

  const tabs = [
    {
      id: "noAi",
      label: "Fully Manual Mode",
      description: "No AI suggestions and spellcheck.",
    },
    {
      id: "ai",
      label: "AI Assist Mode",
      description: "AI Assist by providing suggestions and spellcheck.",
    },
  ]

  // Find active index to trigger your keyframe container pulse layout
  const activeIndex = tabs.findIndex((tab) => tab.id === type)

  const handleNavClick = (id: string) => {
    id === "ai" ? setMode(true) : setMode(false)
    setType(id)
  }

  return (

    <LayoutGroup id="custom-tabs-liquid-pool">
      <div className="flex flex-col items-center gap-2 w-fit antialiased">
        <motion.div 
          className="btnContainer flex gap-1 relative bg-white/2 p-1 rounded-2xl border border-white/15 shadow-inner shadow-white/5 origin-center"
          key={activeIndex}
          animate={{
            scaleX: [1, 1.01, 0.99, 1.01, 1],
            scaleY: [1, 0.88, 1.01, 1.01, 1],
          }}
          transition={{
           
            duration: 0.7,
            ease: [0.19, 1, 1.22, 1]
          }}
        >
          {tabs.map((tab) => {
            const isActive = type === tab.id

            return (
              <div
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                onMouseEnter={() => setHovered(tab.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-300 rounded-xl outline-none select-none uppercase cursor-pointer z-10 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
              >
               
                <motion.span 
                  className="relative block origin-center text-center font-sans mix-blend-difference font-semibold"
                  animate={{ 
                    scale: isActive ? 1.02 : 1,
                    y: isActive ? -0.5 : 0,
                    scaleX: isActive ? [0.94, 1.06, 0.98, 1] : 1,
                    scaleY: isActive ? [1.04, 0.96, 1.01, 1] : 1
                  }}
                  transition={{
                   
                    scale: { type: "spring", stiffness: 450, damping: 22 },
                    y: { type: "spring", stiffness: 450, damping: 22 },
                    default: {
                      duration: 0.55,
                      ease: [0.19, 1, 0.22, 1]
                    }
                  }}
                >
                  {tab.label}
                </motion.span>

           
                {isActive && (
                  <motion.div
                    layoutId="activeTabSelectionBubble"
                    className="absolute inset-0 z-0 rounded-xl bg-linear-to-b from-white/4 via-black10 to-white/3 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[1px]"
                    animate={{
                       scaleX: [0.85, 1.15, 0.95, 1],
                       scaleY: [1.1, 0.9, 1.05, 1]
                    }}
                    transition={{
                        layout: {
                          delay:0.34,
                            type: "spring",
                            stiffness: 250, 
                            damping: 22,    
                            mass: 1,      
                        },
                        default: {
                            duration: 0.55,
                            ease: [0.19, 1, 0.22, 1] 
                        }
                    }}
                  />
                )}
              </div>
            )
          })}
        </motion.div>
      </div>
    </LayoutGroup>
  )
}