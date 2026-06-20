'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Variants } from "motion/react";
const NavBar = () => {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/members", label: "Members" },
        { href: "/payment", label: "Payment" },
    ];

    const activeIndex = navLinks.findIndex(link => {
        if (link.href === "/") return pathname === "/";
        return pathname.startsWith(link.href);
    });

    // Track previous index to determine travel direction and distance
    const prevIndexRef = useRef(activeIndex);
    const [direction, setDirection] = useState(0); // -1 for Left, 1 for Right, 0 for static

    useEffect(() => {
        if (activeIndex !== prevIndexRef.current && activeIndex !== -1 && prevIndexRef.current !== -1) {
            // Calculate direction: positive means moving right, negative means moving left
            const dir = activeIndex > prevIndexRef.current ? 1 : -1;
            setDirection(dir);
        }
        prevIndexRef.current = activeIndex;
    }, [activeIndex]);

    // Container variant that dynamically reacts to the movement direction
    const containerVariants :Variants = {
        animate: (dir: number) => ({
            scaleX: dir === 0 ? 1 : [1, dir * 0.02 + 1, dir * -0.01 + 1, 1], // Skews subtly in the direction of movement
            scaleY: dir === 0 ? 1 : [1, 0.92, 1.01, 1],
            transition: {
                duration: 0.55,
                ease: [0.25, 1, 0.5, 1] // Matches the fluid layout pacing
            }
        })
    };

    return (
        <nav className="flex sticky top-0 h-16 items-center backdrop-blur-md text-[#E4E4E4] bg-black/20 border-b border-white/5 shadow-lg justify-between px-10 z-50 antialiased">

            <div className="heading text-lg font-semibold tracking-wider text-white/90 uppercase font-sans">
                <h1>Superbody Gym</h1>
            </div>

            {/* Nav Container - KEY REMOVED to prevent rough unmounting glitches */}
            <motion.div
                className="linksContainer flex gap-1 relative bg-black/2 p-1 rounded-2xl border border-white/15 shadow-inner shadow-white/5 origin-center"
                variants={containerVariants}
                animate="animate"
                custom={direction}
                // We reset direction when the mini-squish loop finishes
                onAnimationComplete={() => setDirection(0)} 
            >
                {navLinks.map((link) => {
                    const isActive = link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-300 rounded-xl outline-none select-none uppercase ${
                                isActive ? "text-[#b17df5]" : "text-white/40 hover:text-white/80"
                            }`}
                        >
                            <span className="relative z-10 block origin-center text-center font-sans mix-blend-difference">
                                {link.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className="absolute inset-0 z-0 rounded-xl bg-linear-to-b from-white/10 via-black/10 to-white/13 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[2px]"
                                    animate={{
                                        // The indicator stretches slightly horizontally based on momentum
                                        scaleX: [0.85, 1.14, 0.95, 1],
                                        scaleY: [1.01, 0.95, 1.02, 1]
                                    }}
                                    transition={{
                                        layout: {
                                            type: "spring",
                                            stiffness: 220, // Boosted slightly to stay snappy over longer distances
                                            damping: 25,    // Balanced to perfectly prevent scattering
                                            mass: 1.1,      
                                        },
                                        default: {
                                            duration: 0.6,
                                            ease: [0.16, 1, 0.3, 1]
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


//                 animate={{
//                     scaleX: [1, 1.01, 0.99, 1, 1],
//                     scaleY: [1.03, 0.88, 1.01, 1.01, 1],
//                 }}
//                 transition={{
//                     duration: 0.6,
//                     ease: [0.19, 1, 0.22, 1]
//                 }}


//  animate={{
//                                         scaleX: [0.85, 1.15, 0.95, 1],
//                                         scaleY: [1.1, 0.9, 1.05, 1]
//                                     }}

//                                     transition={{
//                                         layout: {
//                                             type: "spring",
//                                             stiffness: 220,
//                                             damping: 25,
//                                             mass: 1.3,
//                                         },
//                                         default: {
//                                             duration: 0.55,
//                                             ease: [0.19, 1, 0.22, 1]
//                                         }
//                                     }}