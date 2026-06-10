import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { WorkoutPlanSchema } from "@/src/const/prompts";

export async function POST(req: NextRequest) {

  const { height, weight, goals, experienceLevel, promptType, customPrompt, scheduleData, type } = await req.json();
const prompts = {

        withScheduleNoPropmt: `Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}.  

You are also given an existing JSON object called scheduleData.  
- Keep all fields and values from scheduleData exactly as provided.  
- Merge your plan with scheduleData by adding new workouts, days, or focus items if needed.  
- Do not remove or overwrite any of the admin’s data.  
- Correct spelling mistakes silently.  

- Return ONLY a valid JSON object,   no code fences.add a little discription about the workout plan in the description filed 
below

scheduleData = ${scheduleData}

*Make sure to INCLUDE the data Included with the scheduleData provided above in your generated Plan.

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
        withScheduleAndPrompt: `Generate a workout plan for a Gym user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}.*ADMIN HAS GIVEN SPECIFIC INSTRUCTIONS mentioned within quotes.consider them with highest Priority " ${customPrompt} "* 
      
              You are also given an existing JSON object called scheduleData.  
               * Keep all fields and values from scheduleData exactly as provided.  
               * Merge your plan with scheduleData by adding new workouts, days, or focus items if needed.  
               * Do not remove or overwrite any of the admin’s data. 
               * Correct spelling mistakes silently.  
              - Return ONLY a valid JSON object,   no code fences.add a little discription about the workout plan in the description filed 
              below

              scheduleData = ${scheduleData}
              *Make sure to INCLUDE the data Included with the scheduleData provided above in your generated Plan.

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


        noScheduleButPrompt: `Generate a weekly workout plan for a user with height ${height}cm, weight ${weight}kg, goal ${goals}, and experience level ${experienceLevel}. 
      *ADMIN HAS GIVEN SPECIFIC INSTRUCTIONS mentioned within quotes.consider them with highest Priority " ${customPrompt} ".* Generate a weekly workout plan as a valid JSON object.
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
* Do not create more than 2 workout days. include at least 8 exercise each day. if the experience is low, then make only one day plan with at least 10 workouts
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

  try {



    if (type === "gemini") {

     

      const ai = new GoogleGenAI({});
      console.log("GEMINI FIRED")

      try {


        // Prepare contextual strings dynamically
        const adminInstruction = customPrompt ? `\n- CRITICAL ADMIN INSTRUCTION: "${customPrompt}"` : "";
        const mergeInstruction = scheduleData
          ? `\n- MERGE PLAN WITH EXISTING SCHEDULE: You must preserve all existing data fields inside this scheduleData. Do not remove or overwrite admin data; build upon it:\n${JSON.stringify(scheduleData)}`
          : "\n- Create a brand new plan from scratch.";

        const systemPrompt = `You are an expert fitness coach. Generate a weekly workout plan for a user based on their stats and constraints ${prompts[promptType as keyof typeof prompts]} ${adminInstruction} ${mergeInstruction}`

        // `You are an expert fitness coach. Generate a weekly workout plan for a user based on their stats and constraints.

        // User Profile:
        // - Height: ${height}cm
        // - Weight: ${weight}kg
        // - Goal: ${goals}
        // - Experience Level: ${experienceLevel}
        // ${adminInstruction}
        // ${mergeInstruction}`;

       

        let response
        try {
          // Primary attempt with your preferred model
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate the workout plan matching the schema constraints.",
            config: { systemInstruction: systemPrompt, responseMimeType: "application/json", responseSchema: WorkoutPlanSchema, temperature: 0.2 }
          });
        } catch (error: any) {
          // If the server is overloaded (503), fall back automatically
          if (error.status === 503 || 429) {
            if(error.status === 429){
               console.warn("Free quota Exeeded");
            }
            console.warn("Primary Gemini model busy. Failing over to gemini-2.5-flash-lite...");
            response = await ai.models.generateContent({
              model: "gemini-2.5-flash-lite", // Safe, low-congestion endpoint
              contents: "Generate the workout plan matching the schema constraints.",
              config: { systemInstruction: systemPrompt, responseMimeType: "application/json", responseSchema: WorkoutPlanSchema, temperature: 0.2 }
            });
          } else {
            throw error; // Re-throw other unexpected errors to the main catch block
          }
        }

    

        // 4. Access the response data safely
        const rawText = response.text;

        if (!rawText) {
          return NextResponse.json(
            { success: false, error: "Gemini returned an empty response." },
            { status: 500 }
          );
        }

        // Since responseSchema guarantees strict JSON structure, we can safely parse it directly
        const workoutPlan = JSON.parse(rawText);

        // 5. Send it back to your frontend client
        return NextResponse.json({
          success: true,
          data: workoutPlan,
        });

      } catch (error: any) {
        console.error("Gemini Backend Error:", error);

        // Handle specific rate limits / quota issues on Gemini free tier (HTTP 429)
        if (error.status === 429 || error.message?.includes("quota")) {
          return NextResponse.json(
            { success: false, error: "Gemini Free Tier rate limit exceeded. Please try again in a moment." },
            { status: 429 }
          );
        }

        return NextResponse.json(
          { success: false, error: "Internal server error", details: error.message || String(error) },
          { status: 500 }
        );
      }

    }

    if (type === "openAi") {
      console.log("OPEN AI FIRED")
      

      console.log("At backend", promptType, prompts[promptType as keyof typeof prompts])
      let response;

      const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY,
      });


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


    }

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




