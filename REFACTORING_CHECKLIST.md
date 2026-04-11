# NexStep — Refactoring Checklist

This checklist tracks every change needed to bring NexStep to portfolio and high-tech company hiring standard. Work through phases in order — each phase builds on the last.

---

## Phase 1 — Foundation & Cleanup

### 1.1 File & Folder Structure
- [ ] Rename `src/Components/` to `src/components/` (lowercase, consistent with convention)
- [ ] Rename `src/ContextAPI/` to `src/context/`
- [ ] Move all page-level components into `src/pages/` (DashboardPage, HabitTrackerPage, ToDoListPage, PomodoroPage)
- [ ] Move shared/generic UI pieces into `src/components/ui/` (Button, Modal, Badge, Input, etc.)
- [ ] Move layout components (Sidebar, Container, AppShell) into `src/components/layout/`
- [ ] Group feature components into `src/components/habits/`, `src/components/tasks/`, `src/components/pomodoro/`, `src/components/dashboard/`
- [ ] Move all utility functions into `src/lib/` (dateUtils.ts, habitUtils.ts, taskUtils.ts)
- [ ] Move all custom hooks into `src/hooks/`
- [ ] Delete empty placeholder directories (db/, stores/) or populate them

### 1.2 TypeScript Migration
- [ ] Convert every `.jsx` file to `.tsx`
- [ ] Enable `strict: true` in tsconfig.json and fix all resulting errors
- [ ] Remove all implicit `any` — type every function parameter, return value, and state variable
- [ ] Wire up the existing type definitions in `src/types/` to the context providers and components
- [ ] Fix data model mismatch: align `HabitContext` runtime shape with the `Habit` interface in `habit.ts`
- [ ] Fix data model mismatch: align `TasksContext` runtime shape with the `Task` interface in `task.ts`
- [ ] Add return type annotations to all Context value objects
- [ ] Type all event handlers (`React.ChangeEvent<HTMLInputElement>`, etc.)
- [ ] Remove `.js` utility files (habitUtils.js, articles.js) and replace with `.ts` equivalents

### 1.3 Linting & Formatting
- [ ] Install and configure Prettier with a `.prettierrc` file
- [ ] Update `.eslintrc.cjs` to include `@typescript-eslint/recommended` rules
- [ ] Add `eslint-plugin-jsx-a11y` for accessibility linting
- [ ] Run ESLint fix across entire codebase and resolve all remaining warnings
- [ ] Add a `lint` and `format` script to `package.json`

---

## Phase 2 — Architecture & State Management

### 2.1 Context API Cleanup
- [ ] Extract business logic out of context files into custom hooks in `src/hooks/`
  - [ ] `useHabits.ts` — all habit CRUD, calculations, and derived state
  - [ ] `useTasks.ts` — all task CRUD, grouping, sorting
  - [ ] `useTimer.ts` — timer lifecycle, session management, article rotation
- [ ] Reduce context files to just: creating the context, wrapping the hook, exporting the provider and consumer hook
- [ ] Memoize context values with `useMemo` to prevent unnecessary re-renders
- [ ] Add `useCallback` to all handler functions passed down through context

### 2.2 Form Validation
- [ ] Integrate **Zod** schemas for every user-facing form
  - [ ] `habitSchema.ts` — validates habit name (min/max length, no duplicates)
  - [ ] `taskSchema.ts` — validates task fields (required name, valid date, end > start time)
  - [ ] `timerSchema.ts` — validates custom timer duration (min 1 min, max 99 min)
- [ ] Replace all manual input validation with React Hook Form + Zod resolvers
- [ ] Show inline field-level error messages on all forms

### 2.3 Data Layer
- [ ] Implement `src/db/database.ts` using Dexie — define tables for habits and tasks
- [ ] Migrate data reads/writes from `localStorage` to IndexedDB for habits and tasks
- [ ] Keep `usePersistentState` for lightweight settings (theme, timer preferences)
- [ ] Add data migration helper that imports existing localStorage data into Dexie on first run

