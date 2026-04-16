import { useNavigate } from "react-router-dom";
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
      className="w-full min-h-[16rem] lg:h-full sm:col-span-2 lg:col-span-2 lg:row-span-3 lg:row-start-1 rounded-[1.2rem] bg-[#cee2e9]/40 p-5 cursor-pointer transition-colors duration-200 hover:bg-[#cee2e9]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1929]/20"
      role="link"
      tabIndex={0}
      aria-label="Open tasks page"
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <DashboardCalendar
        activeWeek={activeWeek}
        weeks={weeks}
        todayDate={todayDate}
        multiDayTasks={multiDayTasks}
        maxMultiDayRows={0}
      />
    </div>
  );
}
