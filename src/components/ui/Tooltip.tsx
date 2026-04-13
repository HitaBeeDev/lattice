import type { ReactNode } from "react";
type TooltipProps = {
    children: ReactNode;
    content: ReactNode;
};
export default function Tooltip({ children, content }: TooltipProps) {
    return (<span>
      {children}
      <span role="tooltip">
        {content}
      </span>
    </span>);
}
