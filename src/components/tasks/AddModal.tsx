import { useTasks } from "../../context/TasksContext";

function AddModal() {
  const {
    newTask,
    handleCloseModal,
    handleTaskAddition,
    handleTaskSave,
    updateNewTask,
    isEditing
  } = useTasks();

  return (
    <div>
      <div>
        <div>
          <button onClick={handleCloseModal}>
            <span>
              Close
            </span>
          </button>
        </div>

        <div>
          <div>
            <label>
              Let's Get Started on a New To-Do!
            </label>
            <input
              type="text"
              placeholder="ToDo name:"

              value={newTask.name}
              onChange={(e) => updateNewTask("name", e.target.value)}
              required />

          </div>

          <div>
            <label>
              Description of your to-do list:
            </label>
            <input
              type="text"
              placeholder="Enter Description"

              value={newTask.description}
              onChange={(e) => updateNewTask("description", e.target.value)}
              required />

          </div>

          <div>
            <label>
              When are you planning to handle this?
            </label>
            <input
              type="date"
              value={newTask.date}
              onChange={(e) => updateNewTask("date", e.target.value)}

              required />

          </div>

          <div>
            <label>
              When will you begin?
            </label>
            <input
              type="time"
              value={newTask.startTime}
              onChange={(e) => updateNewTask("startTime", e.target.value)}

              required />

          </div>

          <div>
            <label>
              When will you be done?
            </label>
            <input
              type="time"
              value={newTask.endTime}
              onChange={(e) => updateNewTask("endTime", e.target.value)}

              required />

          </div>

          <div>
            <p>
              Please choose a priority tag:
            </p>

            <div>
              {["High", "Medium", "Low"].map((priority) =>
              <button
                key={priority}







                onClick={() => updateNewTask("priority", priority)}
                required>

                  {priority} Priority
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <button

            onClick={isEditing ? handleTaskSave : handleTaskAddition}>

            {isEditing ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>);

}

export default AddModal;