### 2.4 Timer Persistence
- [ ] Persist timer session state in localStorage so it survives page reloads
- [ ] Store session history (completed pomodoros, break counts) for analytics
- [ ] Record daily focus time for the dashboard stats card

---

## Phase 3 — Component Quality

### 3.1 Component Design
- [ ] Break down every component that exceeds ~100 lines into smaller focused pieces
- [ ] Ensure every component has a **single responsibility** — no business logic in UI components
- [ ] Remove all hardcoded values (magic numbers, inline styles) from components — use Tailwind classes or constants
- [ ] Replace any remaining `className` string concatenation with a utility like `clsx`
- [ ] Audit all `useEffect` calls — ensure every one has correct dependencies and cleanup

### 3.2 Shared UI Components (src/components/ui/)
- [ ] `Button.tsx` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg
- [ ] `Modal.tsx` — accessible dialog with focus trap, ESC close, backdrop click close
- [ ] `Input.tsx` — styled text input with error state
- [ ] `Badge.tsx` — priority labels (Low, Medium, High) with color variants
- [ ] `IconButton.tsx` — square icon-only button
- [ ] `Tooltip.tsx` — wrapper around a tooltip primitive
- [ ] `ProgressBar.tsx` — used by habit completion stats
- [ ] `EmptyState.tsx` — shown when lists are empty

### 3.3 Sidebar & Navigation
- [ ] Refactor `NavList.jsx` — remove fragile string-to-kebab-case route generation; use explicit route paths in `navData`
- [ ] Add active link highlighting using `useLocation` + `NavLink` from React Router
- [ ] Make sidebar fully keyboard-navigable
- [ ] Add ARIA roles and labels to sidebar navigation

### 3.4 Homepage Widgets
- [ ] Replace inline SVG icon definitions in `HomePage.jsx` with a proper icon library (e.g., Lucide React or Heroicons)
- [ ] Wire up stats cards to real computed data:
  - [ ] Tasks Completed — count from TasksContext for today
  - [ ] Focus Time — sum from timer session history
  - [ ] Current Streak — calculate from HabitContext
- [ ] Add loading skeleton states to all widgets
- [ ] Make the weekly activity chart functional using Recharts

---

## Phase 4 — Accessibility & UX

