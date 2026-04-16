import { PanelLeftClose, PanelLeftOpen, Sparkles, X } from "lucide-react";
import NavList from "./NavList";
import { mainNavItems } from "./navData";
import { MOBILE_NAV_BREAKPOINT } from "../../../lib/layoutConstants";
type SidebarProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const handleMobileNavigate = () => {
        if (window.innerWidth < MOBILE_NAV_BREAKPOINT) {
            setIsOpen(false);
        }
    };
    return (<aside aria-label="Sidebar" id="primary-sidebar">
      <button aria-label="Close navigation" onClick={() => setIsOpen(false)} type="button">
        <X aria-hidden="true"/>
      </button>

      <button aria-controls="primary-sidebar-navigation" aria-expanded={isOpen} aria-label={isOpen ? "Collapse sidebar navigation" : "Expand sidebar navigation"} onClick={() => setIsOpen(!isOpen)} type="button">
        {isOpen ? (<>
            <span>
              <span>
                <Sparkles aria-hidden="true"/>
              </span>
              <span>
                <span>Lattice</span>
                <span>
                  Productive OS
                </span>
              </span>
            </span>
            <PanelLeftClose aria-hidden="true"/>
          </>) : (<span>
            <PanelLeftOpen aria-hidden="true"/>
          </span>)}
      </button>

      <div>
        {isOpen && (<div>
            <div>
              Daily flow
            </div>
            <div>
              <p>Work with clarity</p>
              <p>
                Habits, tasks, and focus sessions in one deliberate workspace.
              </p>
            </div>
          </div>)}

        <nav aria-label="Primary" id="primary-sidebar-navigation" role="navigation">
          <NavList navItems={mainNavItems} isOpen={isOpen} onNavigate={handleMobileNavigate}/>
        </nav>
      </div>
    </aside>);
};
export default Sidebar;
