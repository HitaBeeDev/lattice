import { Clock3 } from "lucide-react";
import { useTasks } from "../../context/TasksContext";

const byDate = ([dateA]: [string, unknown], [dateB]: [string, unknown]) =>
  new Date(dateA).getTime() - new Date(dateB).getTime();

function UpcomingTasks() {
  const { groupedTasks, checkedTasks } = useTasks();

  return (
    <section aria-labelledby="upcoming-tasks-heading" className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d929c]">
          Timeline
        </p>
        <h2
          className="mt-2 font-['Sora'] text-[1.8rem] font-[500] text-[#101820]"
          id="upcoming-tasks-heading"
        >
          Upcoming tasks
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Object.entries(groupedTasks)
          .sort(byDate)
          .map(([date, tasks]) => (
            <section
              className="rounded-[2rem] border border-white/70 bg-[rgba(242,249,249,0.8)] p-5 shadow-[0_18px_55px_rgba(80,111,122,0.1)] backdrop-blur-xl"
              key={date}
            >
              <div className="mb-4 rounded-[1.35rem] bg-white/70 px-4 py-3">
                <p className="text-sm font-medium text-[#1b2830]">{date}</p>
              </div>

              <ul className="grid gap-4">
                {tasks
                  .filter((task) => !checkedTasks.includes(task.id))
                  .map((task) => (
                    <li key={task.id}>
                      <article className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_12px_28px_rgba(96,120,130,0.08)]">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-['Sora'] text-lg font-[500] text-[#101820]">
                            {task.name}
                          </h3>
                        </div>

                        {task.description ? (
                          <p className="text-sm leading-6 text-[#637983]">
                            {task.description}
                          </p>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#607680]">
                          <div className="inline-flex items-center gap-2 rounded-full bg-[#f2f7f8] px-3 py-2">
                            <Clock3 className="h-4 w-4" />
                            <span>
                              {task.startTime}
                              {task.endTime ? ` - ${task.endTime}` : ""}
                            </span>
                          </div>
                        </div>
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
