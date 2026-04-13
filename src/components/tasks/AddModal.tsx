import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useTasks } from "../../context/TasksContext";
import { getEmptyTaskForm } from "../../hooks/useTasks";
import {
  taskSchema,
  type TaskFormValues,
} from "../../lib/taskSchema";
import AddModalFormFields from "./AddModalFormFields";
import { Button, IconButton, Modal } from "../ui";

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
    defaultValues: getEmptyTaskForm(),
  });

  useEffect(() => {
    reset(currentTask ?? getEmptyTaskForm());
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
      className="sm:max-w-xl"
      onClose={handleCloseModal}
      open
      title={isEditing ? "Edit task" : "New task"}
    >
      <div className="-mt-1 mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {isEditing ? "Update details" : "Quick add"}
          </p>
        </div>
        <IconButton aria-label="Close task dialog" onClick={handleCloseModal} size="sm">
          <X aria-hidden="true" className="h-4 w-4" />
        </IconButton>
      </div>

      <form className="flex flex-1 flex-col space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <AddModalFormFields
          errors={errors}
          register={register}
          selectedPriority={selectedPriority}
          setValue={setValue}
        />

        <div className="mt-auto flex justify-end gap-3 pt-2">
          <Button onClick={handleCloseModal} type="button" variant="ghost">
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddModal;
