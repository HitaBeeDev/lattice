import WelcomeBanner from "./WelcomeBanner";
import WeekDaysHeader from "./WeekDaysHeader";
import HabitList from "./HabitList";
import SummaryStats from "./SummaryStats";
import ResultsReport from "./ResultsReport";

function HabitTrackerPage() {
  return (
    <div>
      <WelcomeBanner />

      <WeekDaysHeader />

      <HabitList />

      <SummaryStats />

      <ResultsReport />
    </div>);

}

export default HabitTrackerPage;
