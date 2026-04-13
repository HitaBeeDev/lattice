import type { KeyboardEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../ui";
import type { NavItem } from "./navData";

type NavListProps = {
  navItems: NavItem[];
  isOpen: boolean;
  onNavigate?: () => void;
};

const NavList = ({ navItems, isOpen, onNavigate }: NavListProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }

    return location.pathname === path;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, path: string) => {
    if (event.key !== " ") {
      return;
    }

    event.preventDefault();
    navigate(path);
    onNavigate?.();
  };

  return (
    <ul aria-label="Primary navigation links" className="space-y-2.5" role="list">
      {navItems.map((item) => {
        const isActive = isItemActive(item.path);

        return (
          <li key={item.path}>
            <NavLink
              aria-label={isOpen ? undefined : item.label}
              className={() =>
                cn(
                  "group flex items-center rounded-[1.35rem] px-4 py-3 text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  {
                    "gap-3": isOpen,
                    "justify-center": !isOpen,
                    "bg-[var(--app-accent)] text-slate-950 shadow-[0_18px_30px_rgba(217,242,71,0.28)]": isActive,
                    "text-white/85 hover:bg-white/8 hover:text-white": !isActive,
                  }
                )
              }
              end
              onClick={() => onNavigate?.()}
              onKeyDown={(event) => handleKeyDown(event, item.path)}
              to={item.path}
            >
              <item.icon
                aria-hidden="true"
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  isActive ? "" : "group-hover:scale-105"
                )}
                strokeWidth={2}
              />
              {isOpen && (
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="rounded-full bg-slate-950/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                      Now
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default NavList;
