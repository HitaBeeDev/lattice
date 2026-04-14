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
    <header>
      <nav
        aria-label="Primary"
        className="flex flex-row items-center justify-between"
      >
        {/* Logo */}
        <div>
          <p className="font-heading text-[#242c32] text-[1.1rem] font-[500] tracking-wider">
            Lattice
          </p>
        </div>

        {/* Nav links */}
        <ul
          className="flex flex-row items-center bg-white gap-6 rounded-[5rem] h-[2.7rem] pt-[0.25rem] 
          pb-[0.25rem] pl-[0.25rem] pr-[0.25rem]"
          role="list"
        >
          {navItems.map((item) => (
            <li
              className="text-[0.9rem] font-[400] w-full h-full flex items-center rounded-[5rem]"
              key={item.path}
            >
              <NavLink
                end
                to={item.path}
                className={() =>
                  `text-[0.9rem] font-[400] w-full h-full flex items-center rounded-[5rem] pl-[1rem] pr-[1rem] ${
                    isActive(item.path)
                      ? "bg-[#242c32] text-white"
                      : "text-[#50585e]"
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
