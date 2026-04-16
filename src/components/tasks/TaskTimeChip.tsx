import { Clock3 } from "lucide-react";

type TaskTimeChipProps = {
  startTime?: string;
  endTime?: string;
};

export default function TaskTimeChip({ startTime, endTime }: TaskTimeChipProps) {
  if (!startTime) return null;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-[#f5f8f9] px-2.5 py-1 text-[0.65rem] text-[#a0a5ab]">
      <Clock3 className="h-3 w-3" />
      <span>
        {startTime}
        {endTime ? ` – ${endTime}` : ""}
      </span>
    </div>
  );
}
