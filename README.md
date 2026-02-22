# PantryAI

A simple MVP web app that lets you upload a photo of your pantry, detect ingredients with AI vision, set recipe preferences, and get three AI-generated recipe suggestions.

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **OpenAI API** for:
  - Vision: ingredient detection from photo
  - Chat: recipe generation from ingredients + preferences

No other paid or third-party APIs are used.

## Setup

1. **Clone and install**

   ```bash
   cd MS2-Workshop4AIPlatform
   npm install
   ```

2. **Environment (optional for demo)**

   - Copy `.env.example` to `.env`.
   - Add your OpenAI API key: `OPENAI_API_KEY=sk-...`
   - If you **omit** `OPENAI_API_KEY` or leave it empty, the app runs in **demo mode**: mocked ingredients and mocked recipes are returned so the UI still works.

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## How it works

1. **Upload** – User uploads a **photo** (required). Video is planned; for now a “coming soon” note is shown.
2. **Detect** – User clicks “Detect ingredients”. The image is sent to `POST /api/detect`, which uses OpenAI vision to list visible food ingredients. Results appear as editable chips.
3. **Edit ingredients** – User can add, remove, or rename ingredients (chips).
4. **Preferences** – User sets cuisine, health focus, macros goal, dietary restrictions, time limit, servings, and equipment.
5. **Generate** – User clicks “Generate recipes”. `POST /api/recipes` is called with ingredients and preferences; OpenAI returns 3 recipes. Each recipe shows title, time, difficulty, macros estimate, ingredients (with “missing” flagged), steps, and “why this matches” bullets.
6. **View recipe** – Clicking a recipe card opens full details in a modal.

## API routes

| Route            | Method | Purpose |
|-----------------|--------|--------|
| `/api/detect`   | POST   | FormData with `photo` (image file). Returns `{ ingredients: [{ name, confidence? }] }`. |
| `/api/recipes`  | POST   | JSON `{ ingredients: string[], preferences: RecipePreferences }`. Returns `{ recipes: Recipe[] }`. |

## Limitations

- **Photo only** – Video upload and frame extraction are not implemented; UI shows “coming soon”.
- **Demo mode** – When `OPENAI_API_KEY` is missing, detect and recipes return fixed mock data.
- **Validation** – Basic only (e.g. non-empty ingredients list before generating recipes).
- **Macros** – Recipe macros and calories are rough estimates; the app does not compute them from real nutrition data.
- **Image size** – Very large images may hit body size limits; keep photos under a few MB.

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run start` – Run production server
- `npm run lint` – Run ESLint
- `npm run test` – Run Jest tests (optional)

## Project structure

```
├── app/
│   ├── api/
│   │   ├── detect/route.ts   # Vision ingredient detection
│   │   └── recipes/route.ts  # Recipe generation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── UploadSection.tsx
│   ├── IngredientChips.tsx
│   ├── PreferencesForm.tsx
│   ├── RecipeCard.tsx
│   └── RecipeDetail.tsx
├── lib/
│   └── types.ts
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```
