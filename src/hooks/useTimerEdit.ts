import { useState } from "react";
import { timerSchema } from "../lib/timerSchema";
import { useTimeTracker } from "../context/TimeTrackerContext";

type UseTimerEditReturn = {
  editMinutes: string;
  editError: string;
  setEditMinutes: (value: string) => void;
  handleToggleEdit: () => void;
  handleSaveEditedTime: () => void;
};

export function useTimerEdit(): UseTimerEditReturn {
  const { totalSeconds, isEditing, toggleEdit, handleUpdateTime } = useTimeTracker();
  const [editMinutes, setEditMinutes] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  const handleToggleEdit = (): void => {
    if (!isEditing) {
      setEditMinutes(String(Math.floor(totalSeconds / 60)));
    } else {
      setEditError("");
    }
    toggleEdit();
  };

  const handleSaveEditedTime = (): void => {
    const parsed = timerSchema.safeParse({ minutes: editMinutes });
    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? "Invalid time");
      return;
    }
    setEditError("");
    handleUpdateTime(parsed.data.minutes);
  };
  return { editMinutes, editError, setEditMinutes, handleToggleEdit, handleSaveEditedTime };
}
