import { useHabits } from "../../context/HabitContext";
export default function WeekDaysHeader() {
    const { formatDate, visibleWeekDates } = useHabits();
    return (<section>
      <div>
        <div>
          <div>
            <p>
              Your habits
            </p>
          </div>

          {visibleWeekDates.map((date) => (<div key={date.toISOString()}>
              <p>
                {formatDate(date)}
              </p>
            </div>))}

          <div>
            <p>
              Edit
            </p>
          </div>

          <div>
            <p>
              Delete
            </p>
          </div>

          <div>
            <p>
              Progress
            </p>
          </div>
        </div>
      </div>
    </section>);
}
