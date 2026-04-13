import { Button } from "../ui";
import { useTimeTracker } from "../../context/TimeTrackerContext";
function TimerButtons() {
    const { handleStart, handlePause, handleReset, toggleEdit, editButtonText, isTimerActive, } = useTimeTracker();
    return (<div>
      <Button onClick={handleStart} type="button">
        {isTimerActive ? "Running" : "Start"}
      </Button>
      <Button onClick={handlePause} type="button" variant="secondary">
        Pause
      </Button>
      <Button onClick={handleReset} type="button" variant="ghost">
        Reset
      </Button>
      <Button onClick={toggleEdit} type="button" variant="ghost">
        {editButtonText}
      </Button>
    </div>);
}
export default TimerButtons;
