import { lazy, Suspense, useEffect } from "react";
import { mockUser } from "../lib/mockUser";
import DeferredSection from "../components/dashboard/DeferredSection";
import StatsBar from "../components/dashboard/StatsBar";
import ProgressCard from "../components/dashboard/ProgressCard";
import { Skeleton } from "../components/ui";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { cancelIdleTask, scheduleIdleTask } from "../lib/scheduleIdleTask";

const CalendarCard = lazy(() => import("../components/dashboard/LazyCalendarCard"));
const TaskOverviewCard = lazy(() => import("../components/dashboard/TaskOverviewCard"));
const TimeTrackerCard = lazy(() => import("../components/dashboard/TimeTrackerCard"));
const HabitConsistencyCard = lazy(() => import("../components/dashboard/LazyHabitConsistencyCard"));

const preloadDeferredCards = (): void => {
  void import("../components/dashboard/LazyCalendarCard");
  void import("../components/dashboard/TaskOverviewCard");
  void import("../components/dashboard/TimeTrackerCard");
  void import("../components/dashboard/LazyHabitConsistencyCard");
};

function DashboardCardSkeleton({ className }: { className: string }) {
  return <Skeleton className={className} />;
}

function DashboardPage() {
  const {
    completedTodayTasks,
    totalTodayTasks,
    todayTasks,
    completedHabitsToday,
    totalDailyHabits,
    habitPct,
    currentStreak,
    totalHabits,
    focusMinutes,
    sampleFocusHours,
    completedPomodoros,
    weeklyGoalAverage,
    focusChartData,
    handleCheckboxChange,
  } = useDashboardOverview();

  useEffect(() => {
    const idleHandle = scheduleIdleTask(preloadDeferredCards, 2200);

    return () => {
      cancelIdleTask(idleHandle);
    };
  }, []);

  return (
    <main className="h-full overflow-y-auto lg:overflow-hidden" id="main-content" tabIndex={-1}>
      <div className="flex flex-col lg:h-full">
        <div className="mt-8">
          <p className="font-['Inter'] font-[300] text-[2.1rem] text-[#060a0f]">
            Welcome in, {mockUser.name}
          </p>
        </div>

        <StatsBar
          completedTodayTasks={completedTodayTasks}
          totalTodayTasks={totalTodayTasks}
          completedHabitsToday={completedHabitsToday}
          totalDailyHabits={totalDailyHabits}
          habitPct={habitPct}
          focusMinutes={focusMinutes}
          weeklyGoalAverage={weeklyGoalAverage}
          currentStreak={currentStreak}
          totalHabits={totalHabits}
          completedPomodoros={completedPomodoros}
        />

        <div className="grid gap-3 mt-6 grid-cols-1 sm:grid-cols-2 lg:flex-1 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-4 pb-6 lg:pb-0">
          <ProgressCard
            sampleFocusHours={sampleFocusHours}
            focusChartData={focusChartData}
          />

          <DeferredSection
            fallback={
              <DashboardCardSkeleton className="min-h-[16rem] rounded-[1.2rem] sm:col-span-2 lg:col-span-2 lg:row-span-3" />
            }
          >
            <Suspense
              fallback={
                <DashboardCardSkeleton className="min-h-[16rem] rounded-[1.2rem] sm:col-span-2 lg:col-span-2 lg:row-span-3" />
              }
            >
              <CalendarCard />
            </Suspense>
          </DeferredSection>

          <DeferredSection
            fallback={
              <DashboardCardSkeleton className="min-h-[20rem] rounded-[1.2rem] sm:col-span-2 lg:col-span-1 lg:row-span-4" />
            }
          >
            <Suspense
              fallback={
                <DashboardCardSkeleton className="min-h-[20rem] rounded-[1.2rem] sm:col-span-2 lg:col-span-1 lg:row-span-4" />
              }
            >
              <TaskOverviewCard tasks={todayTasks} onToggleTask={handleCheckboxChange} />
            </Suspense>
          </DeferredSection>

          <DeferredSection
            fallback={
              <DashboardCardSkeleton className="min-h-[12rem] rounded-[1.2rem] sm:col-span-1 lg:col-span-1 lg:row-span-2" />
            }
          >
            <Suspense
              fallback={
                <DashboardCardSkeleton className="min-h-[12rem] rounded-[1.2rem] sm:col-span-1 lg:col-span-1 lg:row-span-2" />
              }
            >
              <TimeTrackerCard />
            </Suspense>
          </DeferredSection>

          <DeferredSection
            fallback={
              <DashboardCardSkeleton className="min-h-[10rem] rounded-[1.2rem] sm:col-span-2 lg:col-span-2 lg:row-span-1" />
            }
          >
            <Suspense
              fallback={
                <DashboardCardSkeleton className="min-h-[10rem] rounded-[1.2rem] sm:col-span-2 lg:col-span-2 lg:row-span-1" />
              }
            >
              <HabitConsistencyCard />
            </Suspense>
          </DeferredSection>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
