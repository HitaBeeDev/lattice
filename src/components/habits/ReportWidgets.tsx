import { useHabits } from "../../context/HabitContext";
function ReportWidgets() {
    const { averagePercentageForWeek, bestDayMessage, bestHabitMessage } = useHabits();
    const avgPct = averagePercentageForWeek;
    const performanceMessage = (() => {
        if (avgPct >= 75)
            return `Fantastic job! Your weekly average is ${avgPct.toFixed(0)}%. Keep up the amazing work — you're on fire!`;
        if (avgPct >= 50)
            return `Great work! Your weekly average is ${avgPct.toFixed(0)}%. You're doing well — keep pushing towards your goals!`;
        if (avgPct >= 25)
            return `Good effort! Your weekly average is ${avgPct.toFixed(0)}%. Remember, progress is progress — keep going!`;
        return `No worries! Your weekly average is ${avgPct.toFixed(0)}%. Building habits takes time — keep it up next week!`;
    })();
    return (<section>
      <article>
        <p>
          Weekly average
        </p>
        <p>{performanceMessage}</p>
      </article>

      <article>
        <p>
          Best day
        </p>
        <p>{bestDayMessage}</p>
      </article>

      <article>
        <p>
          Best habit
        </p>
        <p>{bestHabitMessage}</p>
      </article>
    </section>);
}
export default ReportWidgets;
