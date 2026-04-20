# Lattice — Design System

Single source of truth for every visual decision in Lattice. All components, layouts, and tokens trace back here.

---

## 1. Design Personality

Lattice is a calm, focused productivity workspace — warm and airy in content zones, dark and dramatic in hero/sidebar zones.

| Quality | Expression |
|---|---|
| Warm neutral base | Soft teal-to-white gradient background, warm white cards |
| Dark focus zones | Near-black sidebar and hero panels with teal accent |
| Bento layout | Intentional grid — cards of varied weight that fit together |
| Typographic hierarchy | Labels whispered (10px muted), numbers shouted (3xl+) |

---

## 2. Color System

### CSS Variables (defined in `src/index.css`)

```css
:root {
  /* Backgrounds */
  --app-bg:              #E9E8E2;
  --app-surface:         rgba(255, 252, 244, 0.88);
  --app-surface-strong:  #FFFDF7;

  /* Borders & Shadows */
  --app-border:          rgba(28, 30, 32, 0.09);
  --app-shadow-sm:       0 4px 16px rgba(28, 30, 32, 0.08);
  --app-shadow:          0 24px 80px rgba(28, 30, 32, 0.12);
  --app-shadow-lift:     0 32px 96px rgba(28, 30, 32, 0.18);

  /* Text */
  --app-text:            #171A1D;
  --app-muted:           #5E666F;
  --app-faint:           #9AA3AC;

  /* Accent */
  --app-accent:          #D9F247;    /* lime yellow — charts and habit dots only */
  --app-accent-deep:     #1D2118;
  --app-accent-soft:     rgba(217, 242, 71, 0.18);

  /* Dark zone — sidebar and hero panels */
  --app-dark:            #111318;
  --app-dark-surface:    #1A1C22;
  --app-dark-border:     rgba(255, 255, 255, 0.09);
  --app-dark-text:       rgba(255, 255, 255, 0.92);
  --app-dark-muted:      rgba(255, 255, 255, 0.50);
}
```

### App Background

The page background is a full-screen gradient (defined in `App.tsx`):
```
linear-gradient(135deg, #eef1f1 0%, #edf4f4 38%, #def3f6 72%, #8ee4f2 100%)
```

### UI Accent — Teal (`#72e1ee`)

The interactive UI accent (buttons, inputs, progress bars) is teal, not lime. Lime (`--app-accent`) is reserved for data visualization (chart bars, habit dots, pomodoro ring).

| Token | Hex | Use |
|---|---|---|
| Teal accent | `#72e1ee` | Secondary buttons, input focus ring, progress fill |
| Dark charcoal | `#161c22` | Primary buttons, active nav |
| Lime | `#D9F247` | Today's chart bar, habit done dots, timer ring |

### Semantic State Colors

| Intent | Value |
|---|---|
| Priority High | `#F87171` / badge bg `#fde8e8` text `#c0392b` |
| Priority Medium | `#FBBF24` / badge bg `#fef3e2` text `#b96a00` |
| Priority Low | `#4ADE80` / badge bg `#e6f7f8` text `#1a7a85` |
| Error / Danger | `#ef7373` border, `#d94a4a` text |
| Success | `#22C55E` |
| Input error border | `#ef7373` |

---

## 3. Typography

### Fonts

| Role | Stack |
|---|---|
| Body | `Inter, Avenir Next, Segoe UI, sans-serif` |
| Headings | `Sora, Inter, Avenir Next, Segoe UI, sans-serif` |

### Scale

| Role | Tailwind classes | Notes |
|---|---|---|
| Page title | `text-3xl font-bold tracking-[-0.04em]` | Once per page |
| Section heading | `text-xl font-semibold tracking-[-0.03em]` | Card titles |
| Stat number — hero | `text-5xl font-bold tracking-[-0.06em]` | Inside dark panel |
| Stat number — card | `text-[2.2rem]–text-[3.8rem] font-[200]` | Dashboard stat cards |
| Card label | `text-[10px] uppercase tracking-[0.28em] font-[500]` | Always `--app-muted` color |
| Body / list items | `text-sm` or `text-base` | Never below 13px |
| Metadata / timestamps | `text-xs text-[var(--app-muted)]` | |
| Chart axis labels | `text-[11px] text-[var(--app-faint)]` | |

### Label → Number Pattern

Every stat card uses this two-line rhythm:
```
LABEL TEXT      ← 10px uppercase, muted, wide letter-spacing
42              ← 2.2rem–3.8rem, light weight (font-[200]), tight tracking
unit / context  ← sm, muted
```

---

## 4. Spacing & Layout