### 4.1 Accessibility (a11y)
- [ ] All interactive elements must be keyboard-accessible (focusable, activatable with Enter/Space)
- [ ] All form inputs have associated `<label>` elements (not just placeholder text)
- [ ] All icon-only buttons have `aria-label`
- [ ] Modal dialogs: focus moves into modal on open, returns to trigger on close
- [ ] All images have meaningful `alt` text or `alt=""` for decorative images
- [ ] Color contrast meets WCAG AA for all text (test with axe or similar)
- [ ] Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`, `<header>`) throughout
- [ ] Add skip-to-main-content link for keyboard users

### 4.2 Responsive Design
- [ ] Test and fix all breakpoints: mobile (375px), tablet (768px), desktop (1280px+)
- [ ] Sidebar collapses to a hamburger menu on mobile
- [ ] Habit grid scrolls horizontally on narrow screens without breaking layout
- [ ] Task modal is full-screen on mobile
- [ ] Timer circle scales correctly at all viewport sizes

### 4.3 Animations
- [ ] Ensure all Framer Motion animations respect `prefers-reduced-motion`
- [ ] Add page transition animations between routes
- [ ] Add micro-animations to habit checkboxes (check/uncheck feedback)
- [ ] Add task completion animation (strike-through or fade)
- [ ] Timer circle stroke animation is smooth (no jank at second boundaries)

### 4.4 Error States & Edge Cases
- [ ] Handle localStorage quota exceeded gracefully (catch and show a toast)
- [ ] Show empty state UI when habit list is empty
- [ ] Show empty state UI when task list is empty
- [ ] Prevent adding duplicate habit names (case-insensitive)
- [ ] Prevent adding tasks with end time before start time

---

## Phase 5 — Performance

### 5.1 React Performance
- [ ] Wrap expensive computed values in `useMemo` (habit percentages, grouped tasks)
- [ ] Wrap all context handler callbacks in `useCallback`
- [ ] Audit React DevTools Profiler — find and eliminate unnecessary re-renders
- [ ] Use `React.memo` on pure presentational components that receive stable props

### 5.2 Code Splitting
- [ ] Lazy-load all page-level components with `React.lazy` + `Suspense`
- [ ] Add a loading fallback component for route suspense boundaries

### 5.3 Bundle Optimization
- [ ] Run `vite-bundle-visualizer` and audit bundle size
- [ ] Remove unused packages (any that are installed but genuinely never used)
- [ ] Import only what is used from large libraries (e.g., tree-shake date-fns)
- [ ] Target Lighthouse performance score ≥ 90 on desktop

---

## Phase 6 — Testing

### 6.1 Setup
- [ ] Install and configure **Vitest** with `jsdom` environment
- [ ] Install **React Testing Library** + `@testing-library/user-event`
- [ ] Add `vitest.config.ts` and a `test` script in `package.json`
- [ ] Set up coverage reporting (`c8` or `istanbul`)

### 6.2 Unit Tests (src/lib/ and hooks)
- [ ] `habitUtils.test.ts` — test percentage calculations, best day logic, streak calculation
- [ ] `taskUtils.test.ts` — test grouping, sorting, date comparison helpers
- [ ] `dateUtils.test.ts` — test all date formatting helpers
- [ ] `useTimer.test.ts` — test session transitions, countdown logic
- [ ] `useHabits.test.ts` — test CRUD operations and derived state
- [ ] `useTasks.test.ts` — test CRUD operations and grouped/sorted output

### 6.3 Component Tests
- [ ] `HabitList.test.tsx` — renders habits, toggles completion, edit/delete flow
- [ ] `AddModal.test.tsx` — renders form fields, validates inputs, submits correctly
- [ ] `TimerCircle.test.tsx` — displays correct time, edit mode toggle
- [ ] `TasksWidget.test.tsx` — displays correct upcoming tasks

### 6.4 Coverage Target
- [ ] Achieve ≥ 70% test coverage on `src/lib/` and `src/hooks/`
- [ ] All forms have at least one validation error test and one success test

---

## Phase 7 — Polish & Portfolio Readiness

### 7.1 Theme & Dark Mode
- [ ] Implement theme toggle (light / dark) using Tailwind `class` strategy
- [ ] Persist theme preference to localStorage
- [ ] Respect system `prefers-color-scheme` as default

### 7.2 Code Documentation
- [ ] Add JSDoc comments to every exported function in `src/lib/`
- [ ] Add JSDoc comments to every custom hook in `src/hooks/`
- [ ] Add brief comment blocks to complex logic (timer countdown, habit percentage algorithm)

### 7.3 README
- [ ] Write a compelling README with:
  - [ ] Project description and motivation
  - [ ] Live demo link
  - [ ] Feature list with screenshots or GIFs
  - [ ] Tech stack section
  - [ ] Local setup instructions (`npm install`, `npm run dev`)
  - [ ] Architecture overview section
  - [ ] Known limitations / future work section

### 7.4 Final Audit
- [ ] Run `npx tsc --noEmit` — zero TypeScript errors
- [ ] Run `npm run lint` — zero ESLint warnings
- [ ] Run `npm run test` — all tests pass
- [ ] Run Lighthouse audit — Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90
- [ ] Manual keyboard-only navigation walkthrough — all features reachable
- [ ] Test in Chrome, Firefox, and Safari

---

## Tracking Progress

| Phase | Status |
|---|---|
| Phase 1 — Foundation & Cleanup | Not started |
| Phase 2 — Architecture & State | Not started |
| Phase 3 — Component Quality | Not started |
| Phase 4 — Accessibility & UX | Not started |
| Phase 5 — Performance | Not started |
| Phase 6 — Testing | Not started |
| Phase 7 — Polish & Portfolio Readiness | Not started |
