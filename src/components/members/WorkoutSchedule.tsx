'use client'

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [editingSchedule, setEditingSchedule] = useState(null);

    const handleModal = () => {
        setEditingSchedule(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (schedule: any) => {
        setEditingSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleDelete = async (scheduleId: string) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            try {
                await deleteSchedule(userId, scheduleId);
                console.log("Schedule deleted successfully");
            } catch (error) {
                console.error("Error deleting schedule:", error);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = subscribeToUserSchedules(userId, setSchedules, setIsLoading, setErr);
        return () => unsubscribe();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-70">
                <p className="text-white/40 tracking-widest font-mono text-sm animate-pulse">LOADING PROFILE DATA...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col mt-4 w-full ">
            {/* Header / Actions bar */}
            <div className="flex justify-between items-center my-4">
                <div className="flex flex-col">
                    <h2 className="text-white/90 font-sans text-sm uppercase tracking-widest font-bold">Training Dashboard</h2>
                    <p className="text-white/40 text-sm font-mono mt-0.5">Manage and track assigned workout patterns</p>
                </div>

                <GlassLiquidButton
                    onClick={handleModal}
                    className="addbtn backdrop-blur-md px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase cursor-pointer transition-transform active:scale-95"
                >
                    + Add Schedule
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
            </AnimatePresence>

            {/* FIXED TOP-TO-BOTTOM COLUMN FLOW */}
            <div className="flex flex-col gap-8 w-full mt-4 rounded-2xl">
                {schedules && schedules.length > 0 ? (
                    schedules.map((schedule, index) => (
                        <AnimatedContainer
                            className="flex flex-col relative mx-auto w-full backdrop-blur-2xl p-6 rounded-2xl border border-t-white/10 border-x-white/5 border-b-white/0 bg-white/4 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
                            key={index}
                        >
                            {/* Inner ambient card blur backing */}
                            <div className="absolute inset-0 z-0 bg-linear-to-b from-white/1 to-black/1 pointer-events-none" />

                            {/* 1. Workout Plan Header Block */}
                            <div className="relative z-10 flex flex-col gap-4 pb-4 border-b border-white/5">
                                <div className="flex justify-between items-start gap-4">
                                    <p className="text-white/90 text-lg font-bold font-sans tracking-wider uppercase">
                                        {schedule.title}
                                    </p>
                                    
                                    {/* Actions Buttons Group */}
                                    <div className="flex gap-2 items-center shrink-0">
                                        {/* Edit Button */}
                                        <div
                                            className="group flex relative py-2.5 px-3 font-semibold w-20 items-center justify-center rounded-xl cursor-pointer select-none transition-transform active:scale-95 duration-200"
                                            onClick={() => handleEdit(schedule)}
                                        >
                                            <LiquidOverlayVarient1 className="rounded-xl transition-all duration-300  border-t-white/40 group-hover:from-white/20 group-hover:via-white/5 group-hover:to-white/10 group-hover:border-t-white/70 group-hover:shadow-[0_8px_14px_-4px_rgba(255,255,255,0.15)]" />
                                            <p className="relative z-10 text-[11px] tracking-wider font-sans uppercase font-semibold text-white/70 transition-colors duration-300 group-hover:text-white">
                                                Edit
                                            </p>
                                        </div>

                                        {/* Delete Button */}
                                        <div
                                            className="group  flex relative py-2.5 px-3 font-semibold w-20 items-center justify-center rounded-xl cursor-pointer select-none transition-transform active:scale-95 duration-200"
                                            onClick={() => handleDelete(schedule.id)}
                                        >
                                            <LiquidOverlayVarient1 className="rounded-xl transition-all duration-300  border-t-red-600/40 group-hover:from-red-950/40 group-hover:via-black/10 group-hover:to-red-500/20 group-hover:border-t-red-400/60 group-hover:shadow-[0_10px_20px_-4px_rgba(239,68,68,0.25)]" />
                                            <p className="relative z-10 text-[11px] tracking-wider uppercase font-semibold font-sans text-white/70 transition-colors duration-300 group-hover:text-red-400">
                                                Delete
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cleaned Metrics Bar */}
                                <div className="flex flex-col gap-2 py-2 px-3 rounded-xl  text-[10px] font-medium uppercase tracking-wider font-sans text-white/40">
                                    <div className="flex gap-2">
                                        <span className="text-white/25 block text-xs font-bold mb-0.5">Frequency</span>
                                        <span className="text-white/25 font-semibold text-xs font-mono">{schedule.frequency}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-white/25 block text-xs font-bold mb-0.5">Duration</span>
                                        <span className="text-white/80 font-semibold  text-xs font-mono">{schedule.duration}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-white/25 block text-xs font-bold mb-0.5">Created At</span>
                                        <span className="text-white/60 font-semibold text-xs font-mono">{schedule.createdAt?.toDate().toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Focus Target Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {schedule.focus.map((item, i) => (
                                        <div 
                                            className="bg-white/3 text-[11px] uppercase tracking-widest font-bold font-sans text-[#0ab1ffde] border border-t-white/15 border-x-white/5 border-b-transparent px-2.5 py-1 rounded-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]" 
                                            key={i}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Workout Daily Breakdowns */}
                            <div className="relative  flex flex-wrap gap-3 justify-center mt-4">
                                {schedule.workouts.map((workoutDaySchedule, i) => (
                                    <div key={i} className="rounded-xl min-w-xl max-w-xl flex-1 bg-white/5 border border-white/5 p-4 flex flex-col gap-3">
                                        <p className="text-[#0affca] tracking-widest font-sans uppercase font-bold text-sm border-b border-white/3 pb-1.5">
                                            Day {workoutDaySchedule.day}
                                        </p>
                                        
                                        <div className="flex flex-col gap-2.5">
                                            {workoutDaySchedule.schedule.map((workout, j) => (
                                                <div className="flex justify-between items-center text-xs tracking-wide uppercase font-medium" key={j}>
                                                    {/* Muscle Identity Mapping */}
                                                    <div className="flex items-center gap-2.5 text-white/80">
                                                        <FaDumbbell className="text-lg text-white/30" />
                                                        <p className="font-sans font-semibold text-sm text-white/85">{workout.name}</p>
                                                    </div>

                                                    {/* Linear Set tracking layout */}
                                                    <div className="flex items-center gap-2 font-mono text-[11px]">
                                                        
                                                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-md border border-white/5">
                                                            {workout.reps.map((rep, k) => (
                                                                <span key={k} className="text-[#0ab1ffde] font-bold">
                                                                    {rep}
                                                                    {k < workout.reps.length - 1 && <span className="text-white/10 mx-1 font-normal">•</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedContainer>
                    ))
                ) : (
                    <div className="flex items-center justify-center min-h-40 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-white/30 text-xs font-mono tracking-widest uppercase">No Active Training Schedule Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutSchedule;