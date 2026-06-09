'use client';

import { useState, ReactNode } from "react";
import { motion, LayoutGroup } from "motion/react";

interface GlassLiquidButtonProps {
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  /**
   * Optional theme for the button.
   * 'white' for frosted glass, 'black' for dark smoky glass.
   * Defaults to 'black'.
   */
  theme?: 'white' | 'black';
}

const GlassLiquidButton = ({
  onClick,
  children,
  icon,
  className = "",
 
}: GlassLiquidButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  
  
  // Outer frame is now visually empty—it acts strictly as a hit-box and structural scale container
  const containerBg = "bg-transparent"; 
  
  // The overlay handles all structural glass styles safely
  const overlayBg = "from-white/10 via-black/5 to-white/10 border-t-white/30 border-b-white/5";
  const shadowColor =  "rgba(255,255,255,0.05)";

  return (
    <LayoutGroup id="glass-liquid-btn-isolated">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // Added overflow-visible to ensure the wobble isn't clipped by the parent frame
        className={`btnContainer flex gap-2 ${containerBg}  rounded-4xl py-2 px-5 items-center justify-center relative origin-center text-white border border-transparent cursor-pointer select-none overflow-visible  ${className}`}
        
        // Synchronized the parent container's micro-stretch to scale with the child cleanly
        animate={{
          scaleX: isHovered ? 1.02 : 1,
          scaleY: isHovered ? 0.99 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        {/* Content Layer (Text and Icon) */}
        <motion.div
          className="flex items-center gap-2 relative z-10 font-semibold mix-blend-difference"
          animate={{
            scale: isHovered ? 1.02 : 1,
            y: isHovered ? -0.5 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        >
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {children}
        </motion.div>

        {/* Liquid Glass Bubble Overlay - Now entirely handles the glass visualization */}
        <motion.div
          layoutId="liquidGlassBubbleOverlay"
          className={`absolute inset-0 z-0 rounded-xl bg-linear-to-b from-white/10 via-black/10 to-white/13 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[2px]`}
          initial={{ opacity: 0.6 }}
          animate={{
            opacity: isHovered ? 1 : 0.6,
            scaleX: isHovered ? [1, 1.08, 0.97, 1] : [1, 0.98, 1],
            scaleY: isHovered ? [1, 0.91, 1.03, 1] : [1, 1.02, 1],
          }}
          transition={{
            opacity: { duration: 0.25 },
            scaleX: {
              duration: 0.65,
              ease: isHovered 
                ? [[0.34, 1.56, 0.64, 1], [0.25, 1, 0.5, 1], [0.25, 1, 0.5, 1]]
                : [[0.25, 1, 0.5, 1], [0.25, 1, 0.5, 1]]
            },
            scaleY: {
              duration: 0.65,
              ease: isHovered 
                ? [[0.34, 1.56, 0.64, 1], [0.25, 1, 0.5, 1], [0.25, 1, 0.5, 1]]
                : [[0.25, 1, 0.5, 1], [0.25, 1, 0.5, 1]]
            },
            layout: { type: "spring", stiffness: 250, damping: 25 }
          }}
        />
      </motion.button>
    </LayoutGroup>
  );
};

export default GlassLiquidButton;