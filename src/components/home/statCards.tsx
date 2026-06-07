'use client'

import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import icons from "@/src/const/icons";
import AnimatedContainer from "../ui/animatedContainer";
import { LiquidOverlayVarient1 } from "../ui/liquidOverlay";

interface statCardsProp {
    icon: "user" | "dollor" | "delayedPayments" | "attendence",
    heading: string,
    total: number,
    percentage: number,
    growth: boolean
}

const StatCard = ({ icon, heading, total, percentage, growth }: statCardsProp) => {
    return (
        <AnimatedContainer className="container group relative flex bg-black/10 backdrop-blur-2xl p-5 rounded-2xl gap-4 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_28px_-12px_rgba(0,0,0,0.6)]">
            {/* Liquid System Overlays */}
            <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
            
            {/* Background Light Bleed based on Growth vs Decline status */}
            <div className={`absolute inset-0 bg-linear-to-br opacity-5 pointer-events-none transition-opacity duration-300 group-hover:opacity-10 ${
                growth ? "from-[#0affca] to-transparent" : "from-red-500 to-transparent"
            }`} />

            {/* Left Info Column */}
            <div className="relative z-10 flex flex-col flex-1 justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">
                        {heading}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white/90 tracking-wide mt-0.5">
                        {total.toLocaleString()}
                    </h3>
                </div>

                {/* Glass Micro Separator Line */}
                <div className="h-[1px] w-full bg-linear-to-r from-white/10 via-white/5 to-transparent" />

                {/* Trend Context Strip */}
                <div className="flex gap-2 items-center text-[11px] font-sans">
                    <div className={`flex items-center gap-1 font-bold ${
                        growth ? "text-[#0affca]" : "text-red-400"
                    }`}>
                        {growth ? (
                            <FaArrowUp size={11} className="animate-bounce" style={{ animationDuration: '3s' }} />
                        ) : (
                            <FaArrowDown size={11} className="animate-bounce" style={{ animationDuration: '3s' }} />
                        )}
                        <span className="font-mono">{growth ? "+" : "-"}{percentage}%</span>
                    </div>
                    <span className="text-white/30 uppercase tracking-wider font-medium text-[10px]">
                        vs Last Month
                    </span>
                </div>
            </div>

            {/* Right Icon Capsule Column */}
            <div className="relative z-10 flex items-start justify-center pt-1">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors duration-300 ${
                    growth ? "text-[#0affca]/70 group-hover:text-[#0affca] group-hover:border-[#0affca]/20" : "text-white/40 group-hover:text-red-400 group-hover:border-red-500/20"
                }`}>
                    {icons[icon] && icons[icon]({ size: 22 })}
                </div>
            </div>
        </AnimatedContainer>
    );
}

export default StatCard;