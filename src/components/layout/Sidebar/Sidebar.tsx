import { PanelLeftClose, PanelLeftOpen, Sparkles, X } from "lucide-react";
import { cn } from "../../ui";
import NavList from "./NavList";
import { mainNavItems } from "./navData";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const handleMobileNavigate = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      aria-label="Sidebar"
      id="primary-sidebar"
      className={cn(
        "app-panel-dark fixed inset-y-3 left-3 z-30 flex h-[calc(100vh-1.5rem)] shrink-0 flex-col gap-6 p-4 transition-all duration-300 lg:sticky lg:top-6 lg:left-auto lg:z-10 lg:h-[calc(100vh-3rem)]",
        isOpen
          ? "w-[18rem] translate-x-0"
          : "-translate-x-[120%] lg:w-24 lg:translate-x-0"
      )}
    >
      <button
        aria-label="Close navigation"
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
        onClick={() => setIsOpen(false)}
        type="button"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        aria-controls="primary-sidebar-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse sidebar navigation" : "Expand sidebar navigation"}
        className={cn(
          "inline-flex min-h-11 items-center rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          isOpen ? "justify-between gap-3" : "justify-center"
        )}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {isOpen ? (
          <>
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent)] text-slate-950">
                <Sparkles aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-base font-semibold">Lattice</span>
                <span className="block text-xs uppercase tracking-[0.22em] text-white/80">
                  Productive OS
                </span>
              </span>
            </span>
            <PanelLeftClose aria-hidden="true" className="h-5 w-5 shrink-0" />
          </>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent)] text-slate-950">
            <PanelLeftOpen aria-hidden="true" className="h-5 w-5 shrink-0" />
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-4">
        {isOpen && (
          <div className="space-y-3 px-2 pt-2">
            <div className="app-pill border-white/10 bg-white/5 text-white/85">
              Daily flow
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Work with clarity</p>
              <p className="mt-1 text-sm leading-6 text-white/80">
                Habits, tasks, and focus sessions in one deliberate workspace.
              </p>
            </div>
          </div>
        )}

        <nav
          aria-label="Primary"
          className="flex-1"
          id="primary-sidebar-navigation"
          role="navigation"
        >
          <NavList
            navItems={mainNavItems}
            isOpen={isOpen}
            onNavigate={handleMobileNavigate}
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
