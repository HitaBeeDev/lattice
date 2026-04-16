import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Habits", path: "/habit-tracker" },
  { label: "Tasks", path: "/tasks" },
  { label: "Pomodoro", path: "/pomodoro" },
];

type TopNavProps = {
  onMenuOpen: () => void;
};

export default function TopNav({ onMenuOpen }: TopNavProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname === path;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-6 lg:px-8">
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-[2rem]
         bg-[rgba(248,252,252,0.05)] px-5 py-3 shadow-[0_18px_55px_rgba(70,95,110,0.12)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#242c32] hover:bg-white/60 transition lg:hidden"
            onClick={onMenuOpen}
            type="button"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <NavLink
            to="/"
            className="font-heading cursor-pointer text-[1.1rem] font-[600] tracking-[0.08em] text-[#242c32] transition-colors duration-200 hover:text-[#50585e]"
            aria-label="Go to home page"
          >
            Lattice
          </NavLink>
        </div>

        {/* Desktop nav pill — hidden on mobile */}
        <ul
          className="hidden lg:flex flex-row items-center gap-2 rounded-[5rem] bg-white/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          role="list"
        >
          {navItems.map((item) => (
            <li
              className="flex h-full w-full items-center rounded-[5rem] text-[0.9rem] font-[400]"
              key={item.path}
            >
              <NavLink
                end
                to={item.path}
                className={() =>
                  `flex h-full w-full items-center rounded-[5rem] px-5 py-2 text-[0.95rem] transition-colors ${
                    isActive(item.path)
                      ? "bg-[#242c32] text-white shadow-[0_10px_20px_rgba(36,44,50,0.18)]"
                      : "text-[#50585e] hover:text-[#242c32]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
