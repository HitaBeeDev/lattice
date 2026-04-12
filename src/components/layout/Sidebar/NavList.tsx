import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../ui/cn";
import type { NavItem } from "./navData";

type NavListProps = {
  navItems: NavItem[];
  isOpen: boolean;
};

const NavList = ({ navItems, isOpen }: NavListProps) => {
  const location = useLocation();

  const isItemActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }

    return location.pathname === path;
  };

  return (
    <ul aria-label="Primary navigation links" className="space-y-2" role="list">
      {navItems.map((item) => {
        const isActive = isItemActive(item.path);

        return (
          <li key={item.path}>
            <NavLink
              aria-label={isOpen ? undefined : item.label}
              className={() =>
                cn(
                  "flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
                  {
                    "justify-center": !isOpen,
                    "bg-slate-900 text-white shadow-sm": isActive,
                    "hover:bg-slate-100 hover:text-slate-900": !isActive,
                  }
                )
              }
              end
              to={item.path}
            >
              <span aria-hidden={!isOpen}>{isOpen ? item.label : item.shortLabel}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>);
};

export default NavList;
