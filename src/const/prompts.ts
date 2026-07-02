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

export const mealPlanResponceSchema = {
  type: Type.OBJECT,
  properties: {
    plans: {
      type: Type.ARRAY,
      description: "An array of detailed daily meal plan options.",
      items: {
        type: Type.OBJECT,
        properties: {
          planName: { type: Type.STRING, description: "The descriptive title of this specific day plan." },
          focus: { type: Type.STRING, description: "The nutritional focal point or strategy for this day." },
          meals: {
            type: Type.ARRAY,
            description: "List of meals scheduled within the eating window.",
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "The classification of the meal (e.g., BREAKFAST, LUNCH, DINNER, MID-WINDOW SNACK)." },
                time: { type: Type.STRING, description: "The specific local clock time for the meal (e.g., '12:00 PM')." },
                items: {
                  type: Type.OBJECT,
                  description: "Object containing the primary and alternative food choices.",
                  properties: {
                    main: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING, description: "Food name alongside precise gram/serving metrics." },
                          kcal: { type: Type.INTEGER },
                          protein: { type: Type.INTEGER },
                          carbs: { type: Type.INTEGER },
                          fat: { type: Type.INTEGER }
                        },
                        required: ["id", "name", "kcal", "protein", "carbs", "fat"]
                      }
                    },
                    alternative1: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          kcal: { type: Type.INTEGER },
                          protein: { type: Type.INTEGER },
                          carbs: { type: Type.INTEGER },
                          fat: { type: Type.INTEGER }
                        },
                        required: ["id", "name", "kcal", "protein", "carbs", "fat"]
                      }
                    },
                    alternative2: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          kcal: { type: Type.INTEGER },
                          protein: { type: Type.INTEGER },
                          carbs: { type: Type.INTEGER },
                          fat: { type: Type.INTEGER }
                        },
                        required: ["id", "name", "kcal", "protein", "carbs", "fat"]
                      }
                    }
                  },
                  required: ["main", "alternative1", "alternative2"]
                }
              },
              required: ["type", "time", "items"]
            }
          }
        },
        required: ["planName", "focus", "meals"]
      }
    },
    coachReminders: {
      type: Type.ARRAY,
      description: "A list of actionable coaching rules regarding hydration, window constraints, and execution.",
      items: { type: Type.STRING }
    }
  },
  required: ["plans", "coachReminders"]
};

export const OpenAImealPlanResponceSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "plans": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "planName": { "type": "string" },
          "focus": { "type": "string" },
          "meals": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "type": { "type": "string" },
                "time": { "type": "string" },
                "items": {
                  "type": "object",
                  "properties": {
                    "main": { "$ref": "#/definitions/mealItemArray" },
                    "alternative1": { "$ref": "#/definitions/mealItemArray" },
                    "alternative2": { "$ref": "#/definitions/mealItemArray" }
                  },
                  "required": ["main", "alternative1", "alternative2"],
                  "additionalProperties": false
                }
              },
              "required": ["type", "time", "items"],
              "additionalProperties": false
            }
          }
        },
        "required": ["planName", "focus", "meals"],
        "additionalProperties": false
      }
    },
    "coachReminders": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["plans", "coachReminders"],
  "additionalProperties": false,
  "definitions": {
    "mealItemArray": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "kcal": { "type": "integer" },
          "protein": { "type": "integer" },
          "carbs": { "type": "integer" },
          "fat": { "type": "integer" }
        },
        "required": ["id", "name", "kcal", "protein", "carbs", "fat"],
        "additionalProperties": false
      }
    }
  }
}

