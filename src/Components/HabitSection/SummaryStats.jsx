import { useHabits } from "../../ContextAPI/HabitContext";
import habitQuotes from "./habitQuotes";

export default function SummaryStats() {
  const { percentages, quoteIndex } = useHabits();

  return (
    <div>
      <div>
        Daily check-ins:
      </div>

      {percentages.map((percentage, index) =>
      <div key={index}>
          <p>
            {percentage}%
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
