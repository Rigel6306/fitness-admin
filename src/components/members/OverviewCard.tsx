'use client'

import { BiUser } from "react-icons/bi";
import { PiCalendarStarFill } from "react-icons/pi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { CiMobile1 } from "react-icons/ci";
import { FaRegIdCard, FaChalkboardUser } from "react-icons/fa6";
import { BsGenderAmbiguous } from "react-icons/bs";
import { RiLineHeight } from "react-icons/ri";
import { LuWeight } from "react-icons/lu";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { FiTarget } from "react-icons/fi"; // Added a clean icon for the goal panel
import { motion } from 'motion/react';
import AnimatedContainer from "../ui/animatedContainer";
import { LiquidOverlayVarient1 } from "../ui/liquidOverlay";

const OverviewCard = ({ userInfo }) => {
    console.log('At Overview Card', userInfo);

    if (!userInfo) return null;

    return (
        <motion.div className="flex flex-col mt-6 gap-6 w-full">
            {/* Split Grid Panel Container */}
            <div className="cardContainer grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                
                {/* User Identity - Card 1 */}
                <AnimatedContainer className="flex flex-col relative rounded-2xl p-6 bg-black/10 backdrop-blur-2xl border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                    <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
                    
                    {/* Inner Content Stack with clean grid padding */}
                    <div className="relative z-10 flex flex-col gap-5">
                        
                        {/* Username */}
                        <div className="flex items-center gap-4 group">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-[#0affca]/80">
                                <BiUser size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">User Name</span>
                                <span className="text-white/90 font-medium font-sans text-sm mt-0.5">{userInfo.name}</span>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <PiCalendarStarFill size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Age</span>
                                <span className="text-white/80 font-semibold font-mono text-sm mt-0.5">{userInfo.age}</span>
                            </div>
                        </div>

                        {/* E-mail */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <MdOutlineAlternateEmail size={17} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">E-mail</span>
                                <span className="text-white/80 font-medium font-sans text-sm truncate mt-0.5">{userInfo.email}</span>
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <CiMobile1 size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Contact Number</span>
                                <span className="text-white/80 font-medium font-mono text-sm mt-0.5">{userInfo.contactNumber}</span>
                            </div>
                        </div>

                        {/* Membership Number */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <FaRegIdCard size={17} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Membership Number</span>
                                <span className="text-[#0affca] font-bold font-mono text-sm tracking-wide mt-0.5">{userInfo.membershipNumber}</span>
                            </div>
                        </div>
                    </div>
                </AnimatedContainer>

                {/* Biometrics & Subscription - Card 2 */}
                <AnimatedContainer className="flex flex-col relative rounded-2xl p-6 bg-black/10 backdrop-blur-2xl border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                    <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-5">
                        
                        {/* Gender */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <BsGenderAmbiguous size={17} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Gender</span>
                                <span className="text-white/80 font-medium font-sans text-sm mt-0.5">{userInfo.gender}</span>
                            </div>
                        </div>

                        {/* Height */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <RiLineHeight size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Height</span>
                                <span className="text-white/80 font-semibold font-mono text-sm mt-0.5">
                                    {userInfo.height} <span className="text-white/30 font-sans text-[11px] ml-0.5">CM</span>
                                </span>
                            </div>
                        </div>

                        {/* Weight */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <LuWeight size={17} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Weight</span>
                                <span className="text-white/80 font-semibold font-mono text-sm mt-0.5">
                                    {userInfo.weight} <span className="text-white/30 font-sans text-[11px] ml-0.5">KG</span>
                                </span>
                            </div>
                        </div>

                        {/* Membership Type */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
                                <FaChalkboardUser size={17} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Tier Level</span>
                                <span className="text-white/90 font-bold font-sans text-sm uppercase tracking-wider mt-0.5">{userInfo.packageName}</span>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-9 h-9 rounded-xl border bg-white/[0.02] ${
                                userInfo.status ? "border-[#0affca]/20 text-[#0affca]" : "border-red-500/20 text-red-400"
                            }`}>
                                <MdOutlineSportsGymnastics size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Account Status</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${userInfo.status ? "bg-[#0affca]" : "bg-red-400"}`} />
                                    <span className={`text-xs uppercase font-bold tracking-widest font-sans ${userInfo.status ? "text-[#0affca]" : "text-red-400"}`}>
                                        {userInfo.status ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedContainer>
            </div>

            {/* 3. Fully Styled Dynamic Goal Panel */}
            <div className="flex items-center justify-between relative w-full p-4 px-6 rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-[#0affca]/[0.02] via-transparent to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                    <FiTarget className="text-[#0affca] opacity-70" size={16} />
                    <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase font-sans">Fitness Target</span>
                    <span className="text-white/80 text-xs font-medium uppercase tracking-wide ml-2">
                        {userInfo.goal || "Build Lean Mass & Maintain Strength"}
                    </span>
                </div>
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden sm:block relative z-10">
                    Superbody Core
                </div>
            </div>
        </motion.div>
    );
}

export default OverviewCard;