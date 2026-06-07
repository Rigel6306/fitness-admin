'use client'
import { IoIosArrowBack } from "react-icons/io";
import useUserClientContext from "@/src/hooks/useUserClientContext";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { CgCalendarToday } from "react-icons/cg";
import { FaSackDollar } from "react-icons/fa6";
import { FaChalkboardUser } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import MemberInfoEditModal from "./MemberInfoEditModal";
import AnimatedContainer from "@/src/components/ui/animatedContainer";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { deleteUser } from "@/util/deleteDocs";
import { LiquidOverlayVarient1 } from "@/src/components/ui/liquidOverlay";

// Lazy loaded components
const OverviewCard = React.lazy(() => import("@/src/components/members/OverviewCard"));
const Analytics = React.lazy(() => import('@/src/components/members/Analytics'));
const WorkoutSchedule = React.lazy(() => import("@/src/components/members/WorkoutSchedule"));

type ComponentType = 'overview' | 'workout' | 'analytics';
type MemberDetailsProps = { id: string };

// Define tab configurations to eliminate repetitive JSX blocks
const TABS: { id: ComponentType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "workout", label: "Workout Schedule" },
  { id: "analytics", label: "Analytics" },
];

const MemberDetails = ({ id }: MemberDetailsProps) => {
  const [type, setType] = useState<ComponentType>("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [err, setError] = useState(null);

  const data = useUserClientContext();
  const userData = data.find(item => item.data.membershipNumber === id);

  if (!userData) {
    return (
      <div className="flex flex-col text-white p-6">
        <p className="text-lg font-semibold">Loading member details...</p>
        <Link href="/members" className="mt-4 underline text-blue-400">
          Back to Members
        </Link>
      </div>
    );
  }

  const handleDelete = () => deleteUser(userData.id);

  const components = {
    overview: <OverviewCard userInfo={userData.data} />,
    workout: <WorkoutSchedule userData={userData} userId={userData.id} />,
    analytics: <Analytics />
  };

  const activeIndex = TABS.findIndex(tab => tab.id === type);

  return (
    <div className="flex flex-col text-white font-mono">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-5">
          <Link
            href="/members"
            className="group flex relative h-10 px-4  font-semibold items-center justify-center cursor-pointer select-none transition-transform active:scale-95 duration-200 border-none bg-transparent"
          >
            <LiquidOverlayVarient1 className="backdrop-blur-none rounded-md transition-all duration-300  border-t-white/40 group-hover:from-white/20 group-hover:via-white/5 group-hover:to-white/10 group-hover:border-t-white/70 group-hover:shadow-[0_0px_12px_6px_rgba(255,255,255,0.15)]" />
            <IoIosArrowBack color="white" size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-wide uppercase text-white/90">{userData.data.name}</h1>
            <p className="text-xs font-mono font-bold tracking-widest text-white/30 uppercase mt-0.5">
              ID : <span className="text-[#0affca]">{userData.data.membershipNumber}</span>
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 items-center">
          {/* Edit Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex relative h-10 w-24 font-semibold items-center justify-center cursor-pointer select-none transition-transform active:scale-95 duration-200 border-none bg-transparent"
          >
            <LiquidOverlayVarient1 className="rounded-md transition-all duration-300  border-t-white/40 group-hover:from-white/20 group-hover:via-white/5 group-hover:to-white/10 group-hover:border-t-white/70 group-hover:shadow-[0_8px_14px_-4px_rgba(255,255,255,0.15)]" />
            <div className="relative z-10 flex items-center gap-1.5 text-white/70 group-hover:text-white transition-colors">
              <BiSolidEdit size={14} />
              <span className="font-bold text-[11px] tracking-wider uppercase">Edit</span>
            </div>
          </button>
          
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="group flex relative h-10 w-24 font-semibold items-center justify-center cursor-pointer select-none transition-transform active:scale-95 duration-200 border-none bg-transparent"
          >
            <LiquidOverlayVarient1 className="rounded-md transition-all duration-300  border-t-red-600/40 group-hover:from-red-950/40 group-hover:via-black/10 group-hover:to-red-500/20 group-hover:border-t-red-400/60 group-hover:shadow-[0_10px_20px_-4px_rgba(239,68,68,0.25)]" />
            <div className="relative z-10 flex items-center gap-1.5 text-white/40 group-hover:text-red-400 transition-colors">
              <MdDelete size={14} />
              <span className="font-bold text-[11px] tracking-wider uppercase">Delete</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Structured Metrics Grid Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full  select-none">
        {/* Membership Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-4 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-2xl shadow-lg relative overflow-hidden h-24">
          <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
            <FaChalkboardUser size={22} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Membership</span>
            <span className="text-white/90 text-sm font-bold uppercase tracking-wide mt-0.5">{userData.data.packageName}</span>
          </div>
        </AnimatedContainer>

        {/* Active Status Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-4 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-2xl shadow-lg relative overflow-hidden h-24">
          <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 text-[#0affca]/70">
            <MdOutlineSportsGymnastics size={22} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Active Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0affca] animate-pulse" />
              <span className="text-[#0affca] text-[11px] font-bold tracking-widest uppercase">Active</span>
            </div>
          </div>
        </AnimatedContainer>

        {/* Join Date Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-4 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-2xl shadow-lg relative overflow-hidden h-24">
          <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 text-white/40">
            <CgCalendarToday size={20} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Join Date</span>
            <span className="text-white/80 text-sm font-semibold font-mono mt-0.5">{userData.data.registerdAt.toDate().toLocaleDateString()}</span>
          </div>
        </AnimatedContainer>

        {/* Payments Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-4 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-2xl shadow-lg relative overflow-hidden h-24">
          <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 text-[#0affca]/70">
            <FaSackDollar size={18} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Payment</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0affca]" />
              <span className="text-[#0affca] text-[11px] font-bold tracking-widest uppercase">Completed</span>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Refactored Tabs Navigation */}
      <LayoutGroup id="member-details-subnav-isolated">
        <motion.div
          className="flex gap-2 bg-black/3 backdrop-blur-md shadow-md shadow-white/5 rounded-4xl py-1 w-fit px-2 mt-10 justify-center relative origin-center"
          key={activeIndex}
          animate={{
            scaleX: [1, 1.02, 0.99, 1.005, 0.998, 1],
            scaleY: [1, 0.94, 1.01, 0.993, 1.002, 1],
          }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        >
          <LiquidOverlayVarient1 className="rounded-4xl" />

          {TABS.map((tab) => {
            const isActive = type === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setType(tab.id)}
                className={`p-2 will-change text-sm transition-all duration-700 ease-in-out px-4 rounded-4xl cursor-pointer  font-semibold relative select-none z-10  ${isActive ? "text-white tracking-wider" : "text-white/40 hover:text-white/80"
                  }`}
              >
                <p
                  className="relative tracking-wider block origin-center uppercase t mix-blend-difference "
                >
                  {tab.label}
                </p>

                {isActive && (
                  <motion.div
                    layoutId="liquidTabSelectionBubble"
                    className="absolute inset-0 z-0 rounded-4xl bg-linear-to-b from-white/20 via-black/30 to-white/15 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[2px]"
                    animate={{
                      scaleX: [0.85, 1.14, 0.95, 1],
                      scaleY: [1.01, 0.95, 1.02, 1]
                    }}
                    transition={{
                      layout: { type: "spring", stiffness: 220, damping: 25, mass: 1.3 },
                      default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] },
                    }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      </LayoutGroup>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {components[type]}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <MemberInfoEditModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userData={userData} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDetails;