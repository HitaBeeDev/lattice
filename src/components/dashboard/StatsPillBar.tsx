type StatPill = {
  label: string;
  value: number;
  pillClassName: string;
};

export type { StatPill };

function getSafeWidth(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export default function StatsPillBar({ pills }: { pills: StatPill[] }) {
  return (
    <div className="flex flex-row items-start w-full mt-5">
      {pills.map((pill) => (
        <div
          key={pill.label}
          className="flex-shrink-0 min-w-0"
          style={{ width: `${getSafeWidth(pill.value)}%` }}
        >
          <div
            className={`flex h-[2.6rem] w-full rounded-[0.7rem] items-center justify-center ${pill.pillClassName}`}
          >
            <p className="truncate px-2 text-[0.9rem] font-extralight">
              {pill.value}%
            </p>
          </div>
          <p className="mb-[0.3rem] mt-1 ml-[0.4rem] truncate text-[0.6rem] font-[500] text-[#a0a6ab]">
            {pill.label}
          </p>
        </div>
      ))}
    </div>
  );
}
