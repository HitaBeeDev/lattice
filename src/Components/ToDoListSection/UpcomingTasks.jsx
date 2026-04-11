import { useTasks } from "../../ContextAPI/TasksContext";

function UpcomingTasks() {
  const { groupedTasks, checkedTasks, generateTaskIdentifier } = useTasks();

  // Function to compare dates
  const compareDates = (a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  };

  return (
    <div>





      <p>Upcoming Tasks</p>

      <div>
        {Object.entries(groupedTasks).
        sort(compareDates).
        map(([date, tasks], index) =>
        <div key={date}>
              {index !== 0 && <div></div>}

              <ul>
                {tasks.
            filter(
              (task, index) =>
              !checkedTasks.includes(
                generateTaskIdentifier(task, index)
              )
            ).
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
