
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
    return ( 


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
                          handleExerciseChange(dayIndex, exerciseIndex, "reps", e.target.value.split(/[,\s]+/))
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

     );
}
 
export default AddWorkoutsForm;