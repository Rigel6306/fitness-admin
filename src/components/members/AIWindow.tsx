'use client'
import { CustomTabsWithTooltips } from "@/src/components/ui/tabsCard";
import { Ripple } from "../ui/ripple";
import { LightRays } from "../ui/lightRays";
import { TypingAnimation } from "../ui/typingAnimation";
import { TextAnimate } from "../ui/textAnimation";
import axios from 'axios'
import { useState } from "react";
import { motion } from 'motion/react'
import AnimatedContainer from "../ui/animatedContainer";
import { RiCpuLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";

type props = {
     userData: { data: any },
     setIsAiLoading: any,
     setWorkoutPlanInfo: any,
     setWorkoutDayList: any
     setFocusList: any
}

const AIWindow = ({ userData, setIsAiLoading, setWorkoutPlanInfo, setWorkoutDayList, setFocusList }: props) => {

     // Handling ai-suggession api call
     const { data } = userData
     const [isLoading, setIsLoading] = useState(false)
     const [aiDescription, setAiDescription] = useState('')
     const [isInitialLoad, setIsInitialLoad] = useState(true)

     setTimeout(() => {
          setIsInitialLoad(false)
     }, 1800)

     const handleGenerateSchedule = async () => {
          setIsLoading(true)
          setIsAiLoading(true)
         
          const responce = await axios.post("http://localhost:3000/api/ai-suggessions", {
               height: data.height,
               weight: data.weight,
               goals: "weight Loose",
               experienceLevel: "2",
               promptType: "withSchedule",
               scheduleData: {
                    title: "NEW Schedule",
                    frequency: "1 day per week",
                    workoutsCount: 10,
                    workouts: [
                         {
                              day: 1,
                              schedule: [
                                   { id: 1, name: "Leg Extension", reps: [10, 8, 6] },
                                   { "id": 2, name: "Barbell Shoulder Press", reps: [10, 8, 6] }
                              ]
                         }
                    ],
                    duration: 3,
                    focus: ["Chest", "Shoulders", "Arms"]
               }
          })
          const { success } = responce.data
         
          if (success) {
               // Transform reps from numbers to strings
               const workoutsWithStringReps = responce.data.data.data.workouts.map((day: any) => ({
                    ...day,
                    schedule: day.schedule.map((exercise: any) => ({
                         ...exercise,
                         reps: exercise.reps.map((rep: any) => String(rep))
                    }))
               }))

               console.log("Ai Response data checking",  responce.data.data.data)
               setFocusList(prev=>([...prev,...responce.data.data.data.focus.map(item=>({name:item,selected:true}))]))
               setWorkoutPlanInfo(responce.data.data.data)
               setAiDescription(responce.data.data.description)
               setWorkoutDayList(workoutsWithStringReps)
               setIsAiLoading(false)
               setIsLoading(false)
          }
     }

     return (
          <motion.div
               layout
               initial={{ opacity: 0, scale: 0.6, height: 0, x: 900 }}
               animate={{ opacity: 1, scale: 1, height: '90%', x: 0 }}
               exit={{ opacity: 0 }}
               transition={{
                    type: 'tween',
                    stiffness: 190,
                    damping: 20,
                    mass: 1.5,
                    duration: 0.3,
                    ease: 'easeInOut'
               }}
               className="bg-black/60 w-[20vw] h-[90vh] rounded-2xl p-6 flex flex-col items-center backdrop-blur-xl overflow-hidden border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] relative" 
          >
               {/* Decorative Ambient Underlays */}
               <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#0affca]/[0.015] blur-3xl rounded-full pointer-events-none" />

               {/* Your Original Background Render Signals */}
               {isLoading && <LightRays color="#0affca22" />}
               {isInitialLoad && <LightRays color="#0affca22" />}

               {/* Heading Section */}
               <div className="relative z-10 flex flex-col flex-1 items-center w-full shrink-0">
                    <div className="heading flex justify-center flex-col items-center border-b border-white/5 pb-4 w-full">
                         <div className="p-2 mb-2 bg-[#0c6955]/20 border border-[#0affca]/20 rounded-xl text-[#0affca] shadow-[0_0_15px_rgba(10,255,202,0.1)] flex items-center justify-center">
                              <RiCpuLine size={16} className={isLoading ? "animate-spin" : "animate-pulse"} />
                         </div>
                         <p className="text-sm font-bold tracking-wider uppercase text-white/90 flex items-center gap-1.5 justify-center">
                              AI Schedule Assistant <HiSparkles className="text-[#0affca] text-xs" />
                         </p>
                         <p className="text-white/30 text-[9px] font-mono tracking-widest uppercase mt-0.5">
                              Engine // Intelligent Companion
                         </p>
                    </div>

                    {/* Ripple Container Box */}
                    <div className="flex h-40 w-40 max-h-40 relative rounded-full items-center justify-center overflow-hidden pointer-events-none z-0 mt-4">
                         <Ripple />
                    </div>
               </div>

               {/* Center Dynamic Response Workspace Section */}
               {isLoading ? (
                    <div className="relative z-10 flex flex-col flex-2 items-center justify-center text-center p-4 bg-white/[0.01] border border-white/5 rounded-xl w-full my-4">
                         <p className="text-xs font-bold font-mono tracking-wider uppercase text-[#0affca] animate-pulse">Processing Parameters...</p>
                         <p className="text-[11px] text-white/40 font-medium mt-1">Synchronizing neural prescription splits.</p>
                    </div>
               ) : (
                    <div className="relative z-10 flex flex-col flex-2 items-center text-wrap px-4 text-justify w-full my-4 overflow-y-auto scrollbar-none">
                         {aiDescription ? (
                              <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl w-full">
                                   <TextAnimate animation="blurIn" as="h1" className="leading-relaxed text-[11px] text-white/60 text-justify font-medium">
                                        {`Hey there. I just created your schedule. ${aiDescription}`}
                                   </TextAnimate>
                              </div>
                         ) : (
                              <div className="p-3.5 bg-white/[0.01] border border-dashed border-white/5 rounded-xl text-center w-full py-8">
                                   <p className="text-[11px] text-white/30 font-medium leading-relaxed">
                                        No schedule generated inside this viewport yet. Deploy directives below.
                                   </p>
                              </div>
                         )}
                    </div>
               )}

               {/* Button Trigger Controls Section */}
               <div className="relative z-10 border-t border-white/5 pt-4 w-full shrink-0 flex items-center justify-center">
                    <div 
                         className="w-full h-10 bg-[#0ae2ff7a] border border-[#0affca]/20 hover:bg-[#0ae2ffad] shadow-[0_4px_12px_rgba(10,255,202,0.15)] active:scale-[0.98] transition-all duration-250 cursor-pointer flex items-center justify-center rounded-xl"
                         onClick={handleGenerateSchedule}
                    >
                         <p className="text-xs font-bold tracking-wider uppercase text-black">Generate Schedule</p>
                    </div>
               </div>
          </motion.div>
     );
}

export default AIWindow;