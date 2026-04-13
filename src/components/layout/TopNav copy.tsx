import { Bell, Settings, Sparkles, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Habits", path: "/habit-tracker" },
  { label: "Tasks", path: "/tasks" },
  { label: "Pomodoro", path: "/pomodoro" },
];

export default function TopNav() {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname === path;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-2 lg:px-8">
      <nav
        aria-label="Primary"
        className="flex items-center gap-2 px-5 py-3 app-panel"
      >
        {/* Logo */}
        <span className="mr-4 flex items-center gap-1.5 rounded-full bg-[#0a1929] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          <Sparkles aria-hidden="true" className="w-3 h-3" />
          Lattice
        </span>

        {/* Nav links */}
        <ul
          className="flex items-center flex-1 gap-1 p-0 m-0 list-none"
          role="list"
        >
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                end
                to={item.path}
                className={() =>
                  isActive(item.path)
                    ? "rounded-full bg-[#0a1929] px-4 py-1.5 text-sm font-semibold text-white no-underline block"
                    : "rounded-full px-4 py-1.5 text-sm font-medium text-app-muted hover:text-app-text transition-colors no-underline block"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            aria-label="Settings"
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-app-muted hover:bg-white/60 hover:text-app-text"
            type="button"
          >
            <Settings aria-hidden="true" className="w-4 h-4" />
          </button>
          <button
            aria-label="Notifications"
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-app-muted hover:bg-white/60 hover:text-app-text"
            type="button"
          >
            <Bell aria-hidden="true" className="w-4 h-4" />
          </button>
          <button
            aria-label="User profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1929] text-white"
            type="button"
          >
            <User aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}
