import { useTasks } from "../../context/TasksContext";

function TasksWidget() {
  const { groupedTasks, checkedTasks, generateTaskIdentifier } = useTasks();

  const upcomingTasks = Object.entries(groupedTasks).
  sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).
  slice(0, 2).
  map(([, tasks]) =>
  tasks.
  filter((task) => !checkedTasks.includes(generateTaskIdentifier(task))).
  slice(0, 2)
  ).
  flat();

  return (
    <div>
      <p>Upcoming Plans: </p>

      <div>
        {upcomingTasks.length > 0 ?
        upcomingTasks.map((task, index) =>
        <div key={index}>
              {index !== 0 && <div></div>}

              <ul>
                <li>
                  <p>
                    {task.date}
                  </p>

                  <div>










                    <div>
                      <p>
                        {task.name}
                      </p>
                    </div>

                    <p>
                      {task.startTime} - {task.endTime}
                    </p>

                    <p>
                      {task.priority}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
        ) :

        <p>
            Everything's all set, no tasks ahead! Take a moment to breathe and
            enjoy your day.
          </p>}

      </div>
    </div>);

}

export default TasksWidget;
