import { useTasks } from "../../ContextAPI/TasksContext";

function ToDoList() {
  const {
    isEditing,
    editTaskIndex,
    newTask,
    handleTaskDelete,
    handleTaskEditClick,
    updateNewTask,
    checkedTasks,
    handleCheckboxChange,
    sortedTasks,
    generateTaskIdentifier
  } = useTasks();

  if (sortedTasks.length === 0) {
    return (
      <div>





        <p>
          Looks like you're all caught up! No to-dos on the list right now!
        </p>
      </div>);

  }

  return (
    <div>
      {sortedTasks.map(([date, tasks]) =>
      <div key={date}>
          <p>{date}</p>
          <ul>
            {tasks.map((task, index) => {
            const taskIdentifier = generateTaskIdentifier(task, index);
            return (
              <li
                key={taskIdentifier}>






                  <div>











                    <div>
                      <input





                      type="checkbox"
                      checked={checkedTasks.includes(taskIdentifier)}
                      onChange={() => handleCheckboxChange(taskIdentifier)} />


                      <div>
                        {isEditing && editTaskIndex === index ?
                      <input
                        type="text"
                        value={newTask.name}

                        onChange={(e) =>
                        updateNewTask("name", e.target.value)} /> :



                      <p>
                            {task.name}
                          </p>}


                        <p>
                          {isEditing && editTaskIndex === index ?
                        <input
                          type="text"
                          value={newTask.description}

                          onChange={(e) =>
                          updateNewTask("description", e.target.value)} /> :



                        task.description}

                        </p>
                      </div>
                    </div>

                    <div>
                      <p>
                        {task.date}
                      </p>
                    </div>

                    <div>
                      <p>
                        {task.startTime} - {task.endTime}
                      </p>
                    </div>

                    <div>










                      <p>
                        {task.priority}
                      </p>
                    </div>

                    <div>
                      <button

                      onClick={() => handleTaskEditClick(task.id)}>

                        Edit
                      </button>
                      <button

                      onClick={() => handleTaskDelete(task.id)}>

                        Delete
                      </button>
                    </div>
                  </div>
                </li>);

          })}
          </ul>
        </div>
      )}
    </div>);

}

export default ToDoList;
