import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarNavProps = {
  headerLabel: string;
  onPrevious: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const NAV_BTN_CLASS =
  "flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#6f757b] transition-colors hover:bg-white hover:text-[#161c22]";

export default function CalendarNav({ headerLabel, onPrevious, onNext }: CalendarNavProps) {
  return (
    <div className="flex items-center justify-between flex-none">
      <button type="button" onClick={onPrevious} className={NAV_BTN_CLASS} aria-label="Previous week">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
      </button>
      <p className="text-[0.82rem] font-[500] text-[#161c22]">{headerLabel}</p>
      <button type="button" onClick={onNext} className={NAV_BTN_CLASS} aria-label="Next week">
        <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
      </button>
    </div>
  );
}
