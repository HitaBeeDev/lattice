import { X } from "lucide-react";
import { cn } from "../../ui/cn";
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

  return (
    <aside
      aria-label="Navigation menu"
      id="primary-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0f5f6] px-5 py-5">
        <div>
          <p className="text-sm font-semibold text-[#161c22]">Lattice</p>
        </div>
        <button
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#a0a5ab] transition hover:bg-[#f4f8f9] hover:text-[#161c22]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Nav links */}
      <nav
        aria-label="Primary"
        id="primary-sidebar-navigation"
        role="navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <NavList
          navItems={mainNavItems}
          isOpen={true}
          onNavigate={handleMobileNavigate}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
