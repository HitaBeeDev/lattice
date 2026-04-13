import { useTasks } from "../../context/TasksContext";
import { Button } from "../ui";
function WelcomeBanner() {
    const { handleAddButtonClick } = useTasks();
    return (<header>
      <div aria-hidden="true"/>
      <div>
        <div>Task flow</div>
        <h1>
          Keep the work in motion.
        </h1>
        <p>
          Capture the next deliverable, keep timing visible, and remove ambiguity from the day.
        </p>
      </div>

      <div>
        <Button onClick={handleAddButtonClick} variant="secondary">
          Add Task
        </Button>
      </div>
    </header>);
}
export default WelcomeBanner;
