import { useState } from "react";
import { useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar/Sidebar";

type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isDashboardRoute =
    location.pathname === "/" || location.pathname === "/dashboard";
  const isPomodoroRoute = location.pathname === "/pomodoro";

  return (
    <div
      className={
        isPomodoroRoute
          ? "flex h-screen flex-col overflow-hidden px-5 pb-4 pt-22 sm:px-6 lg:px-8"
          : isDashboardRoute
            ? "flex min-h-screen flex-col px-5 pb-6 pt-24 sm:px-6 lg:px-8"
            : "flex min-h-screen flex-col px-5 pb-8 pt-24 sm:px-6 lg:px-8"
      }
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        href="#main-content"
      >
        Skip to main content
      </a>

      <TopNav onMenuOpen={() => setIsMobileNavOpen(true)} />

      {/* Mobile nav backdrop */}
      {isMobileNavOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <Sidebar isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />

      <div
        className={
          isDashboardRoute || isPomodoroRoute
            ? "flex min-h-0 flex-1 overflow-hidden"
            : "flex-1"
        }
      >
        {children}
      </div>
    </div>
  );
}

export default Container;
