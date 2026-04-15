import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const FOCUS_CHART_HEIGHT = 100;
const MIN_FOCUS_BAR_HEIGHT = 8;
const MAX_FOCUS_BAR_HEIGHT = 72;

interface ProgressChartItem {
  day: string;
  focusMinutes: number;
  label: string;
  isToday: boolean;
  isMuted: boolean;
  isFuture: boolean;
}

interface ProgressCardProps {
  sampleFocusHours: string;
  focusChartData: ProgressChartItem[];
}

const getFocusBarHeight = (
  focusMinutes: number,
  maxFocusMinutes: number,
): number => {
  if (maxFocusMinutes <= 0) {
    return MIN_FOCUS_BAR_HEIGHT;
  }

  const scaledRatio = focusMinutes / maxFocusMinutes;
  return Math.round(
    MIN_FOCUS_BAR_HEIGHT +
      scaledRatio * (MAX_FOCUS_BAR_HEIGHT - MIN_FOCUS_BAR_HEIGHT),
  );
};

function ProgressCard({
  sampleFocusHours,
  focusChartData,
}: ProgressCardProps): React.ReactElement {
  const maxFocusChartMinutes = Math.max(
    ...focusChartData.map((item) => item.focusMinutes),
    1,
  );

  return (
    <div className="col-span-1 row-span-2 flex h-full w-full flex-col overflow-hidden rounded-[1.2rem] bg-[#cee2e9]/40 p-5">
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
        >
          <ArrowUpRight className="h-6 w-6 text-[#0a1929]" strokeWidth={1.25} />
        </Link>
      </div>

      <div
        className="flex items-end justify-between flex-none px-2 pt-3 mt-auto"
        style={{ height: `${FOCUS_CHART_HEIGHT}px` }}
      >
        {focusChartData.map((item) => {
          const barHeight = getFocusBarHeight(
            item.focusMinutes,
            maxFocusChartMinutes,
          );

          return (
            <div
              key={`${item.day}-${item.label}`}
              className="group relative flex w-7 flex-none flex-col items-center justify-end gap-[0.3rem]"
            >
              <div className="flex items-center">
                <span
                  className={`flex w-max items-center justify-center whitespace-nowrap rounded-full px-[0.4rem] py-[0.2rem] text-[0.5rem] font-[400] leading-none transition-all duration-200 ${
                    item.isToday
                      ? "bg-[#72e1ee] text-[#50585e] opacity-100 shadow-[0_6px_18px_rgba(114,225,238,0.22)]"
                      : item.isFuture
                        ? "opacity-0"
                        : "bg-[#161c22] text-white opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              <div className="flex items-end">
                {!item.isFuture && (
                  <div
                    className={`rounded-full transition-transform duration-200 group-hover:scale-y-[1.04] ${
                      item.isToday
                        ? "bg-[#72e1ee] shadow-[0_0_0_1px_rgba(114,225,238,0.08)]"
                        : item.isMuted
                          ? "bg-[#d3d6d9]"
                          : "bg-[#12171b]"
                    }`}
                    style={{
                      height: `${barHeight}px`,
                      width: item.isToday ? "7px" : "6px",
                    }}
                  />
                )}
              </div>

              {!item.isFuture && (
                <span
                  className={`h-[0.38rem] w-[0.38rem] rounded-full ${
                    item.isToday
                      ? "bg-[#72e1ee]"
                      : item.isMuted
                        ? "bg-[#d3d6d9]"
                        : "bg-[#12171b]"
                  }`}
                />
              )}

              <span className="text-[0.55rem] font-[400] uppercase leading-none tracking-[0.08em] text-[#a0a6ab]">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressCard;
