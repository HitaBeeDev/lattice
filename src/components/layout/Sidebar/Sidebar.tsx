import NavList from "./NavList";
import { mainNavItems } from "./navData";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
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
