'use client'

import CustomTabsWithTooltips from "../ui/tabsCard";
import { useEffect, useState } from "react";
import WorkoutsAddModal from "@/src/app/members/[id]/WorkoutAddModal";
import { FaDumbbell } from "react-icons/fa6";
import { subscribeToUserSchedules } from "@/util/getSchedule";
import { deleteSchedule } from "@/util/deleteDocs";
import { AnimatePresence } from "motion/react";
import AnimatedContainer from "../ui/animatedContainer";
import GlassLiquidButton from "../ui/liquidBtn";
import { LiquidOverlayVarient1 } from "../ui/liquidOverlay";
const WorkoutSchedule = ({ userData, userId }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [err, setErr] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState(null)

    const handleModal = () => {
        setEditingSchedule(null)
        setIsModalOpen(true)
    }

    const handleEdit = async (schedule: any) => {
        setEditingSchedule(schedule)
        setIsModalOpen(true)
    }

    const handleDelete = async (scheduleId: string) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            try {
                await deleteSchedule(userId, scheduleId)
                console.log("Schedule deleted successfully")
            } catch (error) {
                console.error("Error deleting schedule:", error)
            }
        }
    }

    useEffect(() => {
        const unsubscribe = subscribeToUserSchedules(userId, setSchedules, setIsLoading, setErr)
        return () => unsubscribe()
    }, [userId])


    if (isLoading) {
        return (
            <div><p>Loading</p></div>
        )
    }

    console.log("At Workout schedule", schedules)

    return (
        <div className="flex-col  mt-4 ">
            <div className="heading flex justify-between items-center my-4">




                <GlassLiquidButton
                    onClick={handleModal}
                    className="addbtn  backdrop-blur-md  p-2 rounded-2xl text-sm font-semibold cursor-pointer">
                    <p >+ Add Schedule</p>


                </GlassLiquidButton>



            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <WorkoutsAddModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        userData={userData}
                        userId={userId}
                        editingSchedule={editingSchedule}
                    />
                )}
                {/* Workouts Plan Section */}
            </AnimatePresence>
            <AnimatedContainer className="flex-col flex gap-10 flex-1  min-h-70 mt-4 rounded-2xl  border-t-white/30 border-b-white/5 border border-x-white/4  shadow-md shadow-white/5 ">
                {schedules && schedules.length > 0 ? (
                    schedules.map((schedule, index) => (
                        <div
                            className="flex-col relative w-full flex bg-black/5 backdrop-blur-xl p-4 rounded-2xl shadow-md shadow-white/5"
                            key={index}
                        >

                            {/* workout plan heading */}
                            <div className="heading flex-col bg-white/4    p-3  rounded-xl    border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.15)] ">
                                <div className="flex justify-between items-center">
                                    <p className="text-heading text-xl font-mono tracking-wider">{schedule.title.toUpperCase()}</p>
                                    {/* Action Btns */}
                                    <div className="flex gap-3 items-center">
                                        {/* Edit Button (Cyan Accented Liquid Glass) */}
                                        <div
                                            className="group flex relative py-3 p-2 font-semibold w-20 items-center j bg-linear-to-b from-white/5 via-black/10 to-white/5  justify-center rounded-xl cursor-pointer select-none transition-transform active:scale-95 duration-200"
                                            onClick={() => handleEdit(schedule)}
                                        >
                                            {/* Liquid Skin Layer */}
                                           <LiquidOverlayVarient1 className="rounded-xl transition-all duration-300   border-t-white/30 group-hover:from-white-/90 group-hover:to-white/10 group-hover:border-t-white-400/50 group-hover:shadow-[0_8px_13px_-4px_rgba(255,255,255,0.2)]" />

                                            {/* Label with dynamic mix-blend-difference alignment */}
                                            <p className="relative z-10 text-xs tracking-wider font-mono uppercase font-medium  text-white/70 transition-colors duration-300 group-hover:text-white group-hover:font-semibold ">
                                                Edit
                                            </p>
                                        </div>

                                        {/* Delete Button (Vibrant Ruby-Red Accented Liquid Glass) */}
                                        <div
                                            className="group flex relative py-3 p-2 font-semibold w-20 items-center justify-center rounded-xl bg-linear-to-b from-white/5 via-black/10 to-white/5   cursor-pointer select-none transition-transform active:scale-95 duration-200"
                                            onClick={() => handleDelete(schedule.id)}
                                        >
                                            {/* Liquid Skin Layer */}
                                            <LiquidOverlayVarient1 className="rounded-xl transition-all duration-300   border-t-red-600/50 group-hover:from-red-950/40 group-hover:to-red-500/20 group-hover:border-t-red-400/50 group-hover:shadow-[0_10px_20px_-4px_rgba(239,68,68,0.2)]" />

                                            {/* Label */}
                                            <p className="relative z-10 text-xs tracking-wider uppercase font-medium font-mono text-white/40 transition-colors duration-300 group-hover:text-red-400">
                                                Delete
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-10 mt-2 font-mono ">
                                    <p className="text-sub">Frequency : {schedule.frequency}</p>
                                    <p className="text-sub">Duration : {schedule.duration}</p>
                                    <p className="text-sub">Created At: {schedule.createdAt?.toDate().toLocaleDateString()}</p>
                                </div>
                                {/* focus List */}
                                <div className="flex gap-3 mt-2">
                                    {schedule.focus.map((item, i) => (
                                        <div className="bg-[#3d2c6e73] text-sub text-sm font-mono rounded-xl px-2 py-1 shadow-white/25 shadow-sm" key={i}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {schedule.workouts.map((workoutDaySchedule, i) => (
                                <div key={i} className="mt-4 rounded-xl bg-white/4 p-4 font-mono">
                                    <p className="text-heading text-xl mb-2">
                                        Day-{workoutDaySchedule.day}
                                    </p>
                                    {workoutDaySchedule.schedule.map((workout, j) => (
                                        <div className="flex justify-between gap-10  mt-2" key={j}>
                                            <div className="flex   items-center justify-start gap-4 text-sub">
                                                <FaDumbbell />
                                                <p>{workout.name}</p>
                                            </div>

                                            <div className="flex gap-2 text-sub">
                                                <p>{workout.reps.length} Sets:</p>
                                                {workout.reps.map((rep, k) => (
                                                    <p key={k}>{rep}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="flex">
                        <p>No Schedule Created Yet</p>
                    </div>
                )}

            </AnimatedContainer>

        </div>
    );
}

export default WorkoutSchedule;