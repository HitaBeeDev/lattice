// NavList component
import { Link } from "react-router-dom";

type NavItem = {
  label: string;
  shortLabel: string;
};

type NavListProps = {
  navItems: NavItem[];
  isOpen: boolean;
};

const NavList = ({ navItems, isOpen }: NavListProps) => {
  return (
    <div>
      <ul>
        {navItems.map((item: NavItem, index: number) =>
        <li



          key={index}>

            <Link
            to={`/${item.label.replace(/\s+/g, "-").toLowerCase()}`}>


              {!isOpen &&
            <span>
                  {item.shortLabel}
                </span>}

              {isOpen &&
            <span>
                  {item.label}
                </span>}

            </Link>
          </li>
        )}
      </ul>
    </div>);

};

export default NavList;
