'use client';

import type {
  Cuisine,
  HealthFocus,
  MacrosGoal,
  DietaryRestriction,
  Equipment,
  RecipePreferences,
} from '@/lib/types';

interface PreferencesFormProps {
  preferences: RecipePreferences;
  onChange: (prefs: RecipePreferences) => void;
  disabled?: boolean;
}

const CUISINES: Cuisine[] = ['Asian', 'Italian', 'Mexican', 'Any'];
const HEALTH_FOCUSES: HealthFocus[] = ['Healthy', 'Balanced', 'Indulgent'];
const MACROS: MacrosGoal[] = ['High Protein', 'High Carbs', 'Low Carb', 'Any'];
const DIETARY: DietaryRestriction[] = ['Vegetarian', 'Vegan', 'Gluten-free', 'None'];
const EQUIPMENT: Equipment[] = ['One pan', 'Oven', 'Air fryer', 'Any'];

export function PreferencesForm({
  preferences,
  onChange,
  disabled = false,
}: PreferencesFormProps) {
  const update = (patch: Partial<RecipePreferences>) => {
    onChange({ ...preferences, ...patch });
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-stone-800">3. Recipe preferences</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Cuisine</label>
          <select
            value={preferences.cuisine}
            onChange={(e) => update({ cuisine: e.target.value as Cuisine })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Health focus</label>
          <select
            value={preferences.healthFocus}
            onChange={(e) => update({ healthFocus: e.target.value as HealthFocus })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {HEALTH_FOCUSES.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Macros goal</label>
          <select
            value={preferences.macrosGoal}
            onChange={(e) => update({ macrosGoal: e.target.value as MacrosGoal })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {MACROS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Dietary restrictions</label>
          <select
            value={preferences.dietaryRestrictions}
            onChange={(e) => update({ dietaryRestrictions: e.target.value as DietaryRestriction })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {DIETARY.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Time limit (minutes)
          </label>
          <input
            type="number"
            min={5}
            max={240}
            value={preferences.timeLimitMinutes}
            onChange={(e) => update({ timeLimitMinutes: Number(e.target.value) || 30 })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Servings</label>
          <input
            type="number"
            min={1}
            max={20}
            value={preferences.servings}
            onChange={(e) => update({ servings: Number(e.target.value) || 2 })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-stone-700">Equipment</label>
          <select
            value={preferences.equipment}
            onChange={(e) => update({ equipment: e.target.value as Equipment })}
            disabled={disabled}
            className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {EQUIPMENT.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
