'use client'
import { CustomTabsWithTooltips } from "@/src/components/ui/tabsCard";
import { useState, useEffect, useId } from "react";
import { z } from 'zod'
import { addScheduleDoc } from "@/util/addSchedule";
import { updateSchedule } from "@/util/updateSchedule";
import AddNewMemberModal from "../addNewMemberModal";
import AddWorkoutsForm from "@/src/components/members/AddWorkoutsForm";
import { serverTimestamp } from "firebase/firestore";
import AIWindow from "@/src/components/members/AIWindow";
import { LightRays } from "@/src/components/ui/lightRays";
import { Ripple } from "@/src/components/ui/ripple";
import { AnimatePresence, LayoutGroup } from "motion/react";
import AnimatedContainer from "@/src/components/ui/animatedContainer";
import { LiquidOverlayVarient1 } from "@/src/components/ui/liquidOverlay";

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
  userData: {},
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

const WorkoutsAddModal = ({ isModalOpen, setIsModalOpen, userData, userId, editingSchedule }: Props) => {
  const baseId = useId();
  const [validationError, setValidationError] = useState<string | undefined>()
  const [workoutDayList, setWorkoutDayList] = useState<WorkoutDay[]>([]);
  const [mode, setMode] = useState(false)
  const [aiSuggession, setAiSuggession] = useState(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const [workoutPlanInfo, setWorkoutPlanInfo] = useState<workoutPlanInfo>({
    title: '',
    frequency: '',
    duration: '',
    focus: [],
    workoutsCount: 0,
    workouts: []
  })
  console.log("Ai suggesions State at Workouts add Modal", workoutPlanInfo)

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

      setFocusList(prev =>
        prev.map(focus => ({
          ...focus,
          selected: editingSchedule.focus?.includes(focus.name) || false
        }))
      );
    }

    if (!editingSchedule) {
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
  
  const handleCancle = () => {
    setMode(false)
    setIsModalOpen(false)
  }

  if (!isModalOpen) return null;

  const handleFocusSelect = (index: number) => {
    setFocusList(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], selected: !newList[index].selected };
      return newList;
    });
  };

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
    duration: z.union([
      z.string().nonempty("Duration is required"),
      z.number()
    ]),
    workouts: z.array(workoutDaySchema).min(1, "At least 1 workout day plan is required"),
    focus: z.array(z.string()).min(1, "please Add Focus Areas to the schedule")
  })

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

    if (editingSchedule?.id) {
      await updateSchedule(userId, editingSchedule.id, plan);
    } else {
      await addScheduleDoc(userId, plan);
    }

    setIsModalOpen(false)
    setMode(false)
  };

  console.log("Workout Plan Info at Workouts Add MOdal", workoutPlanInfo)

  // Style helper snippet injected directly into standard input wrappers to safely prevent browser autofill styling corruption
  const autofillOverride = {
    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
    WebkitTextFillColor: "rgba(255, 255, 255, 0.8)",
    transition: "background-color 5000s ease-in-out 0s",
  };

  return (
    <LayoutGroup>
      <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-150 gap-2">
        <AnimatedContainer
          duration={0.3}
          className="bg-black/80 backdrop-blur-3xl relative w-[90vw] max-w-4xl h-[90vh] rounded-2xl p-6 flex flex-col overflow-hidden  border-t-white/30 border-b-white/5 border border-x-white/4 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.15)]">

      

          {isAiLoading && <LightRays color="#4fefcc5d" />}

          {/* Header */}
          <div className="relative z-10 flex justify-between items-start border-b border-white/5 pb-4 shrink-0">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold tracking-wide uppercase text-white/90">
                {editingSchedule?.id ? "Edit Workout Schedule" : "Add Workout Schedule"}
              </h2>
              <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mt-0.5">
                Roster // {editingSchedule?.id ? "Modify existing physical prescription program" : "Architect comprehensive training matrix routine"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancle}
              className="text-white/40 hover:text-white/90 text-xs font-mono tracking-wider uppercase bg-white/[0.03] border border-white/5 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200"
            >
              ✕
            </button>
          </div>

          {/* AI Assistance Switcher Panel */}
          <div className="relative z-10 flex flex-col items-center my-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl shrink-0">
            <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-white/30 mb-2">
              Intelligence Stream Optimization Route
            </span>
            <CustomTabsWithTooltips setMode={setMode} />
          </div>

          {/* Main Content Workspace Form */}
          <div className="relative z-10 flex-1 flex flex-col gap-6 overflow-y-auto pr-1 py-1 scrollbar-thin">
            
            {/* Core Metadata Fields Rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
              {/* Field - Workout Title */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${baseId}-title`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer select-none">
                  Workout Title
                </label>
                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                  <input 
                    id={`${baseId}-title`}
                    onChange={(e) => handleScheduleTitle('title', e.target.value)}
                    value={workoutPlanInfo.title}
                    placeholder="Basic Schedule"
                    type="text" 
                    name="title" 
                    className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold tracking-wide placeholder:text-white/25 uppercase transition-colors duration-300"
                    style={autofillOverride}
                  />
                </div>
              </div>

              {/* Field - Frequency */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${baseId}-frequency`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer select-none">
                  Frequency Velocity
                </label>
                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                  <input 
                    id={`${baseId}-frequency`}
                    onChange={(e) => handleScheduleTitle('frequency', e.target.value)}
                    value={workoutPlanInfo.frequency}
                    placeholder="3 days per week"
                    type="text" 
                    name="frequency" 
                    className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold tracking-wide placeholder:text-white/25 uppercase transition-colors duration-300"
                    style={autofillOverride}
                  />
                </div>
              </div>

              {/* Field - Duration */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${baseId}-duration`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer select-none">
                  Timeline Duration
                </label>
                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                  <input 
                    id={`${baseId}-duration`}
                    onChange={(e) => handleScheduleTitle('duration', e.target.value)} 
                    type="text"
                    value={workoutPlanInfo.duration}
                    placeholder="3 Months"
                    name="duration" 
                    className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold tracking-wide placeholder:text-white/25 uppercase transition-colors duration-300"
                    style={autofillOverride}
                  />
                </div>
              </div>
            </div>

            {/* Target Focus Areas Selection Map */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40">
                Target Biometric Focus Matrices
              </span>
              <div className="flex flex-wrap gap-2">
                {focusList.map((focusItem, index) => (
                  <p
                    key={index}
                    onClick={() => handleFocusSelect(index)}
                    className={`px-3.5 py-1.5 cursor-pointer rounded-xl text-[11px] font-bold tracking-wide uppercase transition-all duration-300 border ${
                      focusItem.selected 
                        ? "bg-[#0affca] text-black border-[#0affca]/20 shadow-[0_2px_8px_rgba(10,255,202,0.15)]" 
                        : "bg-white/[0.02] text-white/50 border-white/5 hover:bg-white/[0.05] hover:text-white/80"
                    }`}
                  >
                    {focusItem.name}
                  </p>
                ))}
              </div>
            </div>

            {/* Dynamic Training Modules Matrix Segment */}
            <div className="flex flex-col gap-3 min-h-[160px]">
              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40">
                Workout Sequence Calendar Blocks
              </span>

              {isAiLoading ? (
                <div className="flex h-40 max-h-40 relative items-center justify-center bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
                  <Ripple />
                </div>
              ) : (
                <AddWorkoutsForm 
                  workoutDayList={workoutDayList} 
                  handleRemoveDay={handleRemoveDay} 
                  handleExerciseChange={handleExerciseChange} 
                  handleRemoveExercise={handleRemoveExercise} 
                  handleAddExercise={handleAddExercise} 
                />
              )}

              {!isAiLoading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddDay();
                  }}
                  className="w-full py-3 bg-white/[0.02] border border-dashed border-white/10 hover:border-white/20 text-white/60 hover:text-white/90 text-xs font-bold font-mono tracking-wider uppercase rounded-xl cursor-pointer transition-all duration-200 mt-2"
                >
                  + Append New Training Day Roster
                </button>
              )}
            </div>
          </div>

          {/* Actions Footer Layer Controls */}
          <div className="relative z-10 flex mt-2 justify-end gap-3 border-t border-white/5 pt-4 shrink-0">
            {validationError && (
              <div className="flex flex-1 items-center px-4 rounded-xl bg-red-950/20 border border-red-500/10">
                <p className="text-[#f31936] text-[11px] font-mono font-bold uppercase tracking-wider">
                  Error // {validationError}
                </p>
              </div>
            )}
            
            <div 
              onClick={handleConfirm}
              className="h-10 px-6 flex items-center justify-center rounded-xl text-xs font-bold tracking-wider uppercase text-black bg-[#0ae2ff7a] border border-[#0affca]/20 hover:bg-[#0ae2ffad] shadow-[0_4px_12px_rgba(10,255,202,0.2)] active:scale-95 transition-all duration-250 cursor-pointer"
            >
              <p>{editingSchedule?.id ? "Update Deployment" : "Confirm Provision"}</p>
            </div>

            <div 
              onClick={handleCancle} 
              className="h-10 px-5 flex items-center justify-center rounded-xl text-xs font-bold tracking-wider uppercase text-white/50 bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:text-white/80 transition-all duration-200 cursor-pointer"
            >
              <p>Cancel</p>
            </div>
          </div>

        </AnimatedContainer>

        <AnimatePresence >
          {mode && (
            <AIWindow
              userData={userData}
              setWorkoutPlanInfo={setWorkoutPlanInfo}
              setIsAiLoading={setIsAiLoading}
              setWorkoutDayList={setWorkoutDayList}
              setFocusList={setFocusList}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default WorkoutsAddModal;