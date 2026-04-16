import type { KeyboardEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
    if (path === "/dashboard" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, path: string) => {
    if (event.key !== " ") return;
    event.preventDefault();
    navigate(path);
    onNavigate?.();
  };

  return (
    <ul aria-label="Primary navigation links" role="list" className="space-y-1">
      {navItems.map((item) => {
        const isActive = isItemActive(item.path);
        return (
          <li key={item.path}>
            <NavLink
              aria-label={isOpen ? undefined : item.label}
              aria-current={isActive ? "page" : undefined}
              end
              to={item.path}
              onClick={() => onNavigate?.()}
              onKeyDown={(event) => handleKeyDown(event, item.path)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#161c22] text-white"
                  : "text-[#50585e] hover:bg-[#f4f8f9] hover:text-[#161c22]"
              }`}
            >
              <item.icon
                aria-hidden="true"
                className="h-4 w-4 flex-shrink-0"
                strokeWidth={2}
              />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default NavList;
