import WelcomeBanner from "../components/habits/WelcomeBanner";
import WeekDaysHeader from "../components/habits/WeekDaysHeader";
import HabitList from "../components/habits/HabitList";
import SummaryStats from "../components/habits/SummaryStats";
import ResultsReport from "../components/habits/ResultsReport";

function HabitTrackerPage() {
  return (
    <main className="space-y-8 p-5 sm:p-6 lg:p-8" id="main-content" tabIndex={-1}>
      <WelcomeBanner />

      <WeekDaysHeader />

      <HabitList />

      <SummaryStats />

      <ResultsReport />
    </main>
  );
}

export default HabitTrackerPage;
