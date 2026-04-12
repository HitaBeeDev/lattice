import { useTasks } from "../../context/TasksContext";

const byDate = ([dateA]: [string, unknown], [dateB]: [string, unknown]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

function UpcomingTasks() {
  const { groupedTasks, checkedTasks } = useTasks();

  return (
    <section
      aria-labelledby="upcoming-tasks-heading"
      className="app-card"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
          Timeline
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950" id="upcoming-tasks-heading">
          Upcoming tasks
        </h2>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTasks)
          .sort(byDate)
          .map(([date, tasks], index) => (
            <section key={date}>
              {index !== 0 && <div className="mb-6 border-t border-slate-100" />}

              <ul className="space-y-3">
                {tasks
                  .filter((task) => !checkedTasks.includes(task.id))
                  .map((task) => (
                    <li key={task.id}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {date}
                      </p>

                      <article className="rounded-[1.5rem] border border-black/5 bg-white/60 p-4">
                        <h3 className="font-semibold text-slate-900">{task.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                        <p className="mt-2 text-sm text-slate-700">
                          {task.startTime} - {task.endTime}
                        </p>
                      </article>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
      </div>
    </section>
  );
}

export default UpcomingTasks;
