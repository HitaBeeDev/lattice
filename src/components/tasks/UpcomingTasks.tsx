import { useTasks } from "../../context/TasksContext";
const byDate = ([dateA]: [
    string,
    unknown
], [dateB]: [
    string,
    unknown
]) => new Date(dateA).getTime() - new Date(dateB).getTime();
function UpcomingTasks() {
    const { groupedTasks, checkedTasks } = useTasks();
    return (<section aria-labelledby="upcoming-tasks-heading">
      <div>
        <p>
          Timeline
        </p>
        <h2 id="upcoming-tasks-heading">
          Upcoming tasks
        </h2>
      </div>

      <div>
        {Object.entries(groupedTasks)
            .sort(byDate)
            .map(([date, tasks], index) => (<section key={date}>
              {index !== 0 && <div />}

              <ul>
                {tasks
                .filter((task) => !checkedTasks.includes(task.id))
                .map((task) => (<li key={task.id}>
                      <p>
                        {date}
                      </p>

                      <article>
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                        <p>
                          {task.startTime} - {task.endTime}
                        </p>
                      </article>
                    </li>))}
              </ul>
            </section>))}
      </div>
    </section>);
}
export default UpcomingTasks;
