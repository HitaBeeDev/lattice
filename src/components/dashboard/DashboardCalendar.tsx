import type { MockDashboardWeek, MockMultiDayTask } from "../../lib/mockDashboardMonth";
import { useCalendarWeek, type CalendarEvent } from "../../hooks/useCalendarWeek";
import CalendarNav from "./calendar/CalendarNav";
import CalendarDayHeaders from "./calendar/CalendarDayHeaders";
import MultiDayBand from "./calendar/MultiDayBand";
import TimeGridBackground from "./calendar/TimeGridBackground";
import TimedEventsLayer from "./calendar/TimedEventsLayer";
import WeekTaskPillsLayer from "./calendar/WeekTaskPillsLayer";

interface DashboardCalendarProps {
  activeWeek: MockDashboardWeek;
  weeks: MockDashboardWeek[];
  todayDate: string;
  multiDayTasks: MockMultiDayTask[];
  fixedStartHour?: number;
  hideWeekTasks?: boolean;
  maxMultiDayRows?: number;
}

// Mock calendar events — only visible on the data week
const TIMED_EVENTS: CalendarEvent[] = [
  { id: "evt-1", title: "Weekly Team Sync", subtitle: "Discuss progress on projects", day: "Tuesday", startHour: 9, durationHours: 1, variant: "dark" },
  { id: "evt-2", title: "Onboarding Session", subtitle: "Introduction for new hires", day: "Tuesday", startHour: 10, durationHours: 1, variant: "light" },
  { id: "evt-3", title: "Design Sync", subtitle: "Review dashboard mockups", day: "Thursday", startHour: 8, durationHours: 1, variant: "light" },
];

export default function DashboardCalendar({
  activeWeek,
  weeks,
  todayDate,
  multiDayTasks,
  fixedStartHour,
  hideWeekTasks = false,
  maxMultiDayRows,
}: DashboardCalendarProps): React.ReactElement {
  const {
    currentHour,
    visibleStartHour,
    timeSlots,
    displayDays,
    visibleWeek,
    visibleWeekDaysByDate,
    clippedMultiDay,
    multiDayRowCount,
    visibleTimedEvents,
    headerLabel,
    handlePreviousWeek,
    handleNextWeek,
  } = useCalendarWeek({ weeks, todayDate, multiDayTasks, timedEvents: TIMED_EVENTS, activeWeek, fixedStartHour, maxMultiDayRows });

  return (
    <div className="flex flex-col h-full gap-2">
      <CalendarNav headerLabel={headerLabel} onPrevious={handlePreviousWeek} onNext={handleNextWeek} />
      <CalendarDayHeaders displayDays={displayDays} todayDate={todayDate} />

      <div className="relative flex-1 min-h-0 overflow-hidden" aria-label="Weekly calendar grid">
        <div className="flex h-full min-h-0 flex-col">
          <MultiDayBand clippedMultiDay={clippedMultiDay} rowCount={multiDayRowCount} />
          <div className="relative flex-1 min-h-0">
            <TimeGridBackground timeSlots={timeSlots} displayDays={displayDays} todayDate={todayDate} />
            <TimedEventsLayer
              displayDays={displayDays}
              visibleTimedEvents={visibleTimedEvents}
              visibleStartHour={visibleStartHour}
            />
          {visibleWeek && !hideWeekTasks && (
            <WeekTaskPillsLayer
              displayDays={displayDays}
              timeSlots={timeSlots}
              visibleWeekDaysByDate={visibleWeekDaysByDate}
              visibleTimedEvents={visibleTimedEvents}
              todayDate={todayDate}
              currentHour={currentHour}
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
