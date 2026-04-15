import WelcomeBanner from "../components/habits/WelcomeBanner";
import WeekDaysHeader from "../components/habits/WeekDaysHeader";
import HabitList from "../components/habits/HabitList";
import SummaryStats from "../components/habits/SummaryStats";
import ResultsReport from "../components/habits/ResultsReport";
function HabitTrackerPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-8"
      id="main-content"
      tabIndex={-1}
    >
      <WelcomeBanner />

      <WeekDaysHeader />

      <HabitList />

      <SummaryStats />
    </main>
  );
}
export default HabitTrackerPage;
