import { useHabits } from "../../ContextAPI/HabitContext";

export default function WeekDaysHeader() {
  const { formatDate, formattedToday, visibleWeekDates } = useHabits();

  return (
    <div>
      <div>
        <p>Your Habits</p>
      </div>

      {visibleWeekDates.map((date, index) =>
      <div
        key={index}>


          <p>




            {formatDate(date)}
          </p>
        </div>
      )}

      <div>
        <p>Edit</p>
      </div>

      <div>
        <p>Delete</p>
      </div>

      <div>
        <p>Progress</p>
      </div>
    </div>);

}
