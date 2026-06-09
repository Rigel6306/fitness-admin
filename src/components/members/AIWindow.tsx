"use client";
import { CustomTabsWithTooltips } from "@/src/components/ui/tabsCard";
import { Ripple } from "../ui/ripple";
import { LightRays } from "../ui/lightRays";
import { TypingAnimation } from "../ui/typingAnimation";
import { TextAnimate } from "../ui/textAnimation";
import axios from 'axios';
import { useState } from "react";
import { motion, AnimatePresence } from 'motion/react';
import AnimatedContainer from "../ui/animatedContainer";
import { RiCpuLine, RiMessage3Line } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";

type props = {
     userData: { data: any },
     setIsAiLoading: any,
     setWorkoutPlanInfo: any,
     workoutPlanInfo: any,
     focusList: any,
     workoutDayList: any,
     setWorkoutDayList: any,
     setFocusList: any
};

const AIWindow = ({ userData, setIsAiLoading, setWorkoutPlanInfo, setWorkoutDayList, workoutPlanInfo, focusList, workoutDayList, setFocusList }: props) => {

     const { data } = userData;
     const [isLoading, setIsLoading] = useState(false);
     const [aiDescription, setAiDescription] = useState('');
     const [prompt, setPrompt] = useState('');

     let scheduleData = {
          ...workoutPlanInfo,
          focus: focusList
               .filter(i => i.selected)
               .map(i => i.name),
          workouts: workoutDayList,
          workoutsCount: workoutDayList[0]?.schedule.length
     };

     const hasSchedule = scheduleData.workouts && scheduleData.workouts.length > 0;
     const hasPrompt = prompt.trim() !== '';

     let promptType: string;
     if (hasSchedule && hasPrompt) {
          promptType = "withScheduleAndPrompt";
     } else if (hasSchedule) {
          promptType = "withScheduleNoPropmt";
     } else if (hasPrompt) {
          promptType = "noScheduleButPrompt";
     } else {
          promptType = "noScheduleNoPrompt";
     }

     console.log("Prompt Type", promptType)
     const handleGenerateSchedule = async () => {
          setIsLoading(true);
          setIsAiLoading(true);

          try {
               const responce = await axios.post("http://localhost:3000/api/ai-suggessions", {
                    height: data.height,
                    weight: data.weight,
                    goals: "weight Loose",
                    experienceLevel: "2",
                    promptType: promptType,
                    customPrompt: prompt,
                    scheduleData: scheduleData
               });
               const { success } = responce.data;

               if (success) {
                    const workoutsWithStringReps = responce.data.data.data.workouts.map((day: any) => ({
                         ...day,
                         schedule: day.schedule.map((exercise: any) => ({
                              ...exercise,
                              reps: exercise.reps.map((rep: any) => String(rep))
                         }))
                    }));

                    setTimeout(() => {
                         setFocusList(prev => ([...prev, ...responce.data.data.data.focus.map(item => ({ name: item, selected: true }))]));
                         setWorkoutPlanInfo(responce.data.data.data);
                         
                         const desc1 = responce?.data?.data?.description;
                         const desc2 = responce?.data?.data?.data?.description
                         if (desc1 && desc1.trim() !== "") {
                              setAiDescription(desc1);
                         } else if (desc2 && desc2.trim() !== "") {
                              setAiDescription(desc2);
                         }
                         console.log("AI responce",responce.data.data.data)
                         console.log("AI REsponce Description", )
                         setWorkoutDayList(workoutsWithStringReps);
                         setPrompt('')
                         setIsAiLoading(false);
                         setIsLoading(false);
                    }, 1000);
               }
          } catch (error) {
               console.error("AI Generation Failed:", error);
               setIsLoading(false);
               setIsAiLoading(false);
          }
     };

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
               className="bg-black/60 w-[22vw] min-w-70 h-[90vh] rounded-2xl p-5 flex flex-col items-center backdrop-blur-xl overflow-hidden border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >

               <LightRays />
               {/* Headless Branding Block - Contrast Fixed to White/Cyan */}
               <div className="relative z-10 flex flex-col items-center w-full shrink-0 mb-4">
                    <div className="heading flex justify-center flex-col items-center border-b border-white/5 pb-3 w-full">
                         <div className="flex items-center gap-2">
                              <p className="text-xs font-bold tracking-wider uppercase text-black/90">
                                   AI Schedule Assistant
                              </p>
                         </div>
                         <p className="text-black font-bold text-[8px] font-mono tracking-widest uppercase mt-1">
                              I GOT YA
                         </p>
                    </div>
               </div>

               {/* Center Dynamic Response Workspace Section - Dynamic Centering Engine */}
               {isLoading ? (
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-5 bg-white/2 border border-white/5 rounded-xl w-full my-auto">
                         <p className="text-xs font-bold font-mono tracking-wider uppercase text-[#0affca] animate-pulse">Hold Tight...</p>
                         <p className="text-[11px] text-white/40 font-medium mt-1 mb-4">I'm Working on it.</p>
                         <div className="flex h-32 w-32 relative rounded-full items-center justify-center overflow-hidden pointer-events-none opacity-60">
                              <Ripple />
                         </div>
                    </div>
               ) : (
                    <div className="relative z-10 flex-1 flex flex-col gap-4 w-full my-auto overflow-y-auto scrollbar-none justify-center py-2">

                         {/* AI Description Response Module */}
                         <AnimatePresence mode="popLayout">
                              {aiDescription && (
                                   <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3.5 bg-[#0c6955]/10 border border-[#0affca]/20 rounded-xl w-full shrink-0 shadow-[0_0_20px_rgba(10,255,202,0.02)]"
                                   >
                                        <div className="flex items-center gap-1.5 mb-2 border-b border-white/5 pb-1.5">
                                             <HiSparkles className="text-[#0affca] animate-spin" size={12} />
                                             <span className="text-[9px] font-mono tracking-wider text-white/70 uppercase">Hear's What i did </span>
                                        </div>
                                        {/* Fixed alignment wrapper block */}
                                        <div className="w-full text-left text-wrap whitespace-pre-wrap break-words">
                                             <TextAnimate
                                                  animation="blurIn"
                                                  as="p"
                                                  className="leading-relaxed text-[11px] text-white/80 font-medium tracking-wide"
                                             >
                                                  {`I just created your schedule. ${aiDescription}`}
                                             </TextAnimate>
                                        </div>
                                   </motion.div>
                              )}
                         </AnimatePresence>

                         {/* Initial Input & Welcome Module */}
                         <div className="w-full flex flex-col gap-3.5 bg-white/[0.02] border border-white/10 rounded-xl p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]">

                              {/* Status / Instruction Header */}
                              <div className="flex flex-col gap-1 text-left w-full border-b border-white/5 pb-2.5">
                                   <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#0affca] animate-pulse shadow-[0_0_8px_#0affca]" />
                                        <p className="text-[9px] font-mono tracking-widest text-[#0affca] uppercase">
                                             {aiDescription ? "Anything else?" : "Hi. Hope you doing good."}
                                        </p>
                                   </div>
                                   <p className="text-[10px] text-white/50 font-medium leading-normal mt-0.5">
                                        {aiDescription
                                             ? " Let me know what to change and I'll adjust it instantly."
                                             : "Want me to handle it? or just tell me what's on your mind, i'll follow your lead."
                                        }
                                   </p>
                              </div>

                              {/* Enhanced Styled Input Container */}
                              <div className="relative flex flex-col bg-black/40 rounded-xl border border-white/5 focus-within:border-[#0affca]/30 focus-within:shadow-[0_0_12px_rgba(10,255,202,0.05)] transition-all duration-300 p-2.5">
                                   <textarea
                                        name="title"
                                        onChange={(e) => { setPrompt(e.target.value) }}
                                        value={prompt}
                                        placeholder={aiDescription ? "e.g., Swap the leg exercises to Wednesday, add more arm volume..." : "e.g., Target upper chest growth, short rest periods, 45 minute block limits..."}
                                        className="w-full h-20 text-white/90 bg-transparent border-none outline-none text-[11px] font-medium tracking-wide placeholder:text-white/20 resize-none scrollbar-none leading-normal"
                                   />
                                   <div className="flex justify-end w-full border-t border-white/5 pt-1.5 mt-1">
                                        <span className="text-[8px] font-mono text-white/30 uppercase flex items-center gap-1">
                                             <RiMessage3Line size={10} /> Feel free to say anything
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}

               {/* Button Trigger Controls Section */}
               <div className="relative z-10 border-t border-white/5 pt-4 w-full shrink-0 flex items-center justify-center">
                    <button
                         onClick={handleGenerateSchedule}
                         disabled={isLoading}
                         className="w-40 h-10 bg-black/5 hover:bg-[#5e1c82fc]/50 border border-[#5e1c82fc] hover:border-white active:scale-[0.98] transition-all duration-500 cursor-pointer flex items-center justify-center rounded-xl group"
                    >
                         <p className="text-xs font-bold tracking-wider uppercase text-white group-hover:text-white transition-colors  transition-all duration-300  ">
                              {aiDescription ? "Re-Generate" : "Generate"}
                         </p>
                    </button>
               </div>
          </motion.div>
     );
};

export default AIWindow;