# CLAUDE.md — NexStep Productivity Dashboard

This file gives Claude Code the context it needs to assist effectively on this project.

---

## Project Summary

NexStep is a **100% frontend** productivity dashboard built with React 18 and TypeScript. It has three main features: habit tracking, task management, and a Pomodoro timer. All data is stored client-side (localStorage, with IndexedDB via Dexie being rolled out). There is no backend, no API, and no auth.

The project is undergoing a structured refactoring to reach portfolio and high-tech company hiring standard. The full plan is in `REFACTORING_CHECKLIST.md`. The architecture and feature scope are documented in `PROJECT_OVERVIEW.md`.

---

## Current State

The codebase is mid-refactor. Key things to know:

- Most components are still `.jsx` — **the goal is full `.tsx` migration**
- Type definitions exist in `src/types/` but are not yet wired into components
- `src/pages/`, `src/db/`, `src/hooks/`, `src/lib/`, `src/stores/` are empty placeholder directories
- The three Context providers (`HabitContext`, `TasksContext`, `TimeTrackerContext`) contain both state and business logic — **the goal is to split them into separate custom hooks**
- Routing is in `src/main.tsx` using React Router v6

---

## Tech Stack

- **React 18** with hooks — no class components
- **TypeScript** (strict mode target)
- **Vite 5** as bundler
- **React Router v6** for routing
- **Tailwind CSS v3** as primary styling — use Tailwind utility classes first, avoid inline styles
- **Material UI v5** for complex components (date pickers, etc.)
- **Framer Motion** for animations
- **React Hook Form + Zod** for all forms and validation
- **Recharts** for charts
- **dnd-kit** for drag and drop
- **Dexie** (IndexedDB wrapper) for data persistence
- **Sonner** for toast notifications
- **Howler.js** for timer sounds

---

## How to Run

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm run lint      # ESLint
npm run test      # Vitest (when configured)
```

---

## Folder Structure

```
src/
├── pages/          # Route-level page components
├── components/
│   ├── ui/         # Generic reusable UI primitives
│   ├── layout/     # Sidebar, Container, AppShell
│   ├── habits/     # Habit feature components
│   ├── tasks/      # Task feature components
│   ├── pomodoro/   # Timer feature components
│   ├── dashboard/  # Home page widgets
│   └── reports/    # Analytics widgets
├── context/        # Context providers (thin wrappers around hooks)
├── hooks/          # Custom hooks (business logic lives here)
├── db/             # Dexie database schema and access
├── lib/            # Pure utility functions (no React deps)
├── types/          # Shared TypeScript interfaces and enums
└── assets/         # Static assets
```

**Current state diverges from this structure** — `src/Components/` (capitalized) and `src/ContextAPI/` still exist. When working on a file, move it to the correct new location.

---

## Coding Standards

### TypeScript
- All files must be `.tsx` (components) or `.ts` (utilities, hooks, types)
- No `any` types — type everything explicitly
- Use the interfaces in `src/types/` for all data models
- Enable and respect strict mode

### Components
- One component per file
- Presentational components must not contain business logic
- Business logic belongs in custom hooks in `src/hooks/`
- Context files are thin: they create context, call a hook, and export a provider + consumer hook
- Use `useMemo` for expensive derived values, `useCallback` for handlers passed as props

### Styling
- Tailwind CSS utility classes are the default — write Tailwind first
- Use `clsx` for conditional class names — no string concatenation
- Use Styled Components only when Tailwind alone genuinely can't express the style
- All custom colors are in the Tailwind config under the `colorA`–`colorJ` naming scheme
- Dark mode is implemented via Tailwind `class` strategy

### Forms
- All user input goes through **React Hook Form**
- All schemas are defined with **Zod** in `src/lib/` (e.g., `habitSchema.ts`, `taskSchema.ts`)
- Show inline field-level validation errors — never just alert or console.log

### Accessibility
- Semantic HTML always: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`
- All interactive elements are keyboard-accessible
- All form inputs have associated `<label>` elements
- All icon-only buttons have `aria-label`
- All modals trap focus and return focus to the trigger on close

### Animations
- All Framer Motion animations must respect `prefers-reduced-motion`:
  ```ts
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ```
- Animations are subtle and purposeful — they reinforce UI feedback, not decorate

---

## State Management Rules

- **Local UI state** (`isOpen`, `inputValue`) → `useState` in the component
- **Shared feature state** (habits list, tasks list, timer state) → Context + custom hook
- **Persisted simple state** (theme, timer preference) → `usePersistentState` hook (localStorage)
- **Persisted complex data** (habits, tasks) → Dexie (IndexedDB)
- **No Redux, no Zustand** — this project intentionally uses native React patterns to demonstrate proficiency

---

## Data Models

All data models are in `src/types/`. Use these — do not invent parallel types inline.

- `Habit`, `HabitLog`, `HabitStreak` → `src/types/habit.ts`
- `Task`, `Priority`, `TaskStatus` → `src/types/task.ts`
- `TimerMode`, `TimerState`, `PomodoroSession` → `src/types/pomodoro.ts`
- `DailySummary`, `WeeklySummary` → `src/types/analytics.ts`
- `UserSettings` → `src/types/settings.ts`

---

## Routes

| Path | Page Component | Feature |
|---|---|---|
| `/` | `DashboardPage` | Home dashboard |
| `/habits` | `HabitTrackerPage` | Habit tracking |
| `/tasks` | `ToDoListPage` | Task management |
| `/pomodoro` | `PomodoroPage` | Focus timer |

Route definitions live in `src/main.tsx`.

---

## What to Prioritize When Making Changes

1. Does this move us toward full TypeScript coverage?
2. Does this separate business logic from UI?
3. Is this accessible?
4. Does this use the established patterns (Tailwind, RHF+Zod, Framer Motion)?
5. Does this add or preserve test coverage?

---

## What Not to Do

- Do not add new `.jsx` files — always `.tsx`
- Do not add business logic inside component bodies — put it in a hook
- Do not use `any` as a type escape hatch
- Do not use inline styles (`style={{}}`) when a Tailwind class exists
- Do not hardcode magic numbers — define named constants
- Do not skip accessibility attributes (aria-label, role, etc.)
- Do not add new dependencies without checking if an existing package already covers the need (check package.json — this project already has Framer Motion, Recharts, dnd-kit, Zod, RHF, Dexie, etc.)
- Do not mutate state directly — always use setter functions

---

## Refactoring Progress

See `REFACTORING_CHECKLIST.md` for the full phase-by-phase plan. When completing a checklist item, mark it with `[x]` in that file.
