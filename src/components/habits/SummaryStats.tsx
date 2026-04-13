import { useHabits } from "../../context/HabitContext";
import habitQuotes from "./habitQuotes";
export default function SummaryStats() {
    const { percentages, quoteIndex, weekDates } = useHabits();
    return (<section>
      <article>
        <div>
          <p>
            Weekly check-ins
          </p>
          <h2>
            Daily completion rhythm
          </h2>
        </div>

        <div>
          {weekDates.map((date, index) => (<div key={date.toISOString()}>
              <p>
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <p>
                {percentages[index]}%
              </p>
            </div>))}
        </div>
      </article>

      <article>
        <div aria-hidden="true"/>
        <p>
          Reflection
        </p>
        <p>
          Small wins stay visible.
        </p>
        <p>
          {habitQuotes[quoteIndex]}
        </p>
      </article>
    </section>);
}