export const mealPlanExample = {
 
    "plans": [
        {
            "planName": "Lean Poultry & Local Greens",
            "focus": "Focus: High protein from lean chicken breast to maximize muscle preservation during aggressive deficit.",
            "meals": [
                {
                    "type": "BREAKFAST",
                    "time": "12:00 PM",
                    "items": {
                        "main": [
                            { "id": "b1_1", "name": "200g Skinless Chicken Breast Curry", "kcal": 330, "protein": 62, "carbs": 0, "fat": 7 },
                            { "id": "b1_2", "name": "1 small cup of Red Basmati Rice", "kcal": 150, "protein": 3, "carbs": 33, "fat": 1 }
                        ],
                        "alternative1": [
                            { "id": "ab1_1", "name": "200g Grilled Chicken Breast", "kcal": 300, "protein": 60, "carbs": 0, "fat": 6 },
                            { "id": "ab1_2", "name": "150g Boiled Sweet Potato (Bathala)", "kcal": 130, "protein": 2, "carbs": 30, "fat": 0 }
                        ],
                        "alternative2": [
                            { "id": "a2b1_1", "name": "200g Minced Chicken Breast Stir-fry", "kcal": 310, "protein": 58, "carbs": 3, "fat": 6 },
                            { "id": "a2b1_2", "name": "2 slices of Local Whole-Wheat Brown Bread", "kcal": 140, "protein": 6, "carbs": 26, "fat": 2 }
                        ]
                    }
                },
                {
                    "type": "LUNCH",
                    "time": "3:30 PM",
                    "items": {
                        "main": [
                            { "id": "l1_1", "name": "3 Egg Whites + 1 Whole Egg Omelet", "kcal": 120, "protein": 16, "carbs": 1, "fat": 5 }
                        ],
                        "alternative1": [
                            { "id": "al1_1", "name": "150g Low-fat Curd (Unsweetened)", "kcal": 110, "protein": 11, "carbs": 7, "fat": 4 }
                        ],
                        "alternative2": [
                            { "id": "a2l1_1", "name": "1 cup of boiled Mung Beans (Mung Ata)", "kcal": 200, "protein": 14, "carbs": 36, "fat": 1 }
                        ]
                    }
                },
                {
                    "type": "MID-WINDOW SNACK",
                    "time": "5:30 PM",
                    "items": {
                        "main": [
                            { "id": "m1_1", "name": "1 glass of Unsweetened Whey Protein mix in water", "kcal": 120, "protein": 25, "carbs": 2, "fat": 1 }
                        ],
                        "alternative1": [
                            { "id": "am1_1", "name": "2 Boiled Eggs", "kcal": 140, "protein": 13, "carbs": 1, "fat": 10 }
                        ],
                        "alternative2": [
                            { "id": "a2m1_1", "name": "100g of pan-seared King Prawns", "kcal": 130, "protein": 24, "carbs": 1, "fat": 3 }
                        ]
                    }
                },
                {
                    "type": "DINNER",
                    "time": "7:30 PM",
                    "items": {
                        "main": [
                            { "id": "d1_1", "name": "150g Grilled Seer Fish (Thora Malu)", "kcal": 210, "protein": 34, "carbs": 0, "fat": 7 }
                        ],
                        "alternative1": [
                            { "id": "ad1_1", "name": "150g Tuna Fish Steak Curry", "kcal": 200, "protein": 36, "carbs": 0, "fat": 5 }
                        ],
                        "alternative2": [
                            { "id": "a2d1_1", "name": "150g Lean Beef Curry", "kcal": 250, "protein": 39, "carbs": 0, "fat": 9 }
                        ]
                    }
                }
            ]
        }
    ],
    "coachReminders": [
        "Strict Window Enforcement: Stop consuming any caloric foods or beverages promptly at 8:00 PM.",
        "High Intake of Pure Water is mandatory.",
        "Preserve Lean Mass by prioritizing protein components."
    ]
}

