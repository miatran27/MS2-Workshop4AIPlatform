'use client';

import { useState, useCallback } from 'react';
import { UploadSection } from '@/components/UploadSection';
import { IngredientChips } from '@/components/IngredientChips';
import { PreferencesForm } from '@/components/PreferencesForm';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetail } from '@/components/RecipeDetail';
import type { DetectedIngredient, Recipe, RecipePreferences } from '@/lib/types';

const DEFAULT_PREFS: RecipePreferences = {
  cuisine: 'Any',
  healthFocus: 'Balanced',
  macrosGoal: 'Any',
  dietaryRestrictions: 'None',
  timeLimitMinutes: 45,
  servings: 2,
  equipment: 'Any',
};

export default function Home() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<DetectedIngredient[]>([]);
  const [preferences, setPreferences] = useState<RecipePreferences>(DEFAULT_PREFS);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [detectError, setDetectError] = useState<string | null>(null);
  const [detectLoading, setDetectLoading] = useState(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [recipesLoading, setRecipesLoading] = useState(false);

  const handlePhotoSelect = useCallback((file: File) => {
    setPhoto(file);
    setDetectError(null);
  }, []);

  const handlePhotoClear = useCallback(() => {
    setPhoto(null);
    setIngredients([]);
    setDetectError(null);
  }, []);

  const runDetect = useCallback(async () => {
    if (!photo) {
      setDetectError('Please upload a photo first.');
      return;
    }
    setDetectLoading(true);
    setDetectError(null);
    try {
      const form = new FormData();
      form.append('photo', photo);
      const res = await fetch('/api/detect', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setDetectError(data.error || 'Detection failed');
        return;
      }
      setIngredients(data.ingredients ?? []);
    } catch (e) {
      setDetectError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setDetectLoading(false);
    }
  }, [photo]);

  const handleGenerateRecipes = useCallback(async () => {
    const names = ingredients.map((i) => i.name).filter(Boolean);
    if (names.length === 0) {
      setRecipesError('Add at least one ingredient before generating recipes.');
      return;
    }
    setRecipesLoading(true);
    setRecipesError(null);
    setRecipes([]);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: names, preferences }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRecipesError(data.error || 'Recipe generation failed');
        return;
      }
      setRecipes(data.recipes ?? []);
    } catch (e) {
      setRecipesError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setRecipesLoading(false);
    }
  }, [ingredients, preferences]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-stone-900">PantryAI</h1>
        <p className="mt-2 text-stone-600">
          Snap your pantry, set preferences, get recipe ideas.
        </p>
      </header>

      <div className="space-y-6">
        <UploadSection
          onPhotoSelect={handlePhotoSelect}
          onPhotoClear={handlePhotoClear}
          selectedPhoto={photo}
          isDetecting={detectLoading}
          error={detectError}
        />

        {photo && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={runDetect}
              disabled={detectLoading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {detectLoading ? 'Detecting…' : 'Detect ingredients'}
            </button>
          </div>
        )}

        <IngredientChips
          ingredients={ingredients}
          onChange={setIngredients}
          showConfidence={true}
          disabled={detectLoading}
        />

        <PreferencesForm
          preferences={preferences}
          onChange={setPreferences}
          disabled={recipesLoading}
        />

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleGenerateRecipes}
            disabled={recipesLoading || ingredients.length === 0}
            className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {recipesLoading ? 'Generating recipes…' : 'Generate recipes'}
          </button>
          {recipesError && (
            <p className="text-sm text-red-600" role="alert">
              {recipesError}
            </p>
          )}
        </div>

        {recipes.length > 0 && (
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-800">Your recipe suggestions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe, i) => (
                <RecipeCard
                  key={i}
                  recipe={recipe}
                  index={i}
                  onSelect={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </main>
  );
}
