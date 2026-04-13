import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";

type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncSidebarState = (event?: MediaQueryListEvent) => {
      setIsOpen(event ? event.matches : mediaQuery.matches);
    };

    syncSidebarState();
    mediaQuery.addEventListener("change", syncSidebarState);

    return () => {
      mediaQuery.removeEventListener("change", syncSidebarState);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900">
      <a className="app-skip-link" href="#main-content">
        Skip to main content
      </a>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.75),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(217,242,71,0.16),_transparent_24%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-4 p-2 pt-16 sm:p-4 sm:pt-20 lg:p-6 lg:pt-6">
        <button
          aria-controls="primary-sidebar"
          aria-expanded={isOpen}
          aria-label="Open navigation"
          className={`fixed right-4 top-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-slate-900 shadow-lg backdrop-blur transition lg:hidden ${
            isOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>

        <div
          aria-hidden={!isOpen}
          className={`fixed inset-0 z-20 bg-slate-950/30 backdrop-blur-sm transition lg:hidden ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div className="shrink-0">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="app-panel relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,242,71,0.12),_transparent_20%),linear-gradient(180deg,_rgba(255,255,255,0.34),_transparent_18%)]"
            />
            <div className="relative min-h-[calc(100vh-1.5rem)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container;
