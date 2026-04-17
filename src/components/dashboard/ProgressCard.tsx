import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import FocusChartBar, { type ProgressChartItem } from "./FocusChartBar";

interface ProgressCardProps {
  sampleFocusHours: string;
  focusChartData: ProgressChartItem[];
}

// ── Main component ───────────────────────────────────────────────────────────

function ProgressCard({
  sampleFocusHours,
  focusChartData,
}: ProgressCardProps): React.ReactElement {
  return (
    <div className="rounded-[1.2rem] bg-[#cee2e9]/40 p-5 h-full">
      <div className="flex flex-row items-start justify-between">
        <div className="pt-2 ml-2">
          <p className="text-[0.85rem] leading-none font-[400] text-[#3d454b]">
            Progress
          </p>
          <p className="text-[2.2rem] leading-none font-[200] text-[#161c22] mt-3">
            {sampleFocusHours}
          </p>
        </div>

        <Link
          to="/pomodoro"
          className="cursor-pointer rounded-full bg-white p-[0.4rem] transition-all duration-300 hover:bg-[#f4f5f5]"
          aria-label="Open Pomodoro page"
        >
          <ArrowUpRight className="h-6 w-6 text-[#0a1929]" strokeWidth={1.25} />
        </Link>
      </div>

      <div className="flex items-end justify-between flex-none px-2 pt-3 mt-auto h-[100px]">
        {focusChartData.map((item) => (
          <FocusChartBar key={`${item.day}-${item.label}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ProgressCard;
