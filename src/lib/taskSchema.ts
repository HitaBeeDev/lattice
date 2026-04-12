import { z } from "zod";
import { TASK_PRIORITIES } from "../types/task";

export const PRIORITY_OPTIONS = TASK_PRIORITIES;

export const taskSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Task name is required")
      .max(100, "Task name cannot exceed 100 characters"),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(500, "Description cannot exceed 500 characters"),
    date: z
      .string()
      .min(1, "Date is required")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Please enter a valid date",
      }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    priority: z.enum(PRIORITY_OPTIONS),
  })
  .refine(
    (data) =>
      !data.startTime || !data.endTime || data.endTime > data.startTime,
    { message: "End time must be after start time", path: ["endTime"] }
  );

export type TaskFormValues = z.infer<typeof taskSchema>;
