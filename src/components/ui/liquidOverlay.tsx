import { twMerge } from "tailwind-merge";
import { memo } from "react";

const LiquidOverlay = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl select-none pointer-events-none">

            {/* Layer 1: Deepened base clarity + volumetric gel tint (slightly darker) */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{
                    // Reduced brightness: lower alpha on light tones, added a hint of dark
                    background: `radial-gradient(circle at 50% 50%, 
                        rgba(200, 220, 240, 0) 60%, 
                        rgba(150, 180, 210, 0.04) 80%, 
                        rgba(60, 90, 120, 0.15) 100%)`,
                    boxShadow: '0 25px 45px -12px rgba(0,0,0,0.65)'  // darker outer shadow
                }}
            />

            {/* Layer 2: Enhanced fluid meniscus (dimmed rim highlights, stronger bottom shadow) */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 55%),
                        radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%),
                        radial-gradient(ellipse at 50% 5%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)
                    `,
                    boxShadow: `
                        inset 0 1px 2px 1px rgba(255,255,255,0.4),
                        inset 0 4px 10px -4px rgba(255,255,255,0.2),
                        inset 0 -8px 20px -8px rgba(0,0,0,0.75),
                        inset 0 0 0 1px rgba(255,255,255,0.15),
                        0 0 0 1px rgba(0,0,0,0.3),
                        0 12px 28px -8px rgba(0,0,0,0.5)
                    `,
                }}
            />

            {/* Layer 3: Main studio glare – reduced brightness */}
            <div
                className="absolute top-0.5 left-0.75 right-0.75 h-[45%] rounded-t-[20px] pointer-events-none mix-blend-overlay"
                style={{
                    background: 'radial-gradient(ellipse at 45% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0) 80%)',
                    borderTop: '1px solid rgba(255,255,255,0.25)'
                }}
            />

            {/* Layer 4: Secondary bounce reflection – softer */}
            <div
                className="absolute bottom-0.75 left-1.25 right-1.25 h-[22%] rounded-b-[20px] pointer-events-none mix-blend-screen"
                style={{
                    background: 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0) 100%)'
                }}
            />

            {/* Layer 5: Gel core depth – cooler and slightly darker */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 30% 40%, 
                        rgba(100, 130, 170, 0.1) 0%, 
                        rgba(60, 80, 110, 0.05) 50%, 
                        transparent 80%)`,
                    mixBlendMode: 'soft-light'
                }}
            />

            {/* Layer 6: Edge refraction glow – dimmed white, added dark inner rim */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    boxShadow: `inset 0 0 18px 6px rgba(0,0,0,0.2),
                                inset 0 0 3px 1px rgba(255,255,255,0.25),
                                0 0 0 1px rgba(0,0,0,0.2)`,
                    borderRadius: 'inherit'
                }}
            />

            {/* Layer 7: Micro‑specular shimmer – reduced opacity */}
            <div
                className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none opacity-20"
                style={{
                    background: `repeating-linear-gradient(
                        105deg,
                        rgba(255,255,255,0) 0%,
                        rgba(255,255,255,0.08) 8%,
                        rgba(255,255,255,0) 16%
                    )`,
                    backgroundSize: '200% 100%',
                    mixBlendMode: 'overlay'
                }}
            />
        </div>
    );
}
interface LiquidOverlayVarient1Props {
    className?: string
}

export const LiquidOverlayVarient1 = memo(({ className }: LiquidOverlayVarient1Props) => {
    return (
        <div
            className={twMerge(
                "absolute inset-0 z-0 rounded-2xl  border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.05),inset_0_1.2px_1px_rgba(255,255,255,0.15)] backdrop-blur-sm",
                className
            )}
        />
    );
}, (prev, next) => prev.className === next.className);

LiquidOverlayVarient1.displayName = 'LiquidOverlayVarient1';

export default LiquidOverlay;