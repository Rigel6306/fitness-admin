import {  Type } from "@google/genai";




    export const WorkoutPlanSchema = {
  type: Type.OBJECT,
  properties: {
    data: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        frequency: { type: Type.STRING },
        workoutsCount: { type: Type.INTEGER },
        workouts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    name: { type: Type.STRING },
                    reps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING } // Using string allows both [10, 8, 6] and ["10-12"]
                    }
                  },
                  required: ["id", "name", "reps"],
                }
              }
            },
            required: ["day", "schedule"],
          }
        },
        duration: { type: Type.INTEGER },
        focus: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["title", "frequency", "workoutsCount", "workouts", "duration", "focus"],
    },
    description: { type: Type.STRING }
  },
  required: ["data", "description"],
};