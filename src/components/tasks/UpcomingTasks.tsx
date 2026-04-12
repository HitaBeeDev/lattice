import { useTasks } from "../../context/TasksContext";

function UpcomingTasks() {
  const { groupedTasks, checkedTasks, generateTaskIdentifier } = useTasks();

  return (
    <div>





      <p>Upcoming Tasks</p>

      <div>
        {Object.entries(groupedTasks).
        sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).
        map(([date, tasks], index) =>
        <div key={date}>
              {index !== 0 && <div></div>}

              <ul>
                {tasks.
            filter((task) => !checkedTasks.includes(generateTaskIdentifier(task))).
            map((task, index) =>
            <li key={index}>
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
