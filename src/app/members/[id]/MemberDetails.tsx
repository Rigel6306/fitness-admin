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
      <div className="flex justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/members"
            className="bckBtn flex bg-white/5 backdrop-blur-md shadow-md shadow-white/5 items-center justify-center rounded-md p-2 h-10 cursor-pointer hover:bg-white/15"
          >
            <IoIosArrowBack color="white" size={24} />
          </Link>
          <div>
            <div className="text-2xl font-semibold">{userData.data.name}</div>
            <div className="text-[#B0B0B0]"> {userData.data.membershipNumber}</div>
          </div>
        </div>
        {/* Action Btns */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group gap-2 flex relative h-10 px-4 font-semibold  items-center justify-center cursor-pointer select-none transition-transform active:scale-95 duration-200"
          >
            <LiquidOverlayVarient1 className="backdrop-blur-none rounded-sm transition-all duration-300  border-t-white/40 group-hover:from-white/20 group-hover:via-white/5 group-hover:to-white/10 group-hover:border-t-white/70 group-hover:shadow-[0_8px_14px_-4px_rgba(255,255,255,0.15)]" />
            <BiSolidEdit color="light" />
            <span className="font-semibold text-xs">Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="group flex gap-2 relative h-10  px-2 font-semibold  items-center justify-center  cursor-pointer select-none transition-transform active:scale-95 duration-200"
          >
             <LiquidOverlayVarient1 className="backdrop-blur-none rounded-sm transition-all duration-300  border-t-red-600/40 group-hover:from-red-950/40 group-hover:via-black/10 group-hover:to-red-500/20 group-hover:border-t-red-400/60 group-hover:shadow-[0_10px_20px_-4px_rgba(239,68,68,0.25)]" />
            <MdDelete color="crimson" />
            <span className="font-semibold text-xs">Delete</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-20 mt-10">
        {/* Membership Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl bg-black/3 backdrop-blur-sm shadow-md shadow-white/5 h-25">
          <LiquidOverlayVarient1 className="backdrop-blur-none" />
          <FaChalkboardUser size={45} />
          <div className="flex flex-col">
            <div className="text-md text-sub font-semibold"><p>Membership</p></div>
            <div><p>{userData.data.packageName}</p></div>
          </div>
        </AnimatedContainer>

        {/* Active Status Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl backdrop-blur-sm bg-black/30 relative shadow-md shadow-white/5 h-25">
          <LiquidOverlayVarient1  className="backdrop-blur-none"/>
          <MdOutlineSportsGymnastics size={45} className="text-[#4cddbbb2]" />
          <div className="flex flex-col">
            <div className="text-md text-sub font-semibold"><p>Active Status</p></div>
            <div>
              <p className="bg-[#4cddbbb2] text-sm w-fit px-1 font-semibold text-[#fbfdfc] text-center rounded-sm">Active</p>
            </div>
          </div>
        </AnimatedContainer>

        {/* Join Date Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl bg-black/3 backdrop-blur-md relative shadow-md shadow-white/5 h-25">
          <LiquidOverlayVarient1 className="backdrop-blur-none" />
          <CgCalendarToday size={45} />
          <div className="flex flex-col">
            <div className="text-md text-sub font-semibold"><p>Join Date</p></div>
            <div><p>{userData.data.registerdAt.toDate().toLocaleDateString()}</p></div>
          </div>
        </AnimatedContainer>

        {/* Payments Card */}
        <AnimatedContainer className="flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl bg-black/3 backdrop-blur-md shadow-md shadow-white/5 h-25">
          <LiquidOverlayVarient1 className="backdrop-blur-none"/>
          <FaSackDollar size={30} />
          <div className="flex flex-col">
            <div className="text-md text-sub font-semibold"><p>Payment</p></div>
            <div>
              <p className="bg-[#4cddbbb2] text-sm w-fit px-1 font-semibold text-[#fbfdfc] text-center rounded-sm">Completed</p>
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