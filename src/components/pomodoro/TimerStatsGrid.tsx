type TimerStatsGridProps = {
  minutes: number;
  seconds: number;
  completion: number;
};

export default function TimerStatsGrid({ minutes, seconds, completion }: TimerStatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <div className="rounded-[0.95rem] bg-[#f5f8f9] px-3.5 py-2">
        <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">Minutes</p>
        <p className="mt-1 text-[1.18rem] font-[300] leading-none text-[#161c22]">{minutes}</p>
      </div>
      <div className="rounded-[0.95rem] bg-[#f5f8f9] px-3.5 py-2">
        <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">Seconds</p>
        <p className="mt-1 text-[1.18rem] font-[300] leading-none text-[#161c22]">
          {seconds.toString().padStart(2, "0")}
        </p>
      </div>
      <div className="rounded-[0.95rem] bg-[#f5f8f9] px-3.5 py-2">
        <p className="text-[0.62rem] font-[500] uppercase tracking-[0.12em] text-[#a0a6ab]">Remaining</p>
        <p className="mt-1 text-[1.18rem] font-[300] leading-none text-[#161c22]">{completion}%</p>
      </div>
    </div>
  );
}
