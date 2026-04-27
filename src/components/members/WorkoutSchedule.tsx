'use client'

import CustomTabsWithTooltips from "../ui/tabsCard";
import { useState } from "react";
import WorkoutsAddModal from "@/src/app/members/[id]/WorkoutAddModal";
const WorkoutSchedule = () => {

  const [isModalOpen,setIsModalOpen] = useState(false)
  
  
 const handleAiAssist = async () => {
  const response = await fetch("/api/ai-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  
  });
};

    const handleModal = ()=>{

        setIsModalOpen(true)
    }


    handleAiAssist()
    return ( 
        <div className="flex-col m-2 mt-4">
            <div className="heading flex justify-between items-center">
                <p className="text-heading font-semibold text-lg">Workout Schedule</p>

               

                <div className="addbtn bg-[#373a3c44] p-2 rounded-2xl text-sm font-semibold cursor-pointer">
                    <p onClick={handleModal}>+ Add Schedule</p>
                </div>

            </div>
              <WorkoutsAddModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        </div>
     );
}
 
export default WorkoutSchedule;