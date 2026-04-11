import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";

function Container({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>


        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div>


        {children}
      </div>
    </div>);

}

export default Container;