**Base unit:** 4px. All values are multiples of Tailwind's default scale.

### Page containers

| Breakpoint | Padding |
|---|---|
| Mobile | `px-5 pb-6 pt-24` |
| SM | `sm:px-6` |
| LG | `lg:px-8` |

### Rhythm

| Context | Value |
|---|---|
| Between major sections | `space-y-6` / `gap-6` (24px) |
| Between cards in a section | `gap-4` (16px) |
| Inside a card | `p-6` padding, `space-y-4` between elements |
| Sidebar widths | collapsed `4.5rem` (72px) / expanded `17.5rem` (280px) |

### Dashboard Grid

```
Row 1: [greeting header]                     — full width
Row 2: [dark hero panel]                     — full width
Row 3: [3 equal stat cards]                  — grid-cols-3 (sm+)
Row 4: [tasks 1.2fr | habits 0.8fr]          — grid-cols-[dash-mid]
Row 5: [activity chart 1.35fr | focus 0.75fr] — grid-cols-[dash-bot]
```

Custom grid tokens (in `tailwind.config.js`):
- `dash-mid`: `1.2fr 0.8fr`
- `dash-bot`: `1.35fr 0.75fr`

---

## 5. Panel & Card System

### `.app-panel` — Warm frosted glass (light cards)

```css
background: linear-gradient(180deg, rgba(255,253,247,0.92), rgba(248,244,235,0.88));
border: 1px solid var(--app-border);
border-radius: 2rem;
box-shadow: var(--app-shadow);
backdrop-filter: blur(20px);
```

### `.app-panel-dark` — Dark with lime glow (hero zones)

```css
background:
  radial-gradient(circle at top, rgba(217,242,71,0.18), transparent 34%),
  linear-gradient(180deg, #171819 0%, #101112 100%);
border: 1px solid rgba(255,255,255,0.09);
border-radius: 2rem;
box-shadow: 0 24px 80px rgba(0,0,0,0.28);
```

### Nested cards (inside panels)

Never nest `.app-panel` inside `.app-panel`. Nested cards always use:
```
rounded-[1.5rem]
bg-white/55
border border-black/5
p-4
```

---

## 6. Border Radius Ladder

Radius decreases as element size decreases. Outer wrapper is always the most rounded.

| Element | Value |
|---|---|
| Major panels | `rounded-[2rem]` (32px) |
| Cards within panels | `rounded-[1.5rem]` (24px) |
| Dashboard cards | `rounded-[1.7rem]` (27px) |
| Dashboard mini-cards / pills | `rounded-[1.2rem]` (19px) |
| Buttons | `rounded-full` |
| Inputs | `rounded-full` |
| Badges / chips | `rounded-full` |
| Chart bar tops | `radius={[8,8,0,0]}` (Recharts) |

---

## 7. Component Specs

### Button (`src/components/ui/Button.tsx`)

| Variant | Background | Text | Hover |
|---|---|---|---|
| `primary` | `#161c22` | white | `#0f1419` |
| `secondary` | `#72e1ee` | white | `#5fd0de` |
| `ghost` | `white/72` + white/80 border | `#1b2830` | `white/90` |
| `danger` | `#f26d6d` | white | `#e05f5f` |

Sizes:

| Size | Classes |
|---|---|
| `sm` | `h-10 px-4 text-sm` |
| `md` | `h-11 px-5 text-sm` (default) |
| `lg` | `h-12 px-6 text-base` |

All buttons: `rounded-full inline-flex items-center gap-2 active:scale-95 transition-all duration-150`

### Input (`src/components/ui/Input.tsx`)

```
rounded-full border px-4 py-3 bg-white/90
border: #d8e4e8
focus border: #72e1ee + ring-4 ring-[#72e1ee]/20
error border: #ef7373
```

### Badge (`src/components/ui/Badge.tsx`)

```
rounded-full px-2.5 py-0.5 text-xs font-medium
```

Variants match priority colors in section 2.

### Modal (`src/components/ui/Modal.tsx`)

```
dialog:     rounded-t-[1.5rem] sm:rounded-[1.5rem]
shadow:     0 24px 60px rgba(0,0,0,0.12)
backdrop:   bg-black/25 backdrop-blur-sm
header:     px-6 py-5 border-b border-[#f0f5f6]
body:       px-6 py-5 space-y-4
```

### ProgressBar (`src/components/ui/ProgressBar.tsx`)

```
label:  text-xs font-semibold uppercase tracking-[0.16em] text-[#7d929c]
track:  h-3 rounded-full bg-[#dbe8eb]
fill:   bg-[#72e1ee] rounded-full
```

