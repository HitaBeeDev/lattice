import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "../../context/TasksContext";
import { EMPTY_TASK_FORM } from "../../hooks/useTasks";
import {
  taskSchema,
  type TaskFormValues,
} from "../../lib/taskSchema";
import AddModalFormFields from "./AddModalFormFields";
import { Button, IconButton, Modal, Tooltip } from "../ui";

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
    <Modal
      description="Create a new task or update an existing one with schedule and priority details."
      onClose={handleCloseModal}
      open
      title={isEditing ? "Edit task" : "Add a new task"}
    >
      <div className="mb-4 flex justify-end">
        <Tooltip content="Close dialog">
          <IconButton aria-label="Close task dialog" onClick={handleCloseModal} size="sm">
            <span aria-hidden="true">×</span>
          </IconButton>
        </Tooltip>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <AddModalFormFields
          errors={errors}
          register={register}
          selectedPriority={selectedPriority}
          setValue={setValue}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {isEditing ? "Save Changes" : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddModal;
