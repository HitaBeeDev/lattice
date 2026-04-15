import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "../../context/TasksContext";
import { getEmptyTaskForm } from "../../hooks/useTasks";
import { taskSchema, type TaskFormValues } from "../../lib/taskSchema";
import AddModalFormFields from "./AddModalFormFields";
import { Modal } from "../ui";

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
      onClose={handleCloseModal}
      open
      title={isEditing ? "Edit task" : "New task"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <AddModalFormFields
          errors={errors}
          register={register}
          selectedPriority={selectedPriority}
          setValue={setValue}
        />

        <div className="flex items-center justify-end gap-2 px-6 py-5 border-t border-[#f0f5f6]">
          <button
            type="button"
            onClick={handleCloseModal}
            className="h-9 px-4 rounded-full text-[0.75rem] font-[400] text-[#a0a5ab] hover:text-[#161c22] hover:bg-[#f5f8f9] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 px-5 rounded-full bg-[#161c22] text-white text-[0.75rem] font-[400] hover:bg-[#2a3340] transition"
          >
            {isEditing ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddModal;
