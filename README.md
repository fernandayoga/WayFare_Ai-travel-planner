# Wayfare — AI Travel Planner

Fullstack AI travel planner. Describe a trip (destination, dates, travelers,
budget, travel style, interests) and get a day-by-day itinerary with timed
activities, locations, durations, and an estimated cost for each — plus a
budget breakdown you can refine by chatting with an AI assistant.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + hand-built shadcn/ui-style components (Radix primitives)
- **MongoDB** + **Mongoose**
- **Auth.js v5** (Credentials provider, JWT sessions)
- **OpenRouter** for AI itinerary generation, called server-side only
- **Zod** for validating both form input and AI-generated JSON before it's saved

## MVP feature set

- Landing page, register / login / logout
- Protected dashboard + "My Trips"
- Multi-step "Create Trip" flow
- AI-generated day-by-day itinerary (time, activity, location, duration, cost)
- AI-generated budget breakdown by category
- Trip detail page with itinerary timeline + budget tabs
- AI Trip Assistant chat to request changes ("make it more relaxed", "cut the
  budget by 20%") — rewrites the itinerary and budget together
- Edit trip details, delete trip, regenerate itinerary
- Every trip is scoped to its owner; all trip API routes check `userId`

Intentionally **not** included yet (per the brief): maps, weather, hotel/flight
booking, payments. Keep it that way until the MVP above is solid.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | How to get it |
| --- | --- |
| `MONGODB_URI` | Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), add a database user, and copy the connection string (add a database name at the end of the path, e.g. `.../wayfare?retryWrites=true`). |
| `AUTH_SECRET` | Run `npx auth secret` in this folder, or any random 32+ byte string. |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev; your deployed URL in production. |
| `OPENROUTER_API_KEY` | Create a key at [openrouter.ai/keys](https://openrouter.ai/keys). |
| `OPENROUTER_MODEL` | Any OpenRouter model slug that supports JSON output well, e.g. `openai/gpt-4o-mini`, `anthropic/claude-3.5-sonnet`, or `google/gemini-2.0-flash-001`. |

### 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`, register an account, and create your first trip.

### 4. Build for production

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/
    (marketing)/          landing page
    (auth)/login, register
    (app)/dashboard, trips, trips/new, trips/[id]   protected routes
    api/
      auth/                register, Auth.js handler
      trips/                CRUD + AI generation
      trips/[id]/assistant  AI-driven itinerary revision
      trips/[id]/regenerate re-run generation from stored trip params
  components/
    ui/                    Button, Card, Dialog, Select, Tabs, Toast, ...
    layout/                nav bars, logo
    trips/                 timeline, budget chart, assistant chat, forms
  lib/
    ai/                    OpenRouter client, prompts, generation orchestration
    data/                  server-only DB read helpers
    auth.ts / auth.config.ts   Auth.js (see note below on the split)
    validations.ts         Zod schemas (form input + AI output)
    constants.ts           shared enums (travel style, interests, categories)
  models/                  Mongoose schemas (User, Trip)
```

### Why `auth.ts` is split from `auth.config.ts`

`auth.config.ts` holds an Edge-safe config (no database code) used by
`middleware.ts` to protect routes. `auth.ts` extends it with the Credentials
provider, which needs `mongoose`/`bcryptjs` and therefore only runs in the
Node.js runtime (API routes, server components). This avoids bundling
MongoDB's Node-only dependencies into the Edge middleware.

## How AI generation works

1. The create-trip form posts validated input to `POST /api/trips`.
2. The server builds a prompt (`lib/ai/prompts.ts`) describing the trip and
   the exact JSON shape required, and calls OpenRouter (`lib/ai/openrouter.ts`).
3. The response is parsed and validated against a Zod schema
   (`aiItinerarySchema`). If it fails validation, the request is retried once
   with a stricter reminder; if it still fails, the trip is marked `error`
   with a message, and can be retried from the trip page.
4. Only a fully validated itinerary is saved to MongoDB.

The AI Trip Assistant (`POST /api/trips/[id]/assistant`) works the same way:
it sends the current itinerary plus the user's instruction, and validates the
model's revised itinerary before saving it.

**Note on request duration:** generation is synchronous (the request waits
for the AI response, typically 10–30s). If you deploy to a platform with a
short serverless function timeout, either raise the timeout for these routes
or move generation to a background job/queue — this MVP intentionally keeps
it simple and synchronous.

## Security notes

- Passwords are hashed with `bcryptjs` before being stored.
- Sessions are JWT-based via Auth.js; `middleware.ts` redirects unauthenticated
  users away from `/dashboard` and `/trips`.
- Every trip API route re-checks `{ _id, userId }` ownership server-side —
  knowing a trip's id is never enough to read, edit, or delete it.
- `OPENROUTER_API_KEY` is only read on the server (`lib/env.ts`) and never
  sent to the client.
