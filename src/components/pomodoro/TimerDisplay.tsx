const SESSION_DESCRIPTIONS: Record<string, string> = {
  Pomodoro: "Deep work block",
  ShortBreak: "Reset your attention",
  LongBreak: "Step away and recover",
};

type TimerDisplayProps = {
  sessionType: string;
  minutes: number;
  seconds: number;
  radius: number;
  circumference: number;
  strokeDashoffset: number;
};

export default function TimerDisplay({
  sessionType,
  minutes,
  seconds,
  radius,
  circumference,
  strokeDashoffset,
}: TimerDisplayProps) {
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return (
    <div className="relative mx-auto mt-3 flex aspect-square w-full max-w-[18rem] items-center justify-center md:max-w-[24rem]">
      <svg
        aria-label={`${sessionType} timer showing ${minutes} minutes and ${seconds} seconds remaining`}
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full -rotate-90"
      >
        <circle stroke="#d7dfe2" cx="100" cy="100" r={radius + 10} strokeWidth="0.8" strokeDasharray="3 5" fill="transparent" />
        <circle stroke="#e5ecee" cx="100" cy="100" r={radius} strokeWidth="14" fill="transparent" />
        <circle stroke="#72e1ee" cx="100" cy="100" r={radius} strokeWidth="14" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" transform="rotate(-90 100 100)" />
      </svg>
      <div className="relative z-10 text-center">
        <p className="text-[0.72rem] font-[400] uppercase tracking-[0.18em] text-[#95a0a7]">{sessionType}</p>
        <p className="mt-2.5 text-[2.35rem] font-[200] leading-none tracking-[-0.06em] text-[#161c22] md:text-[3rem]">{timeLabel}</p>
        <p className="mt-1.5 text-[0.72rem] font-[300] text-[#7b858c]">
          {SESSION_DESCRIPTIONS[sessionType] ?? "Stay with the current session"}
        </p>
      </div>
    </div>
  );
}
