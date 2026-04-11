import { useHabits } from "../../ContextAPI/HabitContext";

export default function WelcomeBanner() {
  const { habitInput, handleInputChange, handleAddClick } = useHabits();

  return (
    <div>
      <div>
        <p>
          Welcome to the journey of building new habits!
        </p>
        <p>
          Let's embark on this exciting adventure together!
        </p>
      </div>

      <div>
        <div>
          <input
            value={habitInput}
            onChange={handleInputChange}
            type="text"

            placeholder="Add a new habit..." />

          <button

            onClick={handleAddClick}>

            Add Habit
          </button>
        </div>
      </div>
    </div>);

}
