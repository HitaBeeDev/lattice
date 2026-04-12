import { useTasks } from "../../context/TasksContext";

const byDate = ([dateA]: [string, unknown], [dateB]: [string, unknown]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

function UpcomingTasks() {
  const { groupedTasks, checkedTasks } = useTasks();

  return (
    <div>





      <p>Upcoming Tasks</p>

      <div>
        {Object.entries(groupedTasks).
        sort(byDate).
        map(([date, tasks], index) =>
        <div key={date}>
              {index !== 0 && <div></div>}

              <ul>
                {tasks.
            filter((task) => !checkedTasks.includes(task.id)).
            map((task) =>
            <li key={task.id}>
                      <p>
                        {date}
                      </p>

                      <div>











                        <div>
                          <p>
                            {task.name}
                          </p>

                          <p>
                            {task.description}
                          </p>
                        </div>

                        <p>
                          {task.startTime} - {task.endTime}
                        </p>
                      </div>
                    </li>
            )}
              </ul>
            </div>
        )}
      </div>
    </div>);

}

export default UpcomingTasks;
