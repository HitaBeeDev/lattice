# Lattice — Design System

This document is the single source of truth for every visual decision in Lattice. Every component, page layout, and CSS token must trace back to a rule here.

---

## 1. Design Personality

Lattice sits at the intersection of two reference aesthetics:

| Aesthetic | Source | What we borrow |
|---|---|---|
| Warm neutral productivity | Be.run, Crextio, Intelly | Cream/off-white backgrounds, generous whitespace, readable stat hierarchy |
| Dark neon focus | Dark Tasks Overview dashboard | Near-black panel with lime glow for dramatic hero zones |
| Clean bento | Lattice workspace, Crextio | Intentional grid — cards of varied size fitting together like puzzle pieces |

**One-sentence brief:** A warm, calm workspace in the light; a focused, high-contrast cockpit in the dark zones.

---

## 2. Color System

### CSS Variables (defined in `index.css`)

```css
:root {
  /* Backgrounds */
  --app-bg:              #E9E8E2;   /* page background — warm neutral */
  --app-surface:         rgba(255, 252, 244, 0.88);  /* card / panel fill */
  --app-surface-strong:  #FFFDF7;   /* card hover / focus state */

  /* Borders & Shadows */
  --app-border:          rgba(28, 30, 32, 0.09);
  --app-shadow-sm:       0 4px 16px rgba(28, 30, 32, 0.08);
  --app-shadow:          0 24px 80px rgba(28, 30, 32, 0.12);
  --app-shadow-lift:     0 32px 96px rgba(28, 30, 32, 0.18);  /* hover state */

  /* Text */
  --app-text:            #171A1D;   /* primary text — near black */
  --app-muted:           #5E666F;   /* secondary / metadata text */
  --app-faint:           #9AA3AC;   /* placeholder, axis labels */

  /* Accent — ONE accent color for the whole app */
  --app-accent:          #D9F247;   /* lime yellow — the signature color */
  --app-accent-deep:     #1D2118;   /* text on top of accent */
  --app-accent-soft:     rgba(217, 242, 71, 0.18);  /* glow / tint */

  /* Dark zone — used for sidebar and hero panels */
  --app-dark:            #111318;
  --app-dark-surface:    #1A1C22;   /* cards inside dark panels */
  --app-dark-border:     rgba(255, 255, 255, 0.09);
  --app-dark-text:       rgba(255, 255, 255, 0.92);
  --app-dark-muted:      rgba(255, 255, 255, 0.50);
}
```

### Usage Rules

