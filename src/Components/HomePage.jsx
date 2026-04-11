import AddModal from "./ToDoListSection/AddModal";
import { useHabits } from "../ContextAPI/HabitContext";
import { useTasks } from "../ContextAPI/TasksContext";
import { useTimeTracker } from "../ContextAPI/TimeTrackerContext";

function HomePage() {
  const { tasks, checkedTasks, handleAddButtonClick, showModal } = useTasks();
  const { habits, toggleDayMark, percentages } = useHabits();
  const { maxSeconds, totalSeconds } = useTimeTracker();

  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const greeting = getGreeting(today);
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const completedTasks = Math.min(checkedTasks.length, tasks.length);
  const totalTasks = tasks.length;
  const focusSeconds = Math.max(maxSeconds - totalSeconds, 0);
  const focusTime = formatDuration(focusSeconds);
  const currentStreak = calculateCurrentStreak(percentages);
  const dailyHabits = habits.slice(0, 5);

  return (
    <main>
      <header>
        <div>
          <h1>{greeting}</h1>
          <p>Here is your daily productivity summary for {formattedDate}.</p>
        </div>

        <button onClick={handleAddButtonClick}>
          <span>+</span>
          Add Task
        </button>
      </header>

      <section>
        <StatCard
          icon={<CheckIcon />}
          label="Tasks Completed"
          value={completedTasks}
          suffix={totalTasks > 0 ? `/ ${totalTasks}` : "/ 0"}
          note="+2 from yesterday"
          notePrefix="+ "
        />
        <StatCard
          icon={<ClockIcon />}
          label="Focus Time"
          value={focusTime}
          note="On track with weekly average"
          notePrefix="- "
        />
        <StatCard
          icon={<FlameIcon />}
          label="Current Streak"
          value={`${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
          note="Personal best this month!"
          notePrefix="+ "
        />
      </section>

      <section>
        <article>
          <div>
            <h2>Weekly Activity</h2>
            <button>This Week v</button>
          </div>

          <div>Weekly activity chart coming soon.</div>
        </article>

        <article>
          <div>
            <h2>Daily Habits</h2>
            <button>...</button>
          </div>

          <ul>
            {dailyHabits.length > 0 ? (
              dailyHabits.map((habit, index) => {
                const isDone = Boolean(habit.days[todayIndex]);

                return (
                  <li key={`${habit.name}-${index}`}>
                    <button onClick={() => toggleDayMark(index, todayIndex)}>
                      <span>
                        <span>{isDone && <CheckIcon />}</span>
                        <span>{habit.name}</span>
                      </span>
                      <span>
                        <FlameIcon />
                        {habit.days.filter(Boolean).length}
                      </span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li>No habits for today.</li>
            )}
          </ul>
        </article>
      </section>

      {showModal && <AddModal />}
    </main>
  );
}

function StatCard({ icon, label, value, suffix, note, notePrefix }) {
  return (
    <article>
      <div>
        <p>{label}</p>
        <span>{icon}</span>
      </div>

      <div>
        <p>{value}</p>
        {suffix && <p>{suffix}</p>}
      </div>

      <p>
        {notePrefix}
        {note}
      </p>
    </article>
  );
}

function getGreeting(date) {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function calculateCurrentStreak(percentages) {
  let streak = 0;

  for (let index = percentages.length - 1; index >= 0; index -= 1) {
    if (percentages[index] <= 0) break;
    streak += 1;
  }

  return streak;
}

function CheckIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A4.5 4.5 0 0 0 13 19a4.5 4.5 0 0 0 4.5-4.5c0-3-2.2-4.3-2.2-7.5-2.7 1.5-4.2 3.5-4.5 6-1.1-.8-1.7-2-1.7-3.4-1.4 1.1-2.6 2.7-2.6 4.9Z" />
    </svg>
  );
}

export default HomePage;
