import HatchFill from "../ui/HatchFill";

type WeeklyOutputBarProps = {
  percentage: number;
};

export default function WeeklyOutputBar({ percentage }: WeeklyOutputBarProps) {
  return (
    <div className="w-full sm:w-auto">
      <p className="text-[0.6rem] font-[500] text-[#a0a6ab] ml-3 mb-[0.3rem]">Weekly Output</p>
      <div className="relative h-[2.6rem] w-full overflow-hidden rounded-full border border-white md:w-[12rem] xl:w-[25rem]">
        <HatchFill percentage={percentage} hatchClassName="bg-hatch" />
        <p className="relative z-10 flex h-full items-center justify-center text-[#161c22] text-[0.9rem] font-extralight">
          {percentage}%
        </p>
      </div>
    </div>
  );
}
