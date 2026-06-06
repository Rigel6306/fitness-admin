'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const NavBar = () => {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/members", label: "Members" },
        { href: "/payment", label: "Payment" },
    ];

   
    const activeIndex = navLinks.findIndex(link => link.href === pathname);

    return (
        <nav className="flex sticky top-0 h-16 items-center backdrop-blur-md text-[#E4E4E4] bg-black/20 border-b border-white/5 shadow-lg justify-between px-10 z-50 antialiased">

            <div className="heading text-lg font-semibold tracking-wider text-white/90 uppercase font-sans">
                <h1>Superbody Gym</h1>
            </div>

            {/* Nav Container with Dynamic Kinetic Shifting */}
            <motion.div 
                className="linksContainer flex gap-1 relative bg-white/2 p-1 rounded-2xl border border-white/15 shadow-inner shadow-white/5 origin-center"
              
                key={activeIndex}
                animate={{
                    scaleX: [1, 1.01, 0.99, 1,1],
                    scaleY: [1, 0.88, 1.01, 1.01,1],
                }}
                transition={{
                    duration: 0.6,
                    ease: [0.19, 1, 0.22, 1]
                }}
            >
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-300 rounded-xl outline-none select-none uppercase ${
                                isActive ? "text-white" : "text-white/40 hover:text-white/80"
                            }`}
                        >
                           
                            <motion.span 
                                className="relative z-10 block origin-center text-center font-sans mix-blend-difference"
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
                                {link.label}
                            </motion.span>

                           
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className={`
                                        absolute inset-0 z-0 rounded-xl
                                        /* 1. Base Liquid Gradient Color */
                                        bg-linear-to-b from-white/16 to-white/3 
                                        /* 2. Glass Specular Edge Glow */
                                        border border-t-white/35 border-x-white/20 border-b-white/10
                                        /* 3. High-Refractive Liquid Glow Shadows */
                                        shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)]
                                        /* 4. Backdrop amplification for fluid look */
                                        backdrop-blur-[2px]
                                    `}
                                    
                                    animate={{
                                       scaleX: [0.85, 1.15, 0.95, 1],
                                       scaleY: [1.1, 0.9, 1.05, 1]
                                    }}
                                    
                                    transition={{
                                        layout: {
                                            type: "spring",
                                            stiffness: 220, 
                                            damping: 25,    
                                            mass: 1.3,      
                                        },
                                        default: {
                                            duration: 0.55,
                                            ease: [0.19, 1, 0.22, 1] 
                                        }
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
};

export default NavBar;