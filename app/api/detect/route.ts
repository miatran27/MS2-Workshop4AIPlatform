import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { DetectedIngredient, DetectResponse } from '@/lib/types';
import { parseIngredientsFromModel } from '@/lib/parseIngredients';

const DEMO_INGREDIENTS: DetectedIngredient[] = [
  { name: 'tomatoes', confidence: 0.95 },
  { name: 'onions', confidence: 0.9 },
  { name: 'garlic', confidence: 0.88 },
  { name: 'olive oil', confidence: 0.85 },
  { name: 'pasta', confidence: 0.92 },
];

function isDemoMode(): boolean {
  return !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '';
}

export async function POST(request: NextRequest): Promise<NextResponse<DetectResponse | { error: string }>> {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') ?? formData.get('image');
    // Optional: multiple images for video frames (future)
    const images = formData.getAll('images') as File[];

    // Prefer single photo, then first of images
    let file: File | null = photo instanceof File ? photo : null;
    if (!file && images.length > 0 && images[0] instanceof File) file = images[0];

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Missing or empty photo. Please upload an image.' },
        { status: 400 }
      );
    }

    // Demo mode: return mock ingredients
    if (isDemoMode()) {
      return NextResponse.json({ ingredients: DEMO_INGREDIENTS });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mime = file.type || 'image/jpeg';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are analyzing a photo of food or pantry ingredients. List ONLY visible food ingredients. Rules:
- No brand names.
- Be specific (e.g. "cherry tomatoes" not just "tomatoes" if visible).
- Return a strict JSON array. Each element is either a string (ingredient name) or an object with "name" (string) and "confidence" (number 0-1).
- Example: ["onion","garlic",{"name":"olive oil","confidence":0.9}]
Return only the JSON array, no other text.`,
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mime};base64,${base64}` },
            },
          ],
        },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? '[]';
    const ingredients = parseIngredientsFromModel(content);

    return NextResponse.json({ ingredients });
  } catch (err) {
    console.error('Detect API error:', err);
    const message = err instanceof Error ? err.message : 'Ingredient detection failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
