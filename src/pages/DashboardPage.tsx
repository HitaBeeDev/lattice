import AddModal from "../components/tasks/AddModal";
import DailyHabitsCard from "../components/dashboard/DailyHabitsCard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import { CheckIcon, ClockIcon, FlameIcon } from "../components/dashboard/dashboardIcons";
import {
  calculateCurrentStreak,
  formatDuration,
  getGreeting,
} from "../components/dashboard/dashboardUtils";
import { useHabits } from "../context/HabitContext";
import { useTasks } from "../context/TasksContext";
import { useTimeTracker } from "../context/TimeTrackerContext";

const MAX_DAILY_HABITS = 5;

function DashboardPage() {
  const { tasks, checkedTasks, handleAddButtonClick, showModal } = useTasks();
  const { habits, toggleDayMark, percentages } = useHabits();
  const { completedPomodoros, todayFocusSeconds } = useTimeTracker();

  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const greeting = getGreeting(today);
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const completedTasks = Math.min(checkedTasks.length, tasks.length);
  const totalTasks = tasks.length;
  const focusTime = formatDuration(todayFocusSeconds);
  const currentStreak = calculateCurrentStreak(percentages);
  const dailyHabits = habits.slice(0, MAX_DAILY_HABITS);

  return (
    <main>
      <DashboardHeader
        formattedDate={formattedDate}
        greeting={greeting}
        onAddTask={handleAddButtonClick}
      />

      <DashboardStats
        completedPomodoros={completedPomodoros}
        completedTasks={completedTasks}
        currentStreak={currentStreak}
        focusIcon={<ClockIcon />}
        focusTime={focusTime}
        streakIcon={<FlameIcon />}
        taskIcon={<CheckIcon />}
        totalTasks={totalTasks}
      />

      <section>
        <article>
          <div>
            <h2>Weekly Activity</h2>
            <button type="button">This Week v</button>
          </div>

          <div>Weekly activity chart coming soon.</div>
        </article>

        <DailyHabitsCard
          habits={dailyHabits}
          todayIndex={todayIndex}
          toggleDayMark={toggleDayMark}
        />
      </section>

      {showModal && <AddModal />}
    </main>
  );
}

export default DashboardPage;
