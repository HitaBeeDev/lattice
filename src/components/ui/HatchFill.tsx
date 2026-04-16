import { cn } from "./cn";
import { getPercentageFillClass, getPercentageWidthClass } from "../../lib/progressStyles";

type HatchFillProps = {
  filledClassName?: string;
  hatchClassName?: string;
  percentage: number;
};

/**
 * Two-layer fill for the hatch-pattern progress look used across cards.
 * Must be placed inside a `relative overflow-hidden` container.
 * Any content that should appear above the fill needs `relative z-10`.
 */
export default function HatchFill({
  filledClassName = "bg-[#72e1ee]",
  hatchClassName = "bg-hatch-accent",
  percentage,
}: HatchFillProps) {
  const safe = Math.min(100, Math.max(0, percentage));
  return (
    <>
      <div
        className={cn("absolute inset-y-0 left-0", getPercentageFillClass(safe), filledClassName)}
      />
      <div
        className={cn("absolute inset-y-0 right-0", getPercentageWidthClass(100 - safe), hatchClassName)}
      />
    </>
  );
}