| Token | Where it goes | Never use for |
|---|---|---|
| `--app-accent` (#D9F247) | ONE key element per page (primary CTA, today's stat chip, active nav dot, timer circle stroke) | Background of large sections, text color on white |
| `--app-bg` | Page-level background only | Card backgrounds |
| `--app-surface` | All card/panel fills | Sidebar background |
| `--app-dark` | Sidebar, hero stat panel, dark cards | Entire page background (not dark mode) |
| `--app-muted` | Metadata, timestamps, axis labels | Headings |

### Semantic Color Map (non-accent UI states)

| Intent | Light mode | Dark mode |
|---|---|---|
| Priority High | `#F87171` (rose-400) | `#F87171` |
| Priority Medium | `#FBBF24` (amber-400) | `#FBBF24` |
| Priority Low | `#4ADE80` (green-400) | `#4ADE80` |
| Danger / Destructive | `#EF4444` | `#EF4444` |
| Success | `#22C55E` | `#22C55E` |
| Habit done | `--app-accent` | `--app-accent` |
| Task complete | `#94A3B8` (slate-400, dimmed) | `rgba(255,255,255,0.35)` |

---

## 3. Typography

**Font:** Space Grotesk — geometric, modern, warm. Already loaded.

### Scale

| Role | Class | Notes |
|---|---|---|
| Page title | `text-3xl font-bold tracking-[-0.04em]` | Only once per page |
| Section heading | `text-xl font-semibold tracking-[-0.03em]` | Card titles |
| Stat number (hero) | `text-5xl font-bold tracking-[-0.06em]` | Inside dark hero panel |
| Stat number (card) | `text-3xl font-semibold tracking-[-0.04em]` | Regular stat cards |
| Card label (above number) | `text-[10px] uppercase tracking-[0.28em] font-semibold` | Always muted color |
| Body / list items | `text-sm` or `text-base` | Never smaller than 13px |
| Metadata / timestamps | `text-xs text-[var(--app-muted)]` | |
| Axis labels on charts | `text-[11px] text-[var(--app-faint)]` | |

### Rule: Label → Number Pattern

Every stat card uses the same two-line rhythm:

```
LABEL TEXT         ← 10px uppercase, muted, letter-spaced
42                 ← 3xl-5xl bold, tight tracking, primary text
unit / context     ← sm, muted
```

This is visible in every reference: Crextio's "78 / Employee", Be.run's "8,500 / Goal", Intelly's "14 pers / 5 pers / 2 pers".

---

## 4. Spacing & Layout

### Base unit: 4px

All padding, margin, and gap values must be multiples of 4. Tailwind's default scale already enforces this.

### Page layout

```
[Sidebar: 72px collapsed / 280px expanded] + [Main content: flex-1]
```

Main content padding:
- Mobile: `p-4` (16px)
- Tablet: `p-6` (24px)
- Desktop: `p-8` (32px)

Vertical rhythm between sections:
- Between major sections: `space-y-6` or `gap-6` (24px)
- Between cards within a section: `gap-4` (16px)
- Inside a card: `p-6` padding, `space-y-4` between elements

### Grid rules per page

**Dashboard:**
```
Row 1: [greeting header] — full width
Row 2: [dark hero panel] — full width, 2-col inside: circle + [3 chips + 3 actions]
Row 3: [3 equal stat cards] — sm:grid-cols-3
Row 4: [tasks list 1.2fr] | [habits check-in 0.8fr] — xl:grid-cols-2
Row 5: [activity chart 1.35fr] | [focus strip 0.75fr] — xl:grid-cols-2
```

**Habit Tracker:**
```
Row 1: [header + add button] — full width
Row 2: [summary bar: progress + chips] — full width
Row 3: [habit grid] — full width, scroll-x on mobile
Row 4: [weekly report chart — collapsible] — full width
```

**Tasks:**
```
Row 1: [header + add button] — full width
Row 2: [4 filter tabs with counts] — full width
Row 3: [task list, grouped by date] — full width, max-w-3xl centered on wide screens
```

**Pomodoro:**
```
Row 1: [3 session mode tabs] — centered, max-w-md
Row 2: [timer circle] — centered, dominant, max 320px diameter
Row 3: [controls] — centered
Row 4: [session dots row] — centered
Row 5: 2-col — [article card] | [today stats mini-panel]
```

---

## 5. Panel & Card System

### The three panel variants

#### `.app-panel` — warm frosted glass (light cards)
```css
background: linear-gradient(180deg, rgba(255, 253, 247, 0.92), rgba(248, 244, 235, 0.88));
border: 1px solid var(--app-border);
box-shadow: var(--app-shadow);
border-radius: 2rem;  /* 32px */
backdrop-filter: blur(20px);
```
Use for: all regular content cards.

#### `.app-panel-dark` — dark with lime glow (hero zones)
```css
background:
  radial-gradient(circle at top, rgba(217, 242, 71, 0.18), transparent 34%),
  linear-gradient(180deg, #171819 0%, #101112 100%);
border: 1px solid rgba(255, 255, 255, 0.09);
box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
border-radius: 2rem;
```
Use for: sidebar, dashboard hero stats panel, pomodoro timer card.

#### `.app-panel-accent` — lime as background (ONE per page max)
```css
background: var(--app-accent);
border-radius: 2rem;
color: var(--app-accent-deep);
```
Use for: primary CTA button area or the single "today's most important number" card.

### Nesting depth

Cards can be nested ONE level deep inside panels:

```
.app-panel         ← outer container (p-6)
  └── inner card   ← rounded-[1.5rem] bg-white/55 border border-black/5 p-4
```

Never nest an `.app-panel` inside another `.app-panel`. The nested card always uses these exact values:
```
rounded-[1.5rem]   (24px)
bg-white/55
border border-black/5
```

---

## 6. Border Radius Ladder

| Context | Value | Notes |
|---|---|---|
| Major panels | `rounded-[2rem]` (32px) | `.app-panel`, `.app-panel-dark`, sidebar |
| Cards within panels | `rounded-[1.5rem]` (24px) | Nested content cards |
| Buttons | `rounded-[0.875rem]` (14px) | Standard button shape |
| Small chips / badges | `rounded-full` | Pill shape |
| Inputs | `rounded-xl` (12px) | Form fields |
| Chart bar tops | `radius={[8, 8, 0, 0]}` in Recharts | Matches visual rounding |

Rule: **radius decreases as element size decreases.** The outer wrapper is always the most rounded.

---

## 7. Sidebar Design

### Structure (desktop)

```
[Logo / Brand mark]          ← top
  icon mark + "Lattice" text in expanded mode
  icon mark only in collapsed mode

[Primary nav — 5 items]      ← flex-1
  Dashboard (/)
  Habits (/habit-tracker)
  Tasks (/tasks)
  Pomodoro (/pomodoro)

[Bottom utility]             ← bottom (optional: theme toggle)
```

### Collapsed state (72px wide)

- Icon only, centered in each nav item
- No labels, no text
- Tooltip on hover (via `Tooltip` component)
- Logo = accent-colored icon mark only
- Expand toggle = icon button

### Expanded state (280px wide)

- Icon + label in each nav item
- Logo = icon mark + "Lattice" wordmark + subtitle pill (optional — keep it minimal)
- Active nav item: solid accent-colored background, dark text icon
- Inactive nav item: transparent, muted text, hover = `bg-white/8`

### Nav item anatomy

```
[icon 20px]  [label text-sm font-medium]   ← expanded
[icon 20px]                                ← collapsed
```

Active state — do NOT use a left border or underline. Use a filled pill background:
```
rounded-[1.2rem] bg-[var(--app-accent)] text-[var(--app-accent-deep)]
```

---

## 8. Charts & Data Visualization

All charts use Recharts. These rules make them look like the reference dashboards.

### Bar chart (weekly activity, focus strip)

- **Today's bar:** `fill="var(--app-accent)"` (lime)
- **Other bars:** `fill="rgba(23, 26, 29, 0.75)"` (near black)
- **Bar radius:** `radius={[8, 8, 0, 0]}`
- **Grid:** very subtle — `stroke="#f1f5f9" strokeDasharray="3 3"`
- **No axis lines:** `axisLine={false} tickLine={false}`
- **Axis label color:** `#9AA3AC` (faint)
- **Tooltip:** floating card with `rounded-[1.25rem]` and warm white background

### Gradient bars (aspirational — for phase 8 upgrade)

For the dramatic look in the dark productivity dashboard reference, use `linearGradient` SVG defs inside Recharts:
```jsx
<defs>
  <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#D9F247" stopOpacity={0.9} />
    <stop offset="100%" stopColor="#D9F247" stopOpacity={0.15} />
  </linearGradient>
</defs>
<Bar fill="url(#accentGradient)" ... />
```

### Ring / circular progress

- Track ring: `stroke="rgba(255,255,255,0.12)"` (on dark bg) or `stroke="rgba(0,0,0,0.07)"` (on light bg)
- Progress ring: `stroke="var(--app-accent)"`
- `strokeLinecap="round"` always
- Text inside: label on top (10px muted), value middle (bold), sublabel below (sm muted)

### Dot sparkline (habit week view)

- Done dot: `bg-[var(--app-accent)]`
- Today's done dot: `bg-slate-950` (black, to mark "this one is today")
- Empty dot: `bg-slate-200`
- Size: `h-2.5 w-2.5 rounded-full`

---

## 9. Forms & Interactive States

### Input fields

```
rounded-xl border border-[var(--app-border)] bg-white/70
focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)]
placeholder:text-[var(--app-faint)]
```

### Buttons

| Variant | Class pattern |
|---|---|
| Primary | `bg-[var(--app-accent)] text-[var(--app-accent-deep)] hover:brightness-105 rounded-[0.875rem]` |
| Secondary | `bg-white/55 border border-[var(--app-border)] text-[var(--app-text)] hover:bg-white rounded-[0.875rem]` |
| Ghost (light bg) | `hover:bg-black/5 text-[var(--app-muted)] rounded-[0.875rem]` |
| Ghost (dark bg) | `hover:bg-white/8 text-white/80 rounded-[0.875rem]` |
| Danger | `bg-red-500 text-white hover:bg-red-600 rounded-[0.875rem]` |

All buttons: `active:scale-95 transition-all duration-150`

### Priority badges

```
High:   bg-rose-50    text-rose-600   border-rose-200
Medium: bg-amber-50   text-amber-600  border-amber-200
Low:    bg-emerald-50 text-emerald-600 border-emerald-200
```
Always include the text label — never color only.

---

## 10. Animation

All Framer Motion animations must pass this check first:
```ts
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const variants = prefersReduced ? {} : { ... };
```

### Standard durations

| Animation | Duration | Easing |
|---|---|---|
| Modal open | 200ms | `ease-out` |
| Modal close | 150ms | `ease-in` |
| Page transition | 300ms | `easeInOut` |
| Card hover lift | 200ms | `ease-out` |
| Checkbox check | 200ms | spring (stiffness 400) |
| Task strike-through | 300ms | `ease-out` |
| Sidebar expand | 250ms | `ease-out` |

### Standard variants

```ts
// Page entry
{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

// Card hover
{ whileHover: { y: -2, boxShadow: 'var(--app-shadow-lift)' } }

// Modal
{ initial: { opacity: 0, scale: 0.96, y: 8 }, animate: { opacity: 1, scale: 1, y: 0 } }
```

---

## 11. What Makes the References Feel Premium — Checklist

These are the specific things that make the reference UIs feel different from a standard dashboard:

- [ ] **Big numbers breathe** — stat numbers have `mt-3` below the label, not `mt-1`. They need vertical space above and below.
- [ ] **Labels are whispered, numbers shout** — card labels are tiny (10px), numbers are large (3xl+). The contrast is intentional.
- [ ] **One card does ONE thing** — each card has a single primary data point. Never put two equal-weight stats side by side inside one card without hierarchy.
- [ ] **Charts are embedded, not full-width** — the weekly bar chart in references fits inside a card, not as a full-width section.
- [ ] **The sidebar never competes** — sidebar is dark and quiet. The content area has all the color and life.
- [ ] **The page background is not white** — it's warm neutral (#E9E8E2 or similar). This makes white cards pop.
- [ ] **Rounded corners are aggressive** — 32px on major panels, 24px on nested cards. This gives the "app-within-an-app" feel.
- [ ] **Accent appears exactly once per viewport** — in the dark hero panel (lime chip) and in the sidebar active state. Not in 5 places.
- [ ] **Touch targets are generous** — nav items are min 48px tall, interactive cards feel pressable.
- [ ] **Empty states are not blank** — every empty state has a designed icon, a heading, and a CTA. No raw "No data" text.

---

## 12. Things Not to Do

- Do not use `border-radius: 8px` on major panels — it reads as a generic Bootstrap card.
- Do not scatter the accent color everywhere — it loses meaning.
- Do not use white as the page background — it flattens the card depth.
- Do not use a left border as the "active" indicator for nav items — use a filled background.
- Do not add decorative gradients to text — it's a trend, but it distracts from readability.
- Do not use flat gray bars in charts — add the lime accent to today's bar to give context.
- Do not mix border radii arbitrarily — follow the radius ladder in section 6.
- Do not show a spinner for local data loads — use a skeleton that matches the exact layout shape.
