'use client';

import { useState, ReactNode } from "react";
import { motion, LayoutGroup } from "motion/react";

interface GlassLiquidCardProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  /**
   * Optional base color for the bubble.
   * 'white' (light) or 'black' (dark). Default is 'black'.
   */
  theme?: 'white' | 'black';
}

const GlassLiquidCard = ({
  children,
  icon,
  className = "",
  theme = "black" // Match your button and UI default
}: GlassLiquidCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Set up sleek monochrome glass backgrounds based on selected theme
  const isDark = theme === "black";
  
  // The overlay handles all structural glass styles safely
  const overlayBg = isDark 
    ? "from-black/50 to-black/30 border-t-white/10 border-b-black/40" 
    : "from-white/15 to-white/5 border-t-white/30 border-b-white/5";
  const shadowColor = isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.05)";

  return (
    <LayoutGroup id="glass-liquid-card-isolated">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // Match the layout styles from your existing AnimatedContainer
        className={`rounded-md bg-transparent backdrop-blur-md relative origin-center text-white cursor-default select-none overflow-visible h-25 ${className}`}
        
        // Match the card's animation behavior
        animate={{
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        {/* Content Layer (Icons and Text) */}
        <motion.div
          className="flex items-center gap-6 relative z-10 w-full"
          animate={{
            scale: isHovered ? 1.01 : 1,
            y: isHovered ? -0.5 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        >
          {icon && <span className="flex items-center justify-center mix-blend-difference">{icon}</span>}
          <div className="flex flex-col mix-blend-difference">
            {children}
          </div>
        </motion.div>

        {/* Liquid Glass Bubble Overlay - Identical to your button for cohesion */}
        <motion.div
          layoutId="liquidGlassBubbleOverlay"
          className={`absolute inset-0 z-0 rounded-md bg-linear-to-b ${overlayBg} border border-x-white/10 shadow-[0_8px_20px_-6px_${shadowColor},inset_0_1px_1px_rgba(255,255,255,0.15)]`}
          initial={{ opacity: 0.6 }}
          animate={{
            opacity: isHovered ? 1 : 0.6,
            // Reusing your optimized keyframe matrices
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
      </motion.div>
    </LayoutGroup>
  );
};

export default GlassLiquidCard;