import { useTimeTracker } from "../../ContextAPI/TimeTrackerContext";

function TimerButtons() {
  const { handleStart, handlePause, handleReset, toggleEdit, editButtonText } =
  useTimeTracker();

  return (
    <div>
      <button
        onClick={toggleEdit}>



        {editButtonText}
      </button>

      <button


        onClick={handlePause}>

        Pause
      </button>

      <button


        onClick={handleStart}>

        Start
      </button>

      <button
        onClick={handleReset}>



        Reset
      </button>
    </div>);

}

export default TimerButtons;
