import WelcomeBanner from "../components/HabitSection/WelcomeBanner";
import WeekDaysHeader from "../components/HabitSection/WeekDaysHeader";
import HabitList from "../components/HabitSection/HabitList";
import SummaryStats from "../components/HabitSection/SummaryStats";
import ResultsReport from "../components/HabitSection/ResultsReport";

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
