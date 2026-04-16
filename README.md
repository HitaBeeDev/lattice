# Lattice

Lattice is a portfolio-ready productivity dashboard that brings together daily planning, habit tracking, and pomodoro-based focus sessions in one cohesive React app. Instead of splitting attention across separate tools, the app keeps tasks, routines, and focus metrics connected in a single interface so users can see what needs attention now and how that work compounds across the week.

The project was built to answer a simple product question: what would a lightweight personal operating system feel like if it emphasized calm visual design, fast feedback, and local-first persistence instead of account setup and heavy configuration? The result is a multi-page dashboard with opinionated UX, live productivity summaries, and durable client-side state powered by IndexedDB.

## Live Demo

Live demo: `ADD_DEPLOYMENT_URL_HERE`

Repository: [github.com/HitaBeeDev/NexStep-Productivity-Dashboard](https://github.com/HitaBeeDev/NexStep-Productivity-Dashboard)

## Feature Highlights

### Unified dashboard

- Daily overview for tasks completed, habits checked off, focus minutes, streaks, and pomodoro output.
- Calendar and progress cards that surface the current week at a glance.
- Habit heatmap and focus summaries that turn raw activity into readable trends.

![Dashboard screenshot](docs/screenshots/dashboard.png)

### Task planning and delivery queue

- Create, edit, delete, prioritize, and complete tasks with a modal-based workflow.
- Group tasks by date and surface future unfinished work in a dedicated “Next up” panel.
- Track pending, in-progress, and completed states without leaving the task page.

![Tasks screenshot](docs/screenshots/tasks.png)

### Habit tracking with weekly feedback

- Mark habits across the week and review daily completion percentages.
- See weekly summaries, strongest-day indicators, and motivation/reflection copy.
- Preserve habit history locally so the tracker feels persistent between sessions.

![Habits screenshot](docs/screenshots/habits.png)

### Focus mode / pomodoro timer

- Switch between pomodoro, short break, and long break sessions.
- Persist timer progress across reloads and browser throttling using timestamp-based countdown logic.
- Review today’s focus time, completed pomodoros, and live session progress from one screen.

![Pomodoro screenshot](docs/screenshots/pomodoro.png)

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Dexie + IndexedDB
- Zod
- Vitest + Testing Library
- Sonner

## Local Setup

### Prerequisites

- Node.js 18+ recommended
- npm

### Run locally

```bash
npm install
npm run dev
```

The Vite dev server will print the local URL in the terminal, typically `http://localhost:5173`.

### Other useful scripts

```bash
npm run build
npm run typecheck
npm run test:run
```

## Architecture Overview

Lattice follows a client-side, local-first architecture with a clear split between UI composition, state orchestration, and persistence.

### Application structure

- `src/pages/` contains the top-level route screens: dashboard, habits, tasks, and pomodoro.
- `src/components/` contains page-specific UI plus reusable primitives and layout components.
- `src/hooks/` contains feature logic and derived state for tasks, habits, timer behavior, dashboard aggregation, calendar rendering, and responsive UI helpers.
- `src/context/` wraps the task, habit, and timer hooks in React context so page components can consume a stable feature API.
- `src/db/database.ts` owns Dexie setup, legacy localStorage migration, and mock-data seeding.
- `src/lib/` contains pure utilities, schemas, mock generators, and presentation helpers.

### Data flow

1. `main.tsx` bootstraps the app, router, lazy-loaded routes, and global toast notifications.
2. `App.tsx` mounts the feature providers and runs one-time migration/seeding logic.
3. Feature hooks read and write state through Dexie live queries or localStorage-backed helpers.
4. Context providers expose that feature state to pages and components.
5. Dashboard hooks aggregate task, habit, and timer data into one presentation model for the overview screen.

### Persistence model

- Tasks and habits are stored in IndexedDB through Dexie.
- Timer state and timer analytics are persisted in localStorage for fast resume behavior.
- Legacy localStorage task/habit data is migrated into IndexedDB on startup.
- Mock records are seeded on first load so the portfolio build has meaningful data immediately.

## Known Limitations

- The live demo URL still needs to be inserted into this README.
- Screenshot assets referenced above are placeholders until final PNGs or GIFs are added under `docs/screenshots/`.
- Authentication, sync, and multi-device persistence are intentionally out of scope for this version.
- The app is local-first, so clearing browser storage resets user data.
- Some existing test files currently fail the repo-wide TypeScript check and should be cleaned up before final portfolio handoff.

## Future Work

- Replace placeholder screenshots with polished product captures or short GIF walkthroughs.
- Add optional cloud sync and user accounts.
- Support drag-and-drop task scheduling and richer task filtering.
- Expand habit analytics with historical comparisons and longer-range trends.
- Add notification/reminder support for upcoming tasks and focus sessions.
- Improve test coverage and resolve the current test typing issues.
