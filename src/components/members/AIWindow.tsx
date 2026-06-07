'use client'
import { Ripple } from "../ui/ripple";
import { LightRays } from "../ui/lightRays";
import { TypingAnimation } from "../ui/typingAnimation";
import { TextAnimate } from "../ui/textAnimation";
import axios from 'axios'
import { useState } from "react";
import { motion } from 'motion/react'
import AnimatedContainer from "../ui/animatedContainer";
type props = {
     userData: { data: any },
     setIsAiLoading: any,
     setWorkoutPlanInfo: any,
     setWorkoutDayList: any
     setFocusList:any
}

const AIWindow = ({ userData, setIsAiLoading, setWorkoutPlanInfo, setWorkoutDayList,setFocusList }: props) => {

     // Handiling ai-suggession api call
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
                    duration:0.3,
                    ease:'easeInOut'
                   
               }}
               className="bg-[#000000]/50 w-[20vw]  h-[90vh] rounded-2xl p-6  flex flex-col items-center backdrop-blur-xl overflow-hidden  border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.15)]" >

               {isLoading && <LightRays color="#4fefcc5d" />}
               {isInitialLoad && <LightRays color="#4fefcc5d" />}
               {/* Heading Section */}
               <div className="flex flex-col flex-1 ">
                    <div className="heading flex justify-center flex-col items-center">
                         <p className="text-md font-semibold text-heading">AI Schedule Assistant </p>
                         <p className="text-sm text-sub"> Im your AI companion</p>

                    </div>
                    <div className="flex h-45 w-45 max-h-45 relative rounded-full  ">

                         <Ripple />
                    </div>

               </div>


               {/* Center Section */}
               {isLoading ? (<div className="flex flex-col flex-2 items-center">

                    <p>Hold tight!</p>
                    <p>I'm working on it</p>
               </div>) :
                    <div className="flex flex-col flex-2  items-center text-wrap px-7 text-justify">
                         {/* <TypingAnimation 
                         showCursor={false} 
                         typeSpeed={70}
                         className="leading-relaxed text-sm text-sub">
                              {"Hey there. i just created a plan for you. "+aiDescription}
                         </TypingAnimation> */}

                         {aiDescription && <TextAnimate animation="blurIn" as="h1" className="leading-relaxed text-sm text-sub  text-justify mt-10">
                              {`Hey there. I just created your schedule. ${aiDescription}`}
                         </TextAnimate>}

                    </div>
               }


               {/* Btn Section */}

               <div className="bg-[#5f5f5f44] hover:bg-[#b4b4b444] w-50 cursor-pointer flex items-center justify-center p-2 rounded-2xl"
                    onClick={handleGenerateSchedule}
               >
                    <p>Generate Schedule</p>
               </div>

          </motion.div>

     );
}

export default AIWindow;