import TopNav from "./TopNav";
import { useLocation } from "react-router-dom";

type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <div
      className={
        isDashboardRoute
          ? "flex h-[100dvh] flex-col gap-10 overflow-hidden p-10"
          : "flex min-h-screen flex-col gap-10 p-10"
      }
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        href="#main-content"
      >
        Skip to main content
      </a>
      <TopNav />
      <div className={isDashboardRoute ? "flex-1 min-h-0 overflow-hidden" : ""}>
        {children}
      </div>
    </div>
  );
}

export default Container;
