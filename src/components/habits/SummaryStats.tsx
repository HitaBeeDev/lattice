import { useHabits } from "../../context/HabitContext";
import habitQuotes from "./habitQuotes";

export default function SummaryStats() {
  const { percentages, quoteIndex, weekDates } = useHabits();

  return (
    <div>
      <div>
        Daily check-ins:
      </div>

      {weekDates.map((date, index) =>
      <div key={date.toISOString()}>
          <p>
            {percentages[index]}%
          </p>
        </div>
      )}

      <div>
        <p>
          {habitQuotes[quoteIndex]}
        </p>
      </div>
    </div>);

}
