'use client';

import type { Recipe } from '@/lib/types';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  const { title, timeEstimateMinutes, difficulty, macrosEstimate, ingredients, instructions, whyThisMatches } = recipe;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-6 px-6 py-4">
          <div className="flex flex-wrap gap-2 text-sm text-stone-600">
            <span>{timeEstimateMinutes} min</span>
            <span>·</span>
            <span>{difficulty}</span>
            <span>·</span>
            <span>P: {macrosEstimate.protein}g C: {macrosEstimate.carbs}g F: {macrosEstimate.fat}g</span>
            <span>·</span>
            <span>{macrosEstimate.calories} cal (est. per serving)</span>
          </div>

          {whyThisMatches.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-stone-700">Why this matches</h3>
              <ul className="list-inside list-disc text-sm text-stone-600">
                {whyThisMatches.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold text-stone-700">Ingredients</h3>
            <ul className="space-y-1 text-sm text-stone-700">
              {ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.name}
                  {ing.missing && <span className="ml-2 text-amber-600">(you may need to buy)</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-stone-700">Instructions</h3>
            <ol className="list-decimal space-y-2 pl-4 text-sm text-stone-700">
              {instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-stone-500">
            Macros and calories are estimates. Always check labels and adjust for your portions.
          </p>
        </div>
      </div>
    </div>
  );
}