### Skeleton (`src/components/ui/Skeleton.tsx`)

```
animate-pulse rounded-[1rem] bg-[#dbe8eb]
```

Always use a skeleton whose shape matches the real content. Never show a raw spinner for local data.

### EmptyState (`src/components/ui/EmptyState.tsx`)

```
rounded-[1.75rem] border border-white/70 bg-white/60 p-8
shadow: 0 18px 55px rgba(80,111,122,0.08)
```

Every empty state must have: icon + heading + CTA. No raw "No data" text.

---

## 8. Sidebar

### Structure

```
[Logo / brand mark]        ← top
[Primary nav — 4 items]    ← flex-1
  Dashboard  /
  Habits     /habit-tracker
  Tasks      /tasks
  Pomodoro   /pomodoro
[Bottom utility]            ← optional theme toggle
```

### States

| State | Width | Content |
|---|---|---|
| Collapsed | `4.5rem` (72px) | Icon only, tooltip on hover |
| Expanded | `17.5rem` (280px) | Icon + label |

### Active nav item

Use a filled pill — **not** a left border or underline:
```
bg-[#161c22] text-white rounded-[5rem]
```

Inactive item hover: `hover:bg-white/8`

---

## 9. Charts & Data Visualization

All charts use Recharts.

### Bar chart

```
Today's bar:  fill="var(--app-accent)"     (#D9F247)
Other bars:   fill="rgba(23,26,29,0.75)"
Bar radius:   radius={[8,8,0,0]}
Grid:         stroke="#f1f5f9" strokeDasharray="3 3"
Axes:         axisLine={false} tickLine={false}
Label color:  #9AA3AC
Tooltip:      rounded-[1.25rem] warm white background
```

### Gradient bars (aspirational)

```jsx
<defs>
  <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stopColor="#D9F247" stopOpacity={0.9} />
    <stop offset="100%" stopColor="#D9F247" stopOpacity={0.15} />
  </linearGradient>
</defs>
<Bar fill="url(#accentGradient)" />
```

### Ring / circular progress

```
Track:    stroke="rgba(255,255,255,0.12)"  (dark bg) or rgba(0,0,0,0.07) (light bg)
Progress: stroke="#72e1ee"  (UI rings) or stroke="var(--app-accent)" (pomodoro)
Cap:      strokeLinecap="round"
```

### Habit dot sparkline

```
Done today:  bg-slate-950  (black — marks current day)
Done:        bg-[var(--app-accent)]
Empty:       bg-slate-200
Size:        h-2.5 w-2.5 rounded-full
```

---

## 10. Animation

All Framer Motion animations must check reduced motion:

```ts
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const variants = prefersReduced ? {} : { ... };
```

### Standard durations

| Animation | Duration | Easing |
|---|---|---|
| Page entry | 180ms | `ease-out` |
| Modal open | 200ms | `ease-out` |
| Modal close | 150ms | `ease-in` |
| Card hover | 200ms | `ease-out` |
| Sidebar expand | 250ms | `ease-out` |
| Checkbox check | 200ms | spring stiffness 400 |
| Task strike-through | 300ms | `ease-out` |

### Standard variants

```ts
// Page entry
{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.18 } }

// Card hover lift
{ whileHover: { y: -2, boxShadow: 'var(--app-shadow-lift)' } }

// Modal
{ initial: { opacity: 0, scale: 0.96, y: 8 }, animate: { opacity: 1, scale: 1, y: 0 } }
```

---

## 11. Pattern Utilities

Defined in `src/index.css`:

| Class | Effect |
|---|---|
| `.bg-hatch` | White diagonal stripes (135°, 2px solid 8px transparent) |
| `.bg-hatch-teal` | Teal (`rgba(114,225,238,0.45)`) diagonal stripes |
| `.bg-hatch-accent` | Light blue (`#aceef5`) diagonal stripes |

---

## 12. Rules — What Not to Do

- Do not use `rounded-lg` or `rounded-xl` on major panels — follow the radius ladder.
- Do not use `--app-accent` (lime) for buttons or interactive UI — that's teal (`#72e1ee`).
- Do not use lime in more than one place per visible viewport.
- Do not use white as the page background — the gradient provides depth.
- Do not use a left border as the active nav indicator — use a filled pill.
- Do not add decorative text gradients.
- Do not scatter teal and lime together — they compete.
- Do not nest `.app-panel` inside `.app-panel`.
- Do not show a spinner for local/cached data — use a skeleton that matches the layout.
- Do not mix border radii arbitrarily — always follow the ladder in section 6.
