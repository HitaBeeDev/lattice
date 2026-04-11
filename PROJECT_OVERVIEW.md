# NexStep Productivity Dashboard — Project Overview

## What Is This Project

NexStep is a **100% frontend productivity dashboard** built with React and TypeScript. It gives users a single place to manage three core workflows: habit tracking, task management, and focus sessions (Pomodoro). All data is persisted locally in the browser — no backend, no accounts, no network dependency.

This project is designed to demonstrate frontend engineering depth: clean architecture, strong TypeScript usage, accessible UI, smooth animations, and production-quality code organization.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript (strict) |
| Bundler | Vite 5 |
| Routing | React Router v6 |
| State | React Context API + `usePersistentState` hook |
| Data Layer | IndexedDB via Dexie, localStorage fallback |
| Server State | TanStack Query v5 |
| Styling | Tailwind CSS v3 (primary), Styled Components (complex cases) |
| Component Library | Material UI v5 |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod validation |
| Charts | Recharts |
| Drag & Drop | dnd-kit |
| Notifications | Sonner (toasts) |
| Audio | Howler.js |
| Date Utils | date-fns, Day.js |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |

---

## Features

### Habit Tracker
- Add, edit, and delete habits
- Mark habits as done/undone for any day of the current week
- Visual week-view grid per habit
- Summary stats: daily completion percentage, best day, best habit
- Motivational quote rotation
- Weekly performance report

### To-Do List
- Add tasks with name, description, date, start/end time, and priority (Low / Medium / High)
- Edit and delete tasks
- Group tasks by date, sorted chronologically
- Filter upcoming incomplete tasks
- Completion toggle per task

### Pomodoro Timer
- Three session modes: Pomodoro (25 min), Short Break (15 min), Long Break (30 min)
- Circular SVG countdown display
- Inline time editing
- Start, Pause, Reset controls
- Educational article rotation (every 15 minutes of focus time)

### Dashboard (Home)
- Time-based greeting
- Stats cards: tasks completed today, total focus time, current habit streak
- Upcoming tasks preview
- Daily habits quick-view

---

## Architecture

```
src/
├── App.tsx                   # Context providers + router outlet
├── main.tsx                  # App entry point + route definitions
│
├── pages/                    # Route-level components (one per route)
│   ├── DashboardPage.tsx
│   ├── HabitTrackerPage.tsx
│   ├── ToDoListPage.tsx
│   └── PomodoroPage.tsx
│
├── components/               # Shared and feature components
│   ├── ui/                   # Generic reusable UI (Button, Modal, Badge…)
│   ├── layout/               # Sidebar, Container, AppShell
│   ├── habits/               # All habit-specific components
│   ├── tasks/                # All task-specific components
│   ├── pomodoro/             # All timer-specific components
│   ├── dashboard/            # Home page widgets
│   └── reports/              # Analytics and report widgets
│
├── context/                  # Global state via Context API
│   ├── HabitContext.tsx
│   ├── TasksContext.tsx
│   └── TimerContext.tsx
│
├── hooks/                    # Custom React hooks
│   ├── usePersistentState.ts
│   ├── useHabits.ts
│   ├── useTasks.ts
│   └── useTimer.ts
│
├── db/                       # IndexedDB schema and access layer (Dexie)
│   └── database.ts
│
├── lib/                      # Pure utility functions (no React deps)
│   ├── dateUtils.ts
│   ├── habitUtils.ts
│   └── taskUtils.ts
│
├── types/                    # Shared TypeScript interfaces and enums
│   ├── habit.ts
│   ├── task.ts
│   ├── pomodoro.ts
│   ├── analytics.ts
│   └── settings.ts
│
└── assets/                   # Static assets (icons, fonts)
```

---

## Routing

| Path | Page | Description |
|---|---|---|
| `/` | Dashboard | Daily overview with widgets |
| `/habits` | HabitTrackerPage | Weekly habit grid |
| `/tasks` | ToDoListPage | Full task manager |
| `/pomodoro` | PomodoroPage | Focus timer |

---

## Data Persistence

All data is stored client-side only:

- **localStorage** — lightweight state via `usePersistentState` hook (habits, tasks)
- **IndexedDB via Dexie** — prepared for richer data queries and offline support
- **No backend, no auth, no network calls**

---

## Design System

The project uses a custom Tailwind palette built around a color system labeled `colorA` through `colorJ` with 3–5 shades each. Dark mode is supported via Tailwind's `class` strategy.

Typography, spacing, border radius, and shadow values are standardized through the Tailwind config. MUI components are styled to match Tailwind tokens where possible.

---

## Code Quality Standards

- All components are `.tsx` (no `.jsx`)
- No `any` types — all data models are fully typed
- Zod schemas validate every user input before it touches state
- React Hook Form handles all form state
- ESLint + Prettier enforced on every file
- Component responsibilities are separated: no business logic in UI components
- Custom hooks expose the interface for each feature; context files just wire them together

---

## Who This Is For

This project is built as a **portfolio piece** targeting frontend engineering roles at product-driven tech companies. The focus is on demonstrating:

- Architecture decisions and trade-offs
- TypeScript fluency
- Clean component design and separation of concerns
- Accessibility and responsive design
- Performance awareness
- Test coverage on core logic
- Code that reads like documentation
