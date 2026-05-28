# Meal Planner

A mobile-first React + TypeScript MVP for planning meals by week or month with local browser persistence. It is built for a parent planning meals for a 3-year-old, with a recruiter-friendly demo flow that can be deployed as a static GitHub Pages app.

## Tech Stack

- React + TypeScript
- Vite
- Local storage persistence for portfolio screenshots and demos
- GitHub Pages deployment via static Vite build

## MVP Features

- No-login local planner experience
- Create, edit, delete, favorite, and search meals
- Private meals by default, with public meals searchable by other users
- Week and month calendar views
- Assign meals to breakfast, lunch, dinner, and snack slots
- Mark planned meals as followed or skipped
- Invite calendar members as owner, editor, or viewer
- Light/dark mode, print layout, loading/error-style status messaging, and empty states
- Seed/demo data for screenshots and walkthroughs

## Run Locally

```bash
npm install
npm run dev
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd install
npm.cmd run dev
```

## Data Persistence

The app stores meals, calendars, assignments, and demo profile data in `localStorage`. Data stays on the same device and browser until the user clears site data, resets the demo data, or uses a private browsing session that discards storage.

## GitHub Pages

Build the static app with:

```bash
npm run build
```

The Vite config uses `base: './'`, which works for GitHub Pages project sites.

## Future Improvements

- Add optional cloud sync with Supabase or another backend
- Add generated shopping lists from planned meals
- Add nutrition tracking
- Add multiple child profiles
- Add meal photo uploads via Supabase Storage
- Add achievements for planning and following meals
