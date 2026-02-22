import type { DetectedIngredient } from './types';

/**
 * Parse messy vision model output into DetectedIngredient[].
 * Handles: raw string array, array of {name, confidence}, or mixed.
 */
export function parseIngredientsFromModel(content: string): DetectedIngredient[] {
  const trimmed = content.trim();
  let jsonStr = trimmed;
  const codeMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) jsonStr = codeMatch[1].trim();
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (arrayMatch) jsonStr = arrayMatch[0];

  try {
    const parsed = JSON.parse(jsonStr) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === 'string') return { name: item.trim(), confidence: undefined };
        if (item && typeof item === 'object' && 'name' in item) {
          const name = String((item as { name: unknown }).name).trim();
          const conf = (item as { confidence?: number }).confidence;
          return { name, confidence: typeof conf === 'number' ? conf : undefined };
        }
        return { name: String(item).trim(), confidence: undefined };
      })
      .filter((x) => x.name.length > 0);
  } catch {
    const lines = trimmed
      .split(/[\n,]/)
      .map((s) => s.replace(/^[\s"\[\]-]+|[\s"\]]+$/g, '').trim())
      .filter(Boolean);
    return lines.map((name) => ({ name, confidence: undefined }));
  }
}
