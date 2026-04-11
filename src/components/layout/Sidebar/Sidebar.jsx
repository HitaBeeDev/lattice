import NavList from "./NavList";
import { mainNavItems } from "./navData";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div>






      <button



        onClick={() => setIsOpen(!isOpen)}>

        {isOpen ? "Close" : "Menu"}
      </button>

      <div>
        {isOpen &&
        <h1>
            N e x S t e p
          </h1>}


        <nav>
          <NavList navItems={mainNavItems} isOpen={isOpen} />
        </nav>
      </div>
    </div>);

};

export default Sidebar;
