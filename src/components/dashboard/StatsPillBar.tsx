type StatPill = {
  label: string;
  value: number;
  pillClassName: string;
};

export type { StatPill };

const GRID_SPAN_CLASSES = [
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
  "col-span-7",
  "col-span-8",
  "col-span-9",
  "col-span-10",
  "col-span-11",
  "col-span-12",
] as const;

function getGridSpanClass(value: number): string {
  const safeValue = Math.min(100, Math.max(0, value));
  const index = Math.max(0, Math.ceil((safeValue / 100) * GRID_SPAN_CLASSES.length) - 1);
  return GRID_SPAN_CLASSES[index];
}

export default function StatsPillBar({ pills }: { pills: StatPill[] }) {
  return (
    <div className="grid w-full grid-cols-12 items-start gap-2 mt-5">
      {pills.map((pill) => (
        <div key={pill.label} className={`min-w-0 ${getGridSpanClass(pill.value)}`}>
          <div className={`flex h-[2.6rem] items-center justify-center rounded-[0.75rem] ${pill.pillClassName}`}>
            <p className="truncate px-2 text-[0.9rem] font-extralight">{pill.value}%</p>
          </div>
          <p className="mb-[0.3rem] mt-1 ml-[0.4rem] truncate text-[0.6rem] font-[500] text-[#a0a6ab]">
            {pill.label}
          </p>
        </div>
      ))}
    </div>
  );
}
