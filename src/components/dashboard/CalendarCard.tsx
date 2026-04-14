import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardCalendar from "./DashboardCalendar";
import type {
  MockDashboardWeek,
  MockMultiDayTask,
} from "../../lib/mockDashboardMonth";

interface CalendarCardProps {
  activeWeek: MockDashboardWeek;
  weeks: MockDashboardWeek[];
  todayDate: string;
  multiDayTasks: MockMultiDayTask[];
}

export default function CalendarCard({
  activeWeek,
  weeks,
  todayDate,
  multiDayTasks,
}: CalendarCardProps): React.ReactElement {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/tasks");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate("/tasks");
    }
  };

  return (
    <div
      className="w-full h-full col-span-2 row-span-1 flex flex-col overflow-hidden rounded-[1.2rem] bg-[#cee2e9]/40 p-5 cursor-pointer transition-colors duration-200 hover:bg-[#cee2e9]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1929]/20"
      role="link"
      tabIndex={0}
      aria-label="Open tasks page"
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      {/* Card header */}
      <div className="flex flex-row items-start justify-between flex-none mb-3">
        <p className="text-[0.85rem] mt-2 leading-none font-[400] text-[#3d454b]">
          Calendar
        </p>
        <Link
          to="/tasks"
          className="cursor-pointer rounded-full bg-white p-[0.4rem] transition-all duration-300 hover:bg-[#f4f5f5]"
          aria-label="Open tasks page"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowUpRight className="h-6 w-6 text-[#0a1929]" strokeWidth={1.25} />
        </Link>
      </div>

      {/* Calendar */}
      <div className="flex-1 min-h-0">
        <DashboardCalendar
          activeWeek={activeWeek}
          weeks={weeks}
          todayDate={todayDate}
          multiDayTasks={multiDayTasks}
          fixedStartHour={8}
          hideWeekTodos={true}
          maxMultiDayRows={2}
        />
      </div>
    </div>
  );
}
