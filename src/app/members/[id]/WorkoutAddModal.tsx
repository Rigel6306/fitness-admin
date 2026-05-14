'use client'
import {CustomTabsWithTooltips} from "@/src/components/ui/tabsCard";
import { error } from "console";
import { useState, useEffect } from "react";
import { z } from 'zod'
import { addScheduleDoc } from "@/util/addSchedule";
import { updateSchedule } from "@/util/updateSchedule";
import AddNewMemberModal from "../addNewMemberModal";
import AddWorkoutsForm from "@/src/components/members/AddWorkoutsForm";
import { serverTimestamp } from "firebase/firestore";
import AIWindow from "@/src/components/members/AIWindow";
import { LightRays } from "@/src/components/ui/lightRays";
import { Ripple } from "@/src/components/ui/ripple";

type Exercise = {
  id: number;
  name: string;
  reps: string[];
};

type WorkoutDay = {

  day: number;
  schedule: Exercise[];
};

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
 userData:{},
  userId: string;
  editingSchedule?: any;
};


type workoutPlanInfo = {
  title: string,
  frequency: string,
  workoutsCount: number,
  workouts: WorkoutDay[],
  duration: string,
  focus: string[]

}

const WorkoutsAddModal = ({ isModalOpen, setIsModalOpen,userData,userId, editingSchedule }: Props) => {
  const [validationError, setValidationError] = useState<string | undefined>()
  const [workoutDayList, setWorkoutDayList] = useState<WorkoutDay[]>([]);
  const [mode,setMode] = useState(false)
  const [aiSuggession,setAiSuggession] = useState(null)
  const [isAiLoading,setIsAiLoading] = useState(false)

 
  const [workoutPlanInfo, setWorkoutPlanInfo] = useState<workoutPlanInfo>({
    title: '',
    frequency: '',
    duration: '',
    focus: [],
    workoutsCount: 0,
    workouts: []
  })
 console.log("Ai suggesions State at Workouts add Modal",workoutPlanInfo)
  

  const [focusList, setFocusList] = useState([
    { name: 'Shoulders', selected: false },
    { name: 'Chest', selected: false },
    { name: 'Tricep', selected: false },
    { name: 'Biceps', selected: false },
    { name: 'Forearms', selected: false },
    { name: 'Back', selected: false },
    { name: 'Legs', selected: false },
    { name: 'Core', selected: false },
    { name: 'Cardio', selected: false },
  ]);

  console.log("At Workouts Add Modal: ", userData)


  // Initialize form when editing a schedule
  useEffect(() => {
    if (editingSchedule) {
      setWorkoutPlanInfo({
        title: editingSchedule.title || '',
        frequency: editingSchedule.frequency || '',
        duration: editingSchedule.duration || '',
        focus: editingSchedule.focus || [],
        workoutsCount: editingSchedule.workoutsCount || 0,
        workouts: editingSchedule.workouts || []
      });
      setWorkoutDayList(editingSchedule.workouts || []);
     
      // Update focus list with selected items
      setFocusList(prev =>
        prev.map(focus => ({
          ...focus,
          selected: editingSchedule.focus?.includes(focus.name) || false
        }))
      );
    }

     if(!editingSchedule){
        setWorkoutPlanInfo({
    title: '',
    frequency: '',
    duration: '',
    focus: [],
    workoutsCount: 0,
    workouts: []
  })
        setWorkoutDayList([])
        setFocusList([
    { name: 'Shoulders', selected: false },
    { name: 'Chest', selected: false },
    { name: 'Tricep', selected: false },
    { name: 'Biceps', selected: false },
    { name: 'Forearms', selected: false },
    { name: 'Back', selected: false },
    { name: 'Legs', selected: false },
    { name: 'Core', selected: false },
    { name: 'Cardio', selected: false },
  ])
      }
  }, [editingSchedule, isModalOpen]);

  const handleCancle = ()=>{
  
    setIsModalOpen(false) 
 
  }

  
  
  if (!isModalOpen) return null;

  // Toggle focus area selection
  const handleFocusSelect = (index: number) => {
    setFocusList(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], selected: !newList[index].selected };
      return newList;
    });
  };

  // Add a new workout day
  const handleAddDay = () => {
    setWorkoutDayList(prev => [
      ...prev,
      { day: prev.length + 1, schedule: [] }
    ] as WorkoutDay[]);
  };
  const handleScheduleTitle = (field: string, value: string) => {

    setWorkoutPlanInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleRemoveDay = (index: number) => {
    setWorkoutDayList(prev => prev.filter((item, i) => (i !== index)))
  }
  // Add a new exercise to a specific day (fixed double-entry issue)
  const handleAddExercise = (dayIndex: number) => {
    setWorkoutDayList(prev =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const newExercise: Exercise = {
            id: day.schedule.length + 1,
            name: "",
            reps: []
          };
          return { ...day, schedule: [...day.schedule, newExercise] };
        }
        return day;
      })
    );
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    setWorkoutDayList(prev =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const updatedSchedule = day.schedule.filter((_, j) => j !== exerciseIndex);
          return { ...day, schedule: updatedSchedule };
        }
        return day;
      })
    );
  };

  // Update exercise name or reps
  const handleExerciseChange = (
    dayIndex: number,
    exerciseIndex: number,
    field: keyof Exercise | 'reps',
    value: string | string[]
  ) => {
    setWorkoutDayList(prev =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const updatedSchedule = day.schedule.map((exercise: Exercise, j: number) =>
            j === exerciseIndex ? { ...exercise, [field]: value } : exercise
          );
          return { ...day, schedule: updatedSchedule };
        }
        return day;
      })
    );
  };

  const scheduleSchema = z.object({
    id: z.number(),
    name: z.string().nonempty("Exercise Name is Required"),
    reps: z.array(z.string().nonempty("reps are Required")).nonempty("Reps are Required"),
  })
  const workoutDaySchema = z.object({
    day: z.number(),
    schedule: z.array(scheduleSchema).min(1, "Each day Requires at least one exercise")
  })

  const workoutPlanSchema = z.object({
    title: z.string().nonempty("Title is Required"),
    frequency: z.string().nonempty("Frequency is Required"),
    duration: z.string().nonempty("Duration is Required"),
    workouts: z.array(workoutDaySchema).min(1, "At least 1 workout day plan is required"),
    focus: z.array(z.string()).min(1, "please Add Focus Areas to the schedule")
  })

  

