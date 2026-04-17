import HatchFill from "../ui/HatchFill";

const formatFocusHours = (seconds: number): string => {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

type PomodoroSidebarProps = {
  todayLabel: string;
  todayFocusSeconds: number;
  completedPomodoros: number;
  progressPct: number;
};

export default function PomodoroSidebar({
  todayLabel,
  todayFocusSeconds,
  completedPomodoros,
  progressPct,
}: PomodoroSidebarProps) {
  return (
    <div className="flex flex-col justify-between rounded-[1.7rem] bg-white p-6 md:p-8 xl:col-span-1">
      <div>
        <p className="text-[0.7rem] leading-none font-[300] text-[#a0a5ab] ml-1 mt-3">{todayLabel}</p>
        <p className="mt-7 max-w-[14ch] text-[2.8rem] leading-[0.92] font-[200] tracking-[-0.05em] text-[#161c22] md:max-w-[10ch] md:text-[4rem]">
          Hold the line on your focus.
        </p>
        <p className="mt-3 max-w-[30rem] text-[0.74rem] leading-5 font-[300] text-[#a0a6ab]">
          Stay in one view, run the timer, and keep today&apos;s output visible without scrolling
          away from the session.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-1">
        <div className="w-full rounded-[1rem] bg-[#edfdfe] p-5">
          <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">Today&apos;s focus</p>
          <p className="mt-3 text-[2rem] font-[200] leading-none text-[#161c22]">
            {formatFocusHours(todayFocusSeconds)}
          </p>
        </div>
        <div className="w-full rounded-[1rem] bg-[#161c22] p-5">
          <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#d3d6d9]">Pomodoros</p>
          <p className="mt-3 text-[2rem] font-[200] leading-none text-white">{completedPomodoros}</p>
        </div>
        <div className="relative w-full overflow-hidden rounded-[1rem] p-5">
          <div className="absolute inset-0 bg-[#edfdfe]" />
          <HatchFill percentage={progressPct} hatchClassName="bg-hatch-teal" />
          <p className="relative z-10 text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#6c90a4]">Session progress</p>
          <p className="relative z-10 mt-3 text-[2rem] font-[200] leading-none text-[#161c22]">{progressPct}%</p>
        </div>
      </div>
    </div>
  );
}