const mealPlan = {
    "FastingStartHour": 20.0,
    "FastingLength": 16,
    "fastingProtocol": "16:8",
    "plans": [
        {
            "planName": "Lean Poultry & Local Greens",
            "focus": "Focus: High protein from lean chicken breast to maximize muscle preservation during aggressive deficit.",
            "meals": [
                {
                    "type": "BREAKFAST",
                    "time": "12:00 PM",
                    "items": {
                        "main": [
                            { "id": "b1_1", "name": "200g Skinless Chicken Breast Curry", "kcal": 330, "protein": 62, "carbs": 0, "fat": 7 },
                            { "id": "b1_2", "name": "1 small cup of Red Basmati Rice", "kcal": 150, "protein": 3, "carbs": 33, "fat": 1 },
                            { "id": "b1_3", "name": "1 cup of Gotukola Mallung (minimal coconut)", "kcal": 45, "protein": 2, "carbs": 5, "fat": 2 }
                        ],
                        "alternative1": [
                            { "id": "ab1_1", "name": "200g Grilled Chicken Breast", "kcal": 300, "protein": 60, "carbs": 0, "fat": 6 },
                            { "id": "ab1_2", "name": "150g Boiled Sweet Potato (Bathala)", "kcal": 130, "protein": 2, "carbs": 30, "fat": 0 },
                            { "id": "ab1_3", "name": "Stir-fried Kankun (with 1 tsp coconut oil)", "kcal": 50, "protein": 3, "carbs": 4, "fat": 3 }
                        ],
                        "alternative2": [
                            { "id": "a2b1_1", "name": "200g Minced Chicken Breast Stir-fry", "kcal": 310, "protein": 58, "carbs": 3, "fat": 6 },
                            { "id": "a2b1_2", "name": "2 slices of Local Whole-Wheat Brown Bread", "kcal": 140, "protein": 6, "carbs": 26, "fat": 2 },
                            { "id": "a2b1_3", "name": "Cucumber and Tomato Salad with lime juice", "kcal": 25, "protein": 1, "carbs": 5, "fat": 0 }
                        ]
                    }
                },
                {
                    "type": "LUNCH",
                    "time": "3:30 PM",
                    "items": {
                        "main": [
                            { "id": "l1_1", "name": "3 Egg Whites + 1 Whole Egg Omelet", "kcal": 120, "protein": 16, "carbs": 1, "fat": 5 },
                            { "id": "l1_2", "name": "A handful of roasted unsalted Cashew nuts", "kcal": 150, "protein": 5, "carbs": 9, "fat": 12 }
                        ],
                        "alternative1": [
                            { "id": "al1_1", "name": "150g Low-fat Curd (Unsweetened)", "kcal": 110, "protein": 11, "carbs": 7, "fat": 4 },
                            { "id": "al1_2", "name": "1 small Local Banana (Ambul)", "kcal": 90, "protein": 1, "carbs": 22, "fat": 0 }
                        ],
                        "alternative2": [
                            { "id": "a2l1_1", "name": "1 cup of boiled Mung Beans (Mung Ata)", "kcal": 200, "protein: ": 14, "carbs": 36, "fat": 1 },
                            { "id": "a2l1_2", "name": "1 Hard-boiled Egg", "kcal": 70, "protein": 6, "carbs": 0, "fat": 5 }
                        ]
                    }
                },
                {
                    "type": "Mid-Window Snack",
                    "time": "5:30 PM",
                    "items": [
                        {
                            "main": [
                                { "id": "m1_1", "name": "1 glass of Unsweetened Whey Protein mix in water", "kcal": 120, "protein": 25, "carbs": 2, "fat": 1 }
                            ],
                            "alternative1": [
                                { "id": "am1_1", "name": "2 Boiled Eggs", "kcal": 140, "protein": 13, "carbs": 1, "fat": 10 }
                            ],
                            "alternative2": [
                                { "id": "a2m1_1", "name": "100g of pan-seared King Prawns in minimal butter", "kcal": 130, "protein": 24, "carbs": 1, "fat": 3 }
                            ]
                        }
                    ]
                },
                {
                    "type": "Dinner",
                    "time": "7:30 PM",
                    "items": [
                        {
                            "main": [
                                { "id": "d1_1", "name": "150g Grilled Seer Fish (Thora Malu)", "kcal": 210, "protein": 34, "carbs": 0, "fat": 7 },
                                { "id": "d1_2", "name": "A large bowl of Mixed Vegetable Soup with Dhal", "kcal": 140, "protein": 7, "carbs": 22, "fat": 2 }
                            ],
                            "alternative1": [
                                { "id": "ad1_1", "name": "150g Tuna Fish Steak Curry", "kcal": 200, "protein": 36, "carbs": 0, "fat": 5 },
                                { "id": "ad1_2", "name": "4 Red Rice String Hoppers", "kcal": 150, "protein": 3, "carbs": 32, "fat": 1 },
                                { "id": "ad1_3", "name": "Pol Sambol (Strictly maximum 1 tablespoon)", "kcal": 60, "protein": 1, "carbs": 2, "fat": 5 }
                            ],
                            "alternative2": [
                                { "id": "a2d1_1", "name": "150g Lean Beef Curry (Trimming all visible fat)", "kcal": 250, "protein": 39, "carbs": 0, "fat": 9 },
                                { "id": "a2d1_2", "name": "1 small Kurakkan Roti (Finger Millet)", "kcal": 130, "protein": 3, "carbs": 26, "fat": 1 }
                            ]
                        }
                    ]
                }
            ]
        },
     
    ],
    "coachReminders": [
        "Strict Window Enforcement: Stop consuming any caloric foods or beverages promptly at 8:00 PM and remain fasting until noon the next day.",
        "High Intake of Pure Water: To handle an aggressive 1kg/week pace, drinking adequate fluids is mandatory to manage metabolic waste and minimize hunger cues.",
        "Preserve Your Lean Mass: Prioritize eating the high-protein portions (chicken, fish, beef, eggs) fully at every single meal so your body targets adipose fat tissue rather than muscle breakdown."
    ]
}
