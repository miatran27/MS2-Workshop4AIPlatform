import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Recipe, RecipePreferences, RecipesResponse } from '@/lib/types';

const DEMO_RECIPES: Recipe[] = [
  {
    title: 'Tomato Garlic Pasta',
    timeEstimateMinutes: 25,
    difficulty: 'Easy',
    macrosEstimate: { protein: 12, carbs: 65, fat: 18, calories: 450 },
    ingredients: [
      { name: 'pasta', missing: false },
      { name: 'tomatoes', missing: false },
      { name: 'garlic', missing: false },
      { name: 'olive oil', missing: false },
      { name: 'fresh basil', missing: true },
    ],
    instructions: [
      'Boil salted water and cook pasta until al dente.',
      'Sauté garlic in olive oil, add chopped tomatoes and cook until saucy.',
      'Toss pasta with sauce and basil. Serve.',
    ],
    whyThisMatches: ['Uses all your pantry staples', 'Under 30 minutes', 'One pan possible'],
  },
  {
    title: 'Roasted Tomato & Onion Medley',
    timeEstimateMinutes: 40,
    difficulty: 'Easy',
    macrosEstimate: { protein: 4, carbs: 12, fat: 14, calories: 180 },
    ingredients: [
      { name: 'tomatoes', missing: false },
      { name: 'onions', missing: false },
      { name: 'garlic', missing: false },
      { name: 'olive oil', missing: false },
    ],
    instructions: [
      'Preheat oven to 400°F. Chop tomatoes and onions, add garlic.',
      'Toss with olive oil and roast 30–35 minutes until caramelized.',
      'Season with salt and pepper. Serve as side or over bread.',
    ],
    whyThisMatches: ['Oven-based, no extra equipment', 'Vegetarian', 'Balanced and simple'],
  },
  {
    title: 'Quick Tomato-Onion Sauté',
    timeEstimateMinutes: 15,
    difficulty: 'Easy',
    macrosEstimate: { protein: 2, carbs: 10, fat: 7, calories: 95 },
    ingredients: [
      { name: 'tomatoes', missing: false },
      { name: 'onions', missing: false },
      { name: 'garlic', missing: false },
      { name: 'olive oil', missing: false },
    ],
    instructions: [
      'Slice onions and tomatoes. Mince garlic.',
      'Sauté onions in olive oil until soft, add garlic and tomatoes.',
      'Cook 5–7 minutes. Season and serve.',
    ],
    whyThisMatches: ['Under 20 minutes', 'One pan', 'Minimal ingredients'],
  },
];

function isDemoMode(): boolean {
  return !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '';
}

const RECIPE_JSON_SCHEMA = `{
  "recipes": [
    {
      "title": "string",
      "timeEstimateMinutes": number,
      "difficulty": "Easy" | "Medium" | "Hard",
      "macrosEstimate": { "protein": number, "carbs": number, "fat": number, "calories": number },
      "ingredients": [ { "name": "string", "missing": boolean } ],
      "instructions": [ "string" ],
      "whyThisMatches": [ "string" ]
    }
  ]
}`;

export async function POST(
  request: NextRequest
): Promise<NextResponse<RecipesResponse | { error: string }>> {
  try {
    const body = await request.json();
    const { ingredients, preferences } = body as {
      ingredients?: string[];
      preferences?: RecipePreferences;
    };

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one ingredient.' },
        { status: 400 }
      );
    }

    const prefs = preferences ?? ({} as RecipePreferences);
    const cuisine = prefs.cuisine ?? 'Any';
    const healthFocus = prefs.healthFocus ?? 'Balanced';
    const macrosGoal = prefs.macrosGoal ?? 'Any';
    const dietaryRestrictions = prefs.dietaryRestrictions ?? 'None';
    const timeLimitMinutes = Number(prefs.timeLimitMinutes) || 60;
    const servings = Number(prefs.servings) || 2;
    const equipment = prefs.equipment ?? 'Any';

    if (isDemoMode()) {
      return NextResponse.json({ recipes: DEMO_RECIPES });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `You are a recipe generator. Given these pantry ingredients and preferences, suggest exactly 3 recipes.

Ingredients available: ${ingredients.join(', ')}

Preferences:
- Cuisine: ${cuisine}
- Health focus: ${healthFocus}
- Macros goal: ${macrosGoal}
- Dietary: ${dietaryRestrictions}
- Max time: ${timeLimitMinutes} minutes
- Servings: ${servings}
- Equipment: ${equipment}

Rules:
- Return STRICT JSON only, no markdown or extra text.
- Schema: ${RECIPE_JSON_SCHEMA}
- Each recipe must respect time limit, cuisine (if not Any), dietary (if not None), and equipment where possible.
- Mark ingredients as "missing": true if the user doesn't have them; "missing": false if they're in the pantry list.
- Macros and calories are rough estimates per serving.
- "whyThisMatches" should be 2-4 short bullets explaining how the recipe fits the user's constraints.
- Provide 3 distinct recipes.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0]?.message?.content ?? '{"recipes":[]}';
    let data: { recipes?: Recipe[] };
    try {
      data = JSON.parse(content) as { recipes?: Recipe[] };
    } catch {
      const arrayMatch = content.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        try {
          const arr = JSON.parse(arrayMatch[0]) as Recipe[];
          data = { recipes: arr };
        } catch {
          data = { recipes: [] };
        }
      } else {
        data = { recipes: [] };
      }
    }

    const recipes = Array.isArray(data.recipes) ? data.recipes.slice(0, 3) : [];
    return NextResponse.json({ recipes });
  } catch (err) {
    console.error('Recipes API error:', err);
    const message = err instanceof Error ? err.message : 'Recipe generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
