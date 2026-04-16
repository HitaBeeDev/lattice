import MuiTooltip from "@mui/material/Tooltip";
import type { ReactElement, ReactNode } from "react";

type TooltipProps = {
  children: ReactElement;
  content: ReactNode;
};

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <MuiTooltip title={content} arrow>
      {children}
    </MuiTooltip>
  );
}
