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
    return (<ul aria-label="Primary navigation links" role="list">
      {navItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (<li key={item.path}>
            <NavLink aria-label={isOpen ? undefined : item.label} end onClick={() => onNavigate?.()} onKeyDown={(event) => handleKeyDown(event, item.path)} to={item.path}>
              <item.icon aria-hidden="true" strokeWidth={2}/>
              {isOpen && (<div>
                  <span>{item.label}</span>
                  {isActive && (<span>
                      Now
                    </span>)}
                </div>)}
            </NavLink>
          </li>);
        })}
    </ul>);
};
export default NavList;
