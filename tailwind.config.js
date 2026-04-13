/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ─── Design tokens wired to CSS variables ────────────────────────────────
      colors: {
        app: {
          bg:           "var(--app-bg)",
          surface:      "var(--app-surface)",
          "surface-strong": "var(--app-surface-strong)",
          border:       "var(--app-border)",
          text:         "var(--app-text)",
          muted:        "var(--app-muted)",
          faint:        "var(--app-faint)",
          accent:       "var(--app-accent)",
          "accent-deep":  "var(--app-accent-deep)",
          "accent-soft":  "var(--app-accent-soft)",
          dark:         "var(--app-dark)",
          "dark-surface": "var(--app-dark-surface)",
          "dark-border":  "var(--app-dark-border)",
          "dark-text":    "var(--app-dark-text)",
          "dark-muted":   "var(--app-dark-muted)",
        },
      },

      // ─── Border radius ladder (section 6 of DESIGN_SYSTEM.md) ───────────────
      borderRadius: {
        panel:  "2rem",    // 32px — major panels, sidebar
        card:   "1.5rem",  // 24px — nested cards inside panels
        btn:    "0.875rem", // 14px — buttons
        input:  "0.75rem", // 12px — form inputs
      },

      // ─── Shadows ────────────────────────────────────────────────────────────
      boxShadow: {
        sm:   "var(--app-shadow-sm)",
        DEFAULT: "var(--app-shadow)",
        lift: "var(--app-shadow-lift)",
      },

      // ─── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['"Inter"', '"Avenir Next"', '"Segoe UI"', "sans-serif"],
        heading: ['"Sora"', '"Inter"', '"Avenir Next"', '"Segoe UI"', "sans-serif"],
      },

      // ─── Letter spacing ─────────────────────────────────────────────────────
      letterSpacing: {
        label: "0.28em",   // card labels — 10px uppercase tracking
        pill:  "0.22em",   // pill/badge uppercase tracking
        tight: "-0.04em",  // section headings
        tighter: "-0.06em", // hero stat numbers
      },

      // ─── Sidebar widths (used in layout components) ──────────────────────────
      width: {
        sidebar:         "4.5rem",   // 72px — collapsed
        "sidebar-open":  "17.5rem",  // 280px — expanded
      },

      // ─── Animation durations ────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: "150ms",
        medium:  "250ms",
        page:    "300ms",
      },

      // ─── Grid column shorthand for bento layout ──────────────────────────────
      gridTemplateColumns: {
        // Dashboard row 4 (tasks / habits)
        "dash-mid": "minmax(0, 1.2fr) minmax(0, 0.8fr)",
        // Dashboard row 5 (chart / focus strip)
        "dash-bot": "minmax(0, 1.35fr) minmax(18rem, 0.75fr)",
      },
    },
  },
  plugins: [],
};
