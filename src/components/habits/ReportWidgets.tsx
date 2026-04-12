import { useHabits } from "../../context/HabitContext";

function ReportWidgets() {
  const { averagePercentageForWeek, bestDayMessage, bestHabitMessage } =
  useHabits();

  return (
    <div>
      <div>
        <>
          {averagePercentageForWeek >= 75 &&
          averagePercentageForWeek <= 100 &&
          <p>
                Fantastic job! Your result of the week is:{" "}
                <span>
                  {averagePercentageForWeek.toFixed(2)}%
                </span>
                . Keep up the amazing work, you're on fire!
              </p>}

          {averagePercentageForWeek >= 50 && averagePercentageForWeek < 75 &&
          <p>
              Great work! Your result of the week is:{" "}
              <span>
                {averagePercentageForWeek.toFixed(2)}%
              </span>
              . You're doing well, keep pushing towards your goals!
            </p>}

          {averagePercentageForWeek >= 25 && averagePercentageForWeek < 50 &&
          <p>
              Good effort! Your result of the week is:{" "}
              <span>
                {averagePercentageForWeek.toFixed(2)}%
              </span>
              . Remember, progress is progress, keep going!
            </p>}

          {averagePercentageForWeek >= 0 && averagePercentageForWeek < 25 &&
          <p>
              No worries! Your result of the week is:{" "}
              <span>
                {averagePercentageForWeek.toFixed(2)}%
              </span>
              . Building habits takes time, you're doing great! Keep it up next
              week!
            </p>}

        </>
      </div>

      <div>
        <p>
          {" "}
          {bestDayMessage}
        </p>
      </div>

      <div>
        <p>
          {bestHabitMessage}
        </p>
      </div>
    </div>);

}

export default ReportWidgets;
