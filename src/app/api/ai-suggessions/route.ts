import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import OpenAI from "openai";
import { success } from "zod";
export async function POST(req: NextRequest) {
  const { height, weight, goals, experienceLevel, promptType,scheduleData } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY ,
  });

  console.log("Shedule Data: ",scheduleData)

  const prompts = {

    withSchedule:`Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}.  

You are also given an existing JSON object called scheduleData.  
- Keep all fields and values from scheduleData exactly as provided.  
- Merge your plan with scheduleData by adding new workouts, days, or focus items if needed.  
- Do not remove or overwrite any of the admin’s data.  
- Correct spelling mistakes silently.  
- Return ONLY a valid JSON object,   no code fences.add a little discription about the workout plan in the description filed below

scheduleData = ${scheduleData}

Example structure:
{data:{
  "title": "example schedule",
  "frequency": "day after day",
  "workoutsCount": 10,
  "workouts": [
    {
      "day": 1,
      "schedule": [
        { "id": 1, "name": "Leg Extension", "reps": [10, 8, 6] },
        { "id": 2, "name": "Barbell Shoulder Press", "reps": [10, 8, 6] }
      ]
    }
  ],
  "duration": 3,
  "focus": ["Chest", "Shoulders", "Arms"]
},
description:"Your Discription about the plan"
}
`,

        noShedule:`Generate a weekly workout plan for a user with height ${172}cm, weight ${90}kg, goal ${"weight loss"}, and experience level ${"1 year"}. Generate a weekly workout plan as a valid JSON object.
Return ONLY the JSON,  no code fences.add a little discription about the workout plan in the description filed below
Structure: {data:{
            title: 'Basic Schedule',
            frequency: 'day after day',
            workoutsCount: 10,
            workouts: [
                {
                    day: 1,
                    schedule:
                        [{ id: 1, name: "Leg Extension", reps: [10, 8, 6] },
                        { id: 2, name: "Barbell Shoulder Press", reps: [10, 8, 6] },
                        { id: 3, name: "Dumbbell Side Lateral", reps: [10, 8, 6] },
                        { id: 4, name: "Bent-Over Side Lateral", reps: ["10-12", "10-12", "10-12"] },
                        { id: 5, name: "Flat Bench Press", reps: [10, 8, 6] },
                        { id: 6, name: "Straight-Arm Pullover", reps: [12, 12, 12] },
                        { id: 7, name: "Lat Pulldown", reps: [12, 10, 8] },
                        { id: 8, name: "Barbell Curl", reps: [10, 8, 6] },
                        { id: 9, name: "Triceps Extension", reps: [10, 8, 6] },
                        { id: 10, name: "Forearm Exercise", reps: [15, 15, 15] }]
                }

            ],
            duration: 3,
            focus: ["Balanced full-body workout with emphasis on chest", "Shoulders", "Arms", "Basic strength"]
        },
        description:"Your Discription about the plan"
            
        }`

  }


  const response = openai.responses.create({
    model: "gpt-5.4-mini",
    input: prompts[promptType as keyof typeof prompts],
    store: true,
  });


  // Stream back to client
  // res is the raw text output from the model
const responce = (await response).output_text;

const cleaned = responce
  .replace(/```[a-z]*\n?/gi, "")  // remove ```js, ```json, etc.
  .replace(/```/g, "");           // remove closing ```

try {
  // Try to parse the text as JSON
  const workoutPlan = JSON.parse(cleaned);

  console.log("Parsed workout plan:", workoutPlan);
  

  // Now you can access fields like:
  console.log(workoutPlan.title);

return NextResponse.json({
    success: true,
    data: workoutPlan,
  });

} catch (error) {
  console.error("Failed to parse AI response as JSON:", error);

  // Optional: fallback if the AI added extra text around the JSON
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const workoutPlan = JSON.parse(jsonMatch[0]);
    console.log("Recovered workout plan:", workoutPlan);
  }
}



}
