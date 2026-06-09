'use client'

interface Exercise {
  id: string;
  name: string;
  reps: string[];
}

interface WorkoutDay {
  day: number;
  schedule: Exercise[];
}

interface AddWorkoutsManualProps {
  workoutDayList: WorkoutDay[];
  handleRemoveDay: (dayIndex: number) => void;
  handleExerciseChange: (
    dayIndex: number,
    exerciseIndex: number,
    field: 'name' | 'reps',
    value: string | string[]
  ) => void;
  handleRemoveExercise: (dayIndex: number, exerciseIndex: number) => void;
  handleAddExercise: (dayIndex: number) => void;
}

const AddWorkoutsForm = ({
  workoutDayList,
  handleRemoveDay,
  handleExerciseChange,
  handleRemoveExercise,
  handleAddExercise,
}: AddWorkoutsManualProps) => {

  // Style helper snippet injected to safely prevent browser autofill styling corruption
  const autofillOverride = {
    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
    WebkitTextFillColor: "rgba(255, 255, 255, 0.8)",
    transition: "background-color 5000s ease-in-out 0s",
  };

  return (
    <div className="flex flex-col gap-5">
      {workoutDayList.map((day, dayIndex) => (
        <div 
          key={dayIndex} 
          className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/10"
        >
          {/* Day Header Block */}
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#0affca] rounded-sm shadow-[0_0_8px_rgba(10,255,202,0.4)]" />
              <p className="font-bold font-mono text-xs uppercase tracking-wider text-white/80">
                Training Day Matrix {day.day}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveDay(dayIndex)}
              className="text-white/30 hover:text-red-400 text-[10px] font-mono tracking-wider uppercase bg-white/[0.02] border border-white/5 hover:border-red-500/20 px-2 py-1 rounded-lg cursor-pointer transition-all duration-200"
            >
              ✕ Purge Block
            </button>
          </div>

          {/* Exercise Items Queue */}
          <div className="flex flex-col gap-2.5 mb-4">
            {day.schedule.map((exercise, exerciseIndex) => (
              <div 
                key={exercise.id} 
                className="bg-white/2 border border-white/5 flex gap-3 rounded-xl p-3 items-center relative group transition-all duration-200 focus-within:border-white/10"
              >
                {/* Index badge */}
                <div className="w-5 h-5 flex items-center justify-center rounded-md bg-white/4 text-[10px] font-mono font-bold text-white/40 border border-white/5">
                  {String(exerciseIndex + 1).padStart(2, '0')}
                </div>

                {/* Input Field - Exercise Name */}
                <div className="relative flex-1 h-9 bg-[#060608]/40 rounded-lg border border-white/5 focus-within:border-white/20 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Exercise Designation"
                    required
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)
                    }
                    className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-[11px] font-semibold tracking-wide placeholder:text-white/20 uppercase transition-colors duration-300"
                    style={autofillOverride}
                  />
                </div>

                {/* Input Field - Reps Definition */}
                <div className="relative w-48 h-9 bg-[#060608]/40 rounded-lg border border-white/5 focus-within:border-white/20 transition-all duration-300">
                  <input
                    type="text"
                    required
                    placeholder="Reps (e.g., 12,10,8,6)"
                    value={exercise.reps.join(",")}
                    onChange={(e) =>
                      handleExerciseChange(dayIndex, exerciseIndex, "reps", e.target.value.split(/[,\s]+/))
                    }
                    className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-[11px] font-mono tracking-wide placeholder:text-white/20 transition-colors duration-300"
                    style={autofillOverride}
                  />
                </div>

                {/* Remove Exercise Button Controls */}
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)}
                  className="w-8 h-9 flex items-center justify-center text-white/30 hover:text-red-400 border border-transparent hover:border-red-500/10 hover:bg-red-950/10 rounded-lg cursor-pointer transition-all duration-200 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Append New Segment Button Trigger */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAddExercise(dayIndex);
            }}
            className="w-full py-2.5 bg-[#060608]/20 border border-dashed border-white/5 hover:border-white/20 text-white/40 hover:text-white/90 text-[11px] font-bold font-mono tracking-wider uppercase rounded-xl cursor-pointer transition-all duration-200 text-center"
          >
            + Add a Workout
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddWorkoutsForm;