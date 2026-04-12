import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "../../context/TasksContext";
import {
  EMPTY_TASK_FORM,
} from "../../hooks/useTasks";
import {
  PRIORITY_OPTIONS,
  taskSchema,
  type TaskFormValues,
} from "../../lib/taskSchema";

function AddModal() {
  const {
    currentTask,
    handleCloseModal,
    handleTaskAddition,
    handleTaskSave,
    isEditing,
  } = useTasks();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: EMPTY_TASK_FORM,
  });

  useEffect(() => {
    reset(currentTask ?? EMPTY_TASK_FORM);
  }, [currentTask, reset]);

  const selectedPriority = watch("priority");

  const onSubmit = (values: TaskFormValues) => {
    if (isEditing) {
      handleTaskSave(values);
      return;
    }

    handleTaskAddition(values);
  };

  return (
    <div>
      <div>
        <div>
          <button onClick={handleCloseModal} type="button">
            <span>Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label htmlFor="task-name">Let's Get Started on a New To-Do!</label>
              <input
                id="task-name"
                type="text"
                placeholder="ToDo name:"
                {...register("name")}
              />
              {errors.name && <p>{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="task-description">Description of your to-do list:</label>
              <input
                id="task-description"
                type="text"
                placeholder="Enter Description"
                {...register("description")}
              />
              {errors.description && <p>{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="task-date">When are you planning to handle this?</label>
              <input id="task-date" type="date" {...register("date")} />
              {errors.date && <p>{errors.date.message}</p>}
            </div>

            <div>
              <label htmlFor="task-start-time">When will you begin?</label>
              <input id="task-start-time" type="time" {...register("startTime")} />
              {errors.startTime && <p>{errors.startTime.message}</p>}
            </div>

            <div>
              <label htmlFor="task-end-time">When will you be done?</label>
              <input id="task-end-time" type="time" {...register("endTime")} />
              {errors.endTime && <p>{errors.endTime.message}</p>}
            </div>

            <div>
              <p>Please choose a priority tag:</p>
              <input type="hidden" {...register("priority")} />
              <div>
                {PRIORITY_OPTIONS.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setValue("priority", priority, { shouldValidate: true })}
                    type="button"
                    aria-pressed={selectedPriority === priority}
                  >
                    {priority} Priority
                  </button>
                ))}
              </div>
              {errors.priority && <p>{errors.priority.message}</p>}
            </div>
          </div>

          <div>
            <button type="submit">
              {isEditing ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
