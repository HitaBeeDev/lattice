import { useHabits } from "../../context/HabitContext";

function HabitWidget() {
  const { habits } = useHabits();

  return (
    <div>
      <div>
        <p>Today's Habits:</p>

        <p>
          Keep up the amazing momentum!
        </p>
      </div>

      {habits && habits.length > 0 ?
      <ul>
          {habits.map((habit, index) =>
        <li key={index}>
              {habit.name}
            </li>
        )}
        </ul> :

      <p>No habits for today.</p>}

    </div>);

}

export default HabitWidget;
