'use client'

import CustomTabsWithTooltips from "../ui/tabsCard";
import { useEffect, useState } from "react";
import WorkoutsAddModal from "@/src/app/members/[id]/WorkoutAddModal";
import { FaDumbbell } from "react-icons/fa6";
import { subscribeToUserSchedules } from "@/util/getSchedule";
import { deleteSchedule } from "@/util/deleteSchedule";

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

    const handleEdit = async(schedule: any) => {
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

    console.log("Schedules Collection At workoutSchedule", schedules)
    if (isLoading) {
        return (
            <div><p>Loading</p></div>
        )
    }

    return (
        <div className="flex-col  mt-4">
            <div className="heading flex justify-between items-center">




                <div 
                onClick={handleModal}
                className="addbtn bg-[#373a3c44] p-2 rounded-2xl text-sm font-semibold cursor-pointer">
                    <p >+ Add Schedule</p>
                </div>

            </div>
            <WorkoutsAddModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userId={userId} editingSchedule={editingSchedule} />
            {/* Workouts Plan Section */}
            <div className="flex-col flex gap-10 flex-1  min-h-70 mt-4 rounded-2xl ">
                {schedules && schedules.length > 0 ? (
                    schedules.map((schedule, index) => (
                        <div
                            className="flex-col w-full flex bg-[#bec5cb12] p-4 rounded-2xl"
                            key={index}
                        >
                            {/* workout plan heading */}
                            <div className="heading flex-col">
                                <div className="flex justify-between items-center">
                                    <p className="text-heading text-xl">{schedule.title.toUpperCase()}</p>
                                    <div className="btns flex gap-2">
                                        <div 
                                        className="flex p-2 font-semibold bg-[#76787a44] w-20 items-center justify-center rounded-xl cursor-pointer hover:bg-[#c6ced588]"
                                        onClick={() => handleEdit(schedule)}
                                        >
                                            <p>Edit</p>
                                        </div>
                                        <div className="flex p-2 font-semibold bg-[#af002fdc] w-20 items-center justify-center rounded-xl cursor-pointer hover:bg-[#f20535fa]" onClick={() => handleDelete(schedule.id)}>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-10 mt-2 ">
                                    <p className="text-sub">Frequency : {schedule.frequency}</p>
                                    <p className="text-sub">Duration : {schedule.duration}</p>
                                    <p className="text-sub">Created At: 2025/07/23</p>
                                </div>
                                {/* focus List */}
                                <div className="flex gap-3 mt-2">
                                    {schedule.focus.map((item, i) => (
                                        <div className="bg-[#3d2c6e73] rounded-xl px-2" key={i}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {schedule.workouts.map((workoutDaySchedule, i) => (
                                <div key={i} className="mt-4 rounded-xl bg-[#71727325] p-4">
                                    <p className="text-heading text-xl mb-2">
                                        Day-{workoutDaySchedule.day}
                                    </p>
                                    {workoutDaySchedule.schedule.map((workout, j) => (
                                        <div className="flex justify-between mt-2" key={j}>
                                            <div className="flex items-center gap-4">
                                                <FaDumbbell />
                                                <p>{workout.name}</p>
                                            </div>

                                            <div className="flex gap-2">
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

            </div>

        </div>
    );
}

export default WorkoutSchedule;