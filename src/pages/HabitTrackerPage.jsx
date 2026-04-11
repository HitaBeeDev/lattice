import WelcomeBanner from "../components/habits/WelcomeBanner";
import WeekDaysHeader from "../components/habits/WeekDaysHeader";
import HabitList from "../components/habits/HabitList";
import SummaryStats from "../components/habits/SummaryStats";
import ResultsReport from "../components/habits/ResultsReport";

function HabitTrackerPage() {
  return (
    <div>
      <WelcomeBanner />

      <WeekDaysHeader />

      <HabitList />

      <SummaryStats />

      <ResultsReport />
    </div>
  );
}

export default HabitTrackerPage;
