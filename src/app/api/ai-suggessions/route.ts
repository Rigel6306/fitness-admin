import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { height, weight, goals, experienceLevel, promptType, customPrompt, scheduleData } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const prompts = {

      withScheduleNoPropmt: `Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}.  

You are also given an existing JSON object called scheduleData.  
- Keep all fields and values from scheduleData exactly as provided.  
- Merge your plan with scheduleData by adding new workouts, days, or focus items if needed.  
- Do not remove or overwrite any of the admin’s data.  
- Correct spelling mistakes silently.  
- maximum of 3 days. NO MORE THAN 3 DAYS
- Return ONLY a valid JSON object,   no code fences.add a little discription about the workout plan in the description filed 
below

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
      withScheduleAndPrompt: `Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}.ADMIN HAS GIVEN SPECIFIC INSTRUCTIONS mentioned within quotes.consider them with highest Priority " ${customPrompt} "  
              You are also given an existing JSON object called scheduleData.  
              - Keep all fields and values from scheduleData exactly as provided.  
              - Merge your plan with scheduleData by adding new workouts, days, or focus items if needed.  
              - Do not remove or overwrite any of the admin’s data.  
              - Correct spelling mistakes silently.  
              - maximum of 3 days. NO MORE THAN 3 DAYS
              - Return ONLY a valid JSON object,   no code fences.add a little discription about the workout plan in the description filed 
              below
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

               MAKE SURE TO ADD A DESCRIPTION to the description .
              `,


      noScheduleButPrompt: `Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}. ADMIN HAS GIVEN SPECIFIC INSTRUCTIONS mentioned within quotes.consider them with highest Priority " ${customPrompt} ". Generate a weekly workout plan as a valid JSON object.
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
        }
        MAKE SURE TO ADD A DESCRIPTION to the description .
        `,


      noScheduleNoPrompt: `Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}. Generate a weekly workout plan as a valid JSON object.
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

    console.log("At backend", promptType, prompts[promptType as keyof typeof prompts])
    let response;
    try {
      response = await openai.responses.create({
        model: "gpt-5.4-mini",
        input: prompts[promptType as keyof typeof prompts],
        store: true,
      });
    } catch (apiError: any) {
      // Handle API-level errors (quota, tokens, etc.)
      console.error("OpenAI API error:", apiError);

      // Check for specific error codes/messages
      if (apiError.error?.code === "insufficient_quota" || apiError.message?.includes("tokens")) {
        return NextResponse.json(
          {
            success: false,
            error: "Token limit or quota exceeded",
            details: apiError.message,
          },
          { status: 429 } // Too Many Requests
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to call OpenAI API",
          details: apiError.message,
        },
        { status: 500 }
      );
    }

    const rawText = response.output_text;
    const cleaned = rawText.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "");

    let workoutPlan;
    try {
      workoutPlan = JSON.parse(cleaned);
    } catch (parseError) {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutPlan = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse AI response as JSON",
            details: cleaned,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: workoutPlan,
    });

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}




