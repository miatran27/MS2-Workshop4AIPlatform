'use client';

import { useState, useCallback } from 'react';
import type { DetectedIngredient } from '@/lib/types';

interface IngredientChipsProps {
  ingredients: DetectedIngredient[];
  onChange: (ingredients: DetectedIngredient[]) => void;
  showConfidence?: boolean;
  disabled?: boolean;
}

export function IngredientChips({
  ingredients,
  onChange,
  showConfidence = true,
  disabled = false,
}: IngredientChipsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  const updateIngredient = useCallback(
    (index: number, updates: Partial<DetectedIngredient>) => {
      const next = [...ingredients];
      next[index] = { ...next[index], ...updates };
      onChange(next);
    },
    [ingredients, onChange]
  );

  const removeIngredient = useCallback(
    (index: number) => {
      onChange(ingredients.filter((_, i) => i !== index));
    },
    [ingredients, onChange]
  );

  const startEdit = (index: number) => {
    if (disabled) return;
    setEditingId(`ing-${index}`);
    setEditValue(ingredients[index].name);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    const index = parseInt(editingId.replace('ing-', ''), 10);
    const name = editValue.trim();
    if (name) updateIngredient(index, { name });
    setEditingId(null);
    setEditValue('');
  };

  const addIngredient = () => {
    const name = newIngredient.trim();
    if (!name) return;
    onChange([...ingredients, { name, confidence: undefined }]);
    setNewIngredient('');
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-stone-800">2. Detected ingredients</h2>
      <p className="mb-4 text-sm text-stone-500">
        Edit, remove, or add ingredients. Then set your preferences and generate recipes.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {ingredients.map((ing, index) => (
          <span
            key={`${ing.name}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-sm text-emerald-900"
          >
            {editingId === `ing-${index}` ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  onBlur={saveEdit}
                  autoFocus
                  className="w-28 rounded border border-emerald-300 bg-white px-2 py-0.5 text-sm"
                />
                <button type="button" onClick={saveEdit} className="text-emerald-700 hover:underline">
                  Save
                </button>
              </>
            ) : (
              <>
                <span onClick={() => startEdit(index)} className="cursor-pointer" title="Click to rename">
                  {ing.name}
                </span>
                {showConfidence && ing.confidence != null && (
                  <span className="text-xs text-stone-500">({Math.round(ing.confidence * 100)}%)</span>
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="ml-1 rounded-full p-0.5 text-stone-500 hover:bg-emerald-200 hover:text-stone-800"
                    aria-label={`Remove ${ing.name}`}
                  >
                    ×
                  </button>
                )}
              </>
            )}
          </span>
        ))}
      </div>

      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
            placeholder="Add ingredient..."
            className="rounded border border-stone-300 px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={addIngredient}
            className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Add
          </button>
        </div>
      )}

      {ingredients.length === 0 && (
        <p className="text-sm text-stone-500">No ingredients yet. Upload a photo to detect, or add manually above.</p>
      )}
    </section>
  );
}
