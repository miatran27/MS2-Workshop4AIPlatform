// Shared types for PantryAI

export interface DetectedIngredient {
  name: string;
  confidence?: number;
}

export type Cuisine = 'Asian' | 'Italian' | 'Mexican' | 'Any';
export type HealthFocus = 'Healthy' | 'Balanced' | 'Indulgent';
export type MacrosGoal = 'High Protein' | 'High Carbs' | 'Low Carb' | 'Any';
export type DietaryRestriction = 'Vegetarian' | 'Vegan' | 'Gluten-free' | 'None';
export type Equipment = 'One pan' | 'Oven' | 'Air fryer' | 'Any';

export interface RecipePreferences {
  cuisine: Cuisine;
  healthFocus: HealthFocus;
  macrosGoal: MacrosGoal;
  dietaryRestrictions: DietaryRestriction;
  timeLimitMinutes: number;
  servings: number;
  equipment: Equipment;
}

export interface RecipeIngredient {
  name: string;
  missing: boolean;
}

export interface MacrosEstimate {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface Recipe {
  title: string;
  timeEstimateMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  macrosEstimate: MacrosEstimate;
  ingredients: RecipeIngredient[];
  instructions: string[];
  whyThisMatches: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
}

export interface DetectResponse {
  ingredients: DetectedIngredient[];
}
