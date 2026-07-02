import { mealPlanExample, mealPlanResponceSchema, OpenAImealPlanResponceSchema } from "@/src/const/prompts";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
export const OPTIONS = async () => {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*', // Allows requests from your phone
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
};
export const POST = async (req: NextRequest) => {
    console.log("Post Api Fired");
    try {
        const body = await req.json();
        const { age, gender, weightLoss, currentWeight, height, targetWeight, weeklyPaceKg, curentBMI, fastingProtocolName, FMT, LMT, fastingProtocol } = body;
        console.log("Request body taken");

        const systemInstruction = `You are a professional fitness coach and clinical nutritionist. Generate a highly personalized meal plan for a person whou is following ${fastingProtocol} - ${fastingProtocolName} fasting protocol. when generating the meal plan, base the given user variables.
CRITICAL REQUIREMENT:
- time of the first meal in the meals array should match ${FMT}
- time of the last meal in the meals array should match ${LMT}
- you can add any other meals in between the first meal time and last meal time if needed.ONLY IF NESSASARY. example:MID-WINDOW SNACK 
- You must return the response EXACTLY in the JSON format provided in the responseSchema. Do not include any introductory text, Markdown formatting blocks, code fences, or explanatory footnotes. Return ONLY a valid JSON object.
- each meal should cleary mention the portion. in grams liters or any other way. example: 200g of red rice, 200g of chicken roasted breast etc.
- do not add 2 3 food items together when creating a meal.spred items in the array. example: instead of ["6 string hoppers with spicy dhal curry and 2 boild eggs"] give ["6 string hoppers","spicy dhal curry", "6 Boild eggs"]

Local Food Guidelines:
- All meal items must be easily obtainable and commonly prepared in Sri Lanka.
- Provide a "main" option and exactly two distinct "alternative" options for every single meal type.
- Generate at least 3 separate, distinct day plans inside the "plans" array.

`;

        const userPrompt = `Generate a personalized meal plan for below user variables:
- currentBMI: ${curentBMI} 
- Age: ${age} years old
- Gender: ${gender}
- Goal: To ${weightLoss ? "lose" : "gain"} weight
- Current Weight: ${currentWeight} Kg
- Height: ${height} CM
- Targeted Weight: ${targetWeight} KG
- Target Pace: ${weeklyPaceKg} kg per week

Reference Structure:
- JSON Reference Structure: ${mealPlanExample}`;

        const OpenAiPrompt = `${systemInstruction} ${userPrompt}`

        const ai = new GoogleGenAI({});
        let mealPlan: any = null;

        // --- LAYER 1: Primary Gemini Model ---
        try {
            console.log("Attempting Gemini Primary...");
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: mealPlanResponceSchema,
                    temperature: 0.2
                }
            });

            if (response.text) {
                mealPlan = JSON.parse(response.text);
            }
        } catch (error: any) {
            console.warn(`Gemini Primary failed (Status: ${error.status}). checking failover conditions...`);

            // Re-throw if it's not a rate-limit or service issue
            if (error.status !== 503 && error.status !== 429) {
                throw error;
            }
        }

        // --- LAYER 2: Fallback Gemini Lite (If Layer 1 failed) ---
        if (!mealPlan) {
            try {
                console.warn("Failing over to gemini-2.5-flash-lite...");
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-lite",
                    contents: userPrompt,
                    config: {
                        systemInstruction: systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: mealPlanResponceSchema,
                        temperature: 0.2
                    }
                });

                if (response.text) {
                    mealPlan = JSON.parse(response.text);
                }
            } catch (error: any) {
                console.warn(`Gemini Lite failed (Status: ${error.status}).`);
                if (error.status !== 503 && error.status !== 429) {
                    throw error;
                }
            }
        }

        // --- LAYER 3: Fallback OpenAI (If Gemini completely failed) ---
        if (!mealPlan) {
            try {
                console.warn("Failing over to OpenAI...");
                const openai = new OpenAI({
                    apiKey: process.env.OPEN_AI_API_KEY,
                });
                const openAiResponse = await openai.responses.create({
                    model: "gpt-5.4-mini",
                    input: OpenAiPrompt,
                    store: true,
                    text: {
                        format: {
                            type: 'json_schema',
                            name: 'meal_plan_schema',
                            strict: true,
                            schema: OpenAImealPlanResponceSchema,
                        },
                    },
                });

                const rawText = openAiResponse.output_text;
                const cleaned = rawText.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "");

                // Attempt JSON parsing with cleanup logic fallback
                try {
                    mealPlan = JSON.parse(cleaned);
                } catch {
                    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                    if (jsonMatch) mealPlan = JSON.parse(jsonMatch[0]);
                }
            } catch (openAiError: any) {
                console.error("OpenAI API error:", openAiError);
                return NextResponse.json(
                    { success: false, error: "All AI fallback pathways exhausted.", details: openAiError.message },
                    { status: 502 }
                );
            }
        }

        // --- Final Response Send ---
        if (mealPlan) {
            return NextResponse.json({ success: true, data: mealPlan }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        } else {
            return NextResponse.json({ success: false, error: "Failed to compile structure from any provider." }, { status: 500 });
        }

    } catch (globalError: any) {
        console.error("Meal Plan Route Backend Error:", globalError);
        return NextResponse.json(
            { success: false, error: "Internal server error", details: globalError.message || String(globalError) },
            { status: 500 }
        );
    }
};