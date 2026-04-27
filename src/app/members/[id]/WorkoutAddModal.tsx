'use client'
import CustomTabsWithTooltips from "@/src/components/ui/tabsCard";
import { error } from "console";
import { useState } from "react";
import { z } from 'zod'
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
};


type workoutPlanInfo = {
  title: string,
  frequency: string,
  workoutsCount: number,
  workouts: WorkoutDay[],
  duration: string,
  focus: string[]

}

const WorkoutsAddModal = ({ isModalOpen, setIsModalOpen, userSchedule }: Props) => {
  if (!isModalOpen) return null;
  const [validationError, setValidationError] = useState<string | undefined>()
  const [workoutDayList, setWorkoutDayList] = useState<WorkoutDay[]>([]);
  const [workoutPlanInfo, setWorkoutPlanInfo] = useState<workoutPlanInfo>({
    title: '',
    frequency: '',
    duration: '',
    focus: [],
    workoutsCount: 0,
    workouts: []
  })
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



  const handleConfirm = () => {
    // setWorkoutPlanInfo(prev => ({
    //   ...prev,
    //   schedule: [...workoutDayList],
    //   workoutsCount: workoutDayList.length > 0
    //     ? workoutDayList.reduce((acc, day) => acc + day.schedule.length, 0)
    //     : 0,
    //   focus: focusList.filter(item => item.selected).map(item => item.name),
    // }));

     const plan = {
    ...workoutPlanInfo,
    workouts: workoutDayList,
    focus: focusList.filter(f => f.selected).map(f => f.name),
  }
  console.log("workout plan: ",plan)
    const result = workoutPlanSchema.safeParse(plan);
    if (!result.success) {
      setValidationError(result.error.issues[0].message)
      console.log("Validation errors:", result.error.issues[0].message);
      return;  
    }else{

      setValidationError('')
    }
    
    console.log("Valid plan:", result.data);
  };


  console.log(workoutDayList)
  console.log(workoutPlanInfo)
  return (
    <div className="fixed inset-0 bg-gray-600/30 flex items-center justify-center z-50">
      <div className="bg-[#000000]/50 w-[90vw] max-w-4xl h-[90vh] rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-heading text-lg mt-2">Add Workout Schedule</p>
            <p className="text-sub text-sm">Create a comprehensive workout program</p>
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
          <CustomTabsWithTooltips />
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
          <div className="flex flex-col gap-4">
            {workoutDayList.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-[#5e656c70] rounded-2xl p-3 shadow">

                {/* Day header */}
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Day {day.day}</p>

                  <p
                    onClick={() => handleRemoveDay(dayIndex)}
                    className="flex p-2 cursor-pointer"
                  >✕</p>

                </div>

                {/* Exercise list */}
                <div className="flex flex-col gap-2">
                  {day.schedule.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="bg-[#74777a44] justify-around flex gap-2 rounded-xl p-3 items-center mb-2">

                      <p>{exerciseIndex + 1}</p>
                      <input
                        type="text"
                        placeholder="Exercise name"
                        required
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)
                        }
                        className="bg-[#000000cb] flex-1 rounded px-2 py-1 text-white "
                      />
                      <input
                        type="text"
                        required
                        placeholder="Reps (e.g. 12,10,8,6)"
                        value={exercise.reps.join(",")}
                        onChange={(e) =>
                          handleExerciseChange(dayIndex, exerciseIndex, "reps", e.target.value.split(","))
                        }
                        className="bg-[#000000cb] rounded px-2 py-1 text-white"
                      />

                      <p
                        onClick={() => { handleRemoveExercise(dayIndex, exerciseIndex) }}
                        className="cursor-pointer"
                      >
                        ✕</p>
                    </div>
                  ))}
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddExercise(dayIndex);
                  }}
                  className="px-2 py-1 bg-[#050505cd] font-semibold text-center text-white rounded cursor-pointer hover:bg-[#7e7e7ef0] hover:text-black"
                >
                  + Add Exercise
                </div>
              </div>


            ))}
          </div>


        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 mt-2">
          {validationError && <div className=" flex flex-1 items-center justify-center rounded-md bg-[#8e909322]">
            <p className="text-[#f31936] font-bold">{validationError}</p>
          </div>}
          <div className="confirm  p-2 bg-[#3ce7c2c0] rounded-lg cursor-pointer" onClick={handleConfirm}><p>Confirm</p></div>
          <div onClick={() => { setIsModalOpen(false) }} className="cancle p-2 bg-[#474547db] rounded-lg cursor-pointer"><p>Cancle</p></div>
        </div>

      </div>
    </div>
  );
};

export default WorkoutsAddModal;