// Confirm Logic
  const handleConfirm = async () => {
    const plan = {
      ...workoutPlanInfo,
      createdAt: serverTimestamp(),
      workouts: workoutDayList,
      focus: focusList.filter(f => f.selected).map(f => f.name),
    }
    console.log("workout plan: ", plan)
    const result = workoutPlanSchema.safeParse(plan);
    if (!result.success) {
      setValidationError(result.error.issues[0].message)
      return;
    } else {

      setValidationError('')
    }

    console.log("Valid plan:", result.data);

    // Handle edit vs add
    if (editingSchedule?.id) {
      await updateSchedule(userId, editingSchedule.id, plan);
    } else {
      await addScheduleDoc(userId, plan);
    }

    setIsModalOpen(false)

  };



  return (
    <div className="fixed inset-0 bg-gray-600/30 flex items-center justify-center z-50 gap-2">
      <div className="bg-[#000000]/50 w-[90vw] max-w-4xl h-[90vh] rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-xl overflow-hidden">

     {isAiLoading && <LightRays color="#4fefcc5d"/>}

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-heading text-lg mt-2">{editingSchedule?.id ? "Edit Workout Schedule" : "Add Workout Schedule"}</p>
            <p className="text-sub text-sm">{editingSchedule?.id ? "Update your workout program" : "Create a comprehensive workout program"}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-100 cursor-pointer text-2xl hover:text-gray-400"
          >
            ✕
          </button>
        </div>

        {/* AI Assistance */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-sub mb-2">AI Assistance Mode</p>
          <CustomTabsWithTooltips setMode={setMode}/>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">

          {/* Inputs */}
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="title">Workout Title</label>
              <input onChange={(e) => handleScheduleTitle('title', e.target.value)}
                placeholder="Basic Schedule"
                type="text" name="title" className="mt-2 bg-[#74777a44] rounded-lg px-2 py-1" />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="frequency">Frequency</label>
              <input onChange={(e) => handleScheduleTitle('frequency', e.target.value)}
                placeholder="3 days per week"
                type="text" name="frequency" className="mt-2 bg-[#74777a44] rounded-lg px-2 py-1" />
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="duration">Duration</label>
              <input onChange={(e) => handleScheduleTitle('duration', e.target.value)} type="text"
                placeholder="3 Months"
                name="duration" className="mt-2 bg-[#74777a44] rounded-lg px-2 py-1" />
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <p className="mb-2">Focus Areas</p>
            <div className="flex flex-wrap gap-3">
              {focusList.map((focusItem, index) => (
                <p
                  key={index}
                  onClick={() => handleFocusSelect(index)}
                  className={`px-3 py-1 cursor-pointer rounded-2xl font-semibold transition 
                    ${focusItem.selected ? "bg-[#4ae2bf85] text-black" : "bg-[#677e9544] text-white"}`}
                >
                  {focusItem.name}
                </p>
              ))}
            </div>
          </div>

          {/* Workout Days */}
          <div className="flex items-center gap-6">
            <p className="font-semibold">Workout Days</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddDay();
              }}
              className="px-3 py-1 bg-[#494c4f44] rounded-md cursor-pointer hover:bg-[#494c4f66]"
            >
              + Add Day
            </button>
          </div>

          {/* Days List */}
          <AddWorkoutsForm workoutDayList={workoutDayList} handleRemoveDay={handleRemoveDay} handleExerciseChange={handleExerciseChange} handleRemoveExercise={handleRemoveExercise} handleAddExercise={handleAddExercise}/>
          
         


        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 mt-2">
          {validationError && <div className=" flex flex-1 items-center justify-center rounded-md bg-[#8e909322]">
            <p className="text-[#f31936] font-bold">{validationError}</p>
          </div>}
          <div className="confirm  p-2 bg-[#3ce7c2c0] rounded-lg cursor-pointer" onClick={handleConfirm}><p>{editingSchedule?.id ? "Update" : "Confirm"}</p></div>
          <div onClick={handleCancle} className="cancle p-2 bg-[#474547db] rounded-lg cursor-pointer"><p>Cancle</p></div>
        </div>

      </div>
      {mode && <AIWindow userData={userData} setWorkoutPlanInfo={setWorkoutPlanInfo} setIsAiLoading={setIsAiLoading} setWorkoutDayList={setWorkoutDayList} />} 
    </div>
  );
};

export default WorkoutsAddModal;
