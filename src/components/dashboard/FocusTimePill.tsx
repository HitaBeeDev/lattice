type FocusTimePillProps = {
  focusMinutes: number;
};

export default function FocusTimePill({ focusMinutes }: FocusTimePillProps) {
  const label =
    focusMinutes >= 60
      ? `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`
      : `${focusMinutes}m`;
  return (
    <div className="w-full sm:w-auto">
      <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">Focus Time</p>
      <div className="flex h-[2.6rem] w-full items-center justify-center rounded-full border border-[#060a0f] sm:w-[6.5rem]">
        <p className="text-[#161c22] text-[0.9rem] font-extralight">{label}</p>
      </div>
    </div>
  );
}
