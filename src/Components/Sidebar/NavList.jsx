// NavList component
import { Link } from "react-router-dom";

const NavList = ({ navItems, isOpen }) => {
  return (
    <div>
      <ul>
        {navItems.map((item, index) =>
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
