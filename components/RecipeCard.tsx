'use client';

import type { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onSelect: () => void;
}

export function RecipeCard({ recipe, index, onSelect }: RecipeCardProps) {
  const { title, timeEstimateMinutes, difficulty, macrosEstimate } = recipe;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-600">
          Recipe {index + 1}
        </span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
          {difficulty}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-stone-800">{title}</h3>
      <p className="mb-3 text-sm text-stone-500">
        {timeEstimateMinutes} min · P: {macrosEstimate.protein}g C: {macrosEstimate.carbs}g F: {macrosEstimate.fat}g · {macrosEstimate.calories} cal
      </p>
      <p className="text-sm text-emerald-700">Click for full recipe →</p>
    </button>
  );
}
