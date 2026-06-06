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
import GlassLiquidCard from "@/src/components/ui/glassLiquidCard";
import LiquidOverlay from "@/src/components/ui/liquidOverlay";
// lazy loaded components
const OverviewCard = React.lazy(() => import("@/src/components/members/OverviewCard"))
const Analytics = React.lazy(() => import('@/src/components/members/Analytics'));
const WorkoutSchedule = React.lazy(() => import("@/src/components/members/WorkoutSchedule"));

type ComponentType = 'overview' | 'workout' | 'analytics';
type MemberDetailsProps = { id: string };

const MemberDetails = ({ id }: MemberDetailsProps) => {
  const [type, setType] = useState<ComponentType>("overview");
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [err, setError] = useState(null)

  const data = useUserClientContext();

  const userData = data.find(item => item.data.membershipNumber === id);

  const handleNavClick = (type: ComponentType) => {
    setType(type);
  };

  // userData not available, Fallback
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

  const handleDelete = () => {
    deleteUser(userData.id)
  }

  const components = {
    overview: <OverviewCard userInfo={userData.data} />,
    workout: <WorkoutSchedule userData={userData} userId={userData.id} />,
    analytics: <Analytics />
  };


  const tabIds: ComponentType[] = ["overview", "workout", "analytics"];
  const activeIndex = tabIds.indexOf(type);

  return (
    <div className="flex flex-col text-white">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex  items-center gap-10">
          <Link
            href={"/members"}
            className="bckBtn flex bg-white/5 backdrop-blur-md shadow-md shadow-white/5  items-center justify-center  rounded-md p-2 h-10 cursor-pointer hover:bg-white/15"
          >
            <IoIosArrowBack color="white" size={24} />
          </Link>
          <div className="memberHeadingContainer">
            <div className="memberHeading text-2xl font-semibold">
              {userData.data.name}
            </div>
            <div className="subHeading text-[#B0B0B0]">
              Membership Number {userData.data.membershipNumber}
            </div>
          </div>
        </div>
        {/* Action Btns */}
        <div className="actionBtns flex gap-4">
          <div className="edit gap-2 flex cursor-pointer items-center justify-center bg-white/5 backdrop-blur-md shadow-md shadow-white/5  px-4 h-10 rounded-sm hover:bg-white/15"
            onClick={() => setIsModalOpen(true)}
          >
            <BiSolidEdit color="light" />
            <p className="font-semibold">Edit</p>
          </div>
          <div
            onClick={handleDelete}
            className="delete cursor-pointer gap-2 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-md shadow-white/5  px-4 h-10 rounded-sm hover:bg-white/15">
            <MdDelete color="crimson" />
            <p className="font-semibold">Delete</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-20 mt-10">
        {/* Membership Card */}
        <AnimatedContainer className={'flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl bg-white/3 backdrop-blur-md shadow-md shadow-white/5 h-25'} >
          {/* Glassy Overlay Effect */}
          <div
            className={`absolute inset-0 z-0 rounded-2xl bg-linear-to-b from-white/1 to-white/2 border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_$rgba(255,255,255,0.05) inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-sm`}
          />
          <FaChalkboardUser size={45} />
          <div className="flex flex-col">
            <div className="heading text-xl font-semibold">
              <p>Membership</p>
            </div>
            <div className="subheading">
              <p>{userData.data.packageName}</p>
            </div>
          </div>
        </AnimatedContainer>
        {/* Active Status Card */}
        <AnimatedContainer className={'flex items-center  justify-start p-4 gap-6 flex-1 rounded-2xl bg-black/53 relative shadow-md shadow-white/5 h-25'} >
          {/* Glassy Overlay */}
        <LiquidOverlay/>
          <MdOutlineSportsGymnastics size={45} className="text-[#4cddbbb2]" />
          <div className="flex flex-col">
            <div className="heading text-xl font-semibold">
              <p>Active Status</p>
            </div>
            <div className="subheading">
              <p className="bg-[#4cddbbb2] text-sm w-fit px-1 font-semibold text-[#fbfdfc] text-center rounded-sm">
                Active
              </p>
            </div>
          </div>
        </AnimatedContainer>

        {/* Join Date Card */}
        <AnimatedContainer className={'flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl bg-white/3 backdrop-blur-md relative shadow-md shadow-white/5 h-25'} >
          {/* Glassy overlay */}
          <div
            className={`absolute inset-0 z-0 rounded-2xl backdrop-blur-md transition-all duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_30%,rgba(255,255,255,0.06)_100%)] border border-x-white/5 border-t-white/40 border-b-black/30 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.5),inset_0_2px_3px_rgba(255,255,255,0.3),inset_0_-8px_12px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.1)]`
            }
          />
          <CgCalendarToday size={45} />
          <div className="flex flex-col">
            <div className="heading text-xl font-semibold">
              <p>Join Date</p>
            </div>
            <div className="subheading">
              <p>{userData.data.registerdAt.toDate().toLocaleDateString()}</p>
            </div>
          </div>
        </AnimatedContainer>
        {/* payments Card */}
        <AnimatedContainer className={'flex items-center justify-start p-4 gap-6 flex-1 rounded-2xl bg-white/3 backdrop-blur-md shadow-md shadow-white/5 h-25'} >
          {/* Glassy Overlay */}
          <div
            className={`absolute inset-0 z-0 rounded-2xl bg-linear-to-b from-white/1 to-white/2 border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_$rgba(255,255,255,0.05) inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-sm`}
          />
          <FaSackDollar size={30} />
          <div className="flex flex-col">
            <div className="heading text-xl font-semibold">
              <p>Payment</p>
            </div>
            <div className="subheading">
              <p className="bg-[#4cddbbb2] text-sm w-fit px-1 font-semibold text-[#fbfdfc] text-center rounded-sm">
                Completed
              </p>
            </div>
          </div>
        </AnimatedContainer>
      </div>


      <LayoutGroup id="member-details-subnav-isolated">
        <motion.div
          className="btnCOntainer flex gap-2 bg-white/3 backdrop-blur-md shadow-md shadow-white/5 rounded-4xl py-1 w-fit px-2 mt-10 justify-center relative origin-center"
          key={activeIndex}
          animate={{
            scaleX: [1, 1.01, 0.99, 1, 1],
            scaleY: [1, 0.88, 1.01, 1.01, 1],
          }}
          transition={{
            duration: 0.6,
            ease: [0.19, 1, 0.22, 1]
          }}
        >
          {/* Overview Tab */}
          <div
            onClick={() => handleNavClick("overview")}
            className={`btn p-2 px-4 rounded-4xl cursor-pointer font-semibold relative select-none z-10 transition-colors duration-300 ${type === "overview" ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
          >
            <motion.p
              className="relative block origin-center mix-blend-difference"
              animate={{
                scale: type === "overview" ? 1.02 : 1,
                y: type === "overview" ? -0.5 : 0,
                scaleX: type === "overview" ? [0.94, 1.06, 0.98, 1] : 1,
                scaleY: type === "overview" ? [1.04, 0.96, 1.01, 1] : 1
              }}
              transition={{ default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
            >
              Overview
            </motion.p>
            {type === "overview" && (
              <motion.div
                layoutId="liquidTabSelectionBubble"
                className="absolute inset-0 z-0 rounded-4xl bg-linear-to-b from-white/16 to-white/3 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[2px]"
                animate={{ scaleX: [0.85, 1.15, 0.95, 1], scaleY: [1.1, 0.9, 1.05, 1] }}
                transition={{ layout: { type: "spring", stiffness: 220, damping: 25, mass: 1.3 }, default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
              />
            )}
          </div>

          {/* Workout Schedule Tab */}
          <div
            onClick={() => handleNavClick("workout")}
            className={`btn p-2 px-4 rounded-4xl cursor-pointer font-semibold relative select-none z-10 transition-colors duration-300 ${type === "workout" ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
          >
            <motion.p
              className="relative block origin-center mix-blend-difference"
              animate={{
                scale: type === "workout" ? 1.02 : 1,
                y: type === "workout" ? -0.5 : 0,
                scaleX: type === "workout" ? [0.94, 1.06, 0.98, 1] : 1,
                scaleY: type === "workout" ? [1.04, 0.96, 1.01, 1] : 1
              }}
              transition={{ default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
            >
              Workout Schedule
            </motion.p>
            {type === "workout" && (
              <motion.div
                layoutId="liquidTabSelectionBubble"
                className="absolute inset-0 z-0 rounded-4xl bg-linear-to-b from-white/16 to-white/3 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[2px]"
                animate={{ scaleX: [0.85, 1.15, 0.95, 1], scaleY: [1.1, 0.9, 1.05, 1] }}
                transition={{ layout: { type: "spring", stiffness: 220, damping: 25, mass: 1.3 }, default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
              />
            )}
          </div>

          {/* Analytics Tab */}
          <div
            onClick={() => handleNavClick("analytics")}
            className={`btn p-2 px-4 rounded-4xl cursor-pointer font-semibold relative select-none z-10 transition-colors duration-300 ${type === "analytics" ? "text-white" : "text-white/40 hover:text-white/80"
              }`}
          >
            <motion.p
              className="relative block origin-center mix-blend-difference"
              animate={{
                scale: type === "analytics" ? 1.02 : 1,
                y: type === "analytics" ? -0.5 : 0,
                scaleX: type === "analytics" ? [0.94, 1.06, 0.98, 1] : 1,
                scaleY: type === "analytics" ? [1.04, 0.96, 1.01, 1] : 1
              }}
              transition={{ default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
            >
              Analytics
            </motion.p>
            {type === "analytics" && (
              <motion.div
                layoutId="liquidTabSelectionBubble"
                className="absolute inset-0 z-0 rounded-4xl bg-linear-to-b from-white/16 to-white/3 border border-t-white/35 border-x-white/20 border-b-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_8px_rgba(255,255,255,0.03)] backdrop-blur-[2px]"
                animate={{ scaleX: [0.85, 1.15, 0.95, 1], scaleY: [1.1, 0.9, 1.05, 1] }}
                transition={{ layout: { type: "spring", stiffness: 220, damping: 25, mass: 1.3 }, default: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
              />
            )}
          </div>
        </motion.div>
      </LayoutGroup>

      {/* Main Content */}
      <AnimatePresence>
        {components[type]}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && <MemberInfoEditModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userData={userData} />}
      </AnimatePresence>
    </div>
  );
};

export default MemberDetails;