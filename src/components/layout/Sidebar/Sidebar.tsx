import NavList from "./NavList";
import { mainNavItems } from "./navData";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <aside
      aria-label="Sidebar"
      className="flex h-full flex-col gap-4 border-r border-slate-200 bg-white p-4"
    >
      <button
        aria-controls="primary-sidebar-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse sidebar navigation" : "Expand sidebar navigation"}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      <div className="flex flex-1 flex-col gap-4">
        {isOpen &&
          <h1 className="px-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-900">
            N e x S t e p
          </h1>}

        <nav
          aria-label="Primary"
          className="flex-1"
          id="primary-sidebar-navigation"
          role="navigation"
        >
          <NavList navItems={mainNavItems} isOpen={isOpen} />
        </nav>
      </div>
    </aside>);
};

export default Sidebar;
