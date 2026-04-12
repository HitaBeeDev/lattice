import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";

type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <div className="shrink-0">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>);

}

export default Container;
