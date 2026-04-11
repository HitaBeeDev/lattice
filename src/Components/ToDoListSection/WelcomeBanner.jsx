import { useTasks } from "../../ContextAPI/TasksContext";

function WelcomeBanner() {
  const { handleAddButtonClick } = useTasks();

  return (
    <div>
      <div>
        <p>
          Hello there!
        </p>
        <p>
          Excited to have you! Here's a checklist to get you started smoothly:
        </p>
      </div>

      <div>
        <button

          onClick={handleAddButtonClick}>

          Add Task
        </button>
      </div>
    </div>);

}

export default WelcomeBanner;
