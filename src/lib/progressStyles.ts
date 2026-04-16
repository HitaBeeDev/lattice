import { cn } from "../components/ui/cn";

const WIDTH_CLASSES = [
  "w-0",
  "w-[5%]",
  "w-[10%]",
  "w-[15%]",
  "w-[20%]",
  "w-[25%]",
  "w-[30%]",
  "w-[35%]",
  "w-[40%]",
  "w-[45%]",
  "w-[50%]",
  "w-[55%]",
  "w-[60%]",
  "w-[65%]",
  "w-[70%]",
  "w-[75%]",
  "w-[80%]",
  "w-[85%]",
  "w-[90%]",
  "w-[95%]",
  "w-full",
] as const;

const HEIGHT_CLASSES = [
  "h-2",
  "h-3",
  "h-4",
  "h-5",
  "h-6",
  "h-7",
  "h-8",
  "h-9",
  "h-10",
  "h-11",
  "h-12",
  "h-14",
  "h-16",
] as const;

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function getPercentageWidthClass(value: number): string {
  const safeValue = clampPercentage(value);
  const index = Math.round(safeValue / 5);
  return WIDTH_CLASSES[index];
}

export function getPercentageFillClass(value: number, className?: string): string {
  return cn(getPercentageWidthClass(value), className);
}

export function getBarHeightClass(value: number, maxValue: number): string {
  const safeRatio = maxValue <= 0 ? 0 : clampPercentage((value / maxValue) * 100);
  const index = Math.round((safeRatio / 100) * (HEIGHT_CLASSES.length - 1));
  return HEIGHT_CLASSES[index];
}
