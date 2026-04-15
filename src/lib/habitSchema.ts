import { z } from "zod";

const HABIT_NAME_MIN = 2;
const HABIT_NAME_MAX = 50;

export const habitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(HABIT_NAME_MIN, `Habit name must be at least ${HABIT_NAME_MIN} characters`)
    .max(HABIT_NAME_MAX, `Habit name cannot exceed ${HABIT_NAME_MAX} characters`),
  frequency: z.enum(["daily", "weekly", "custom"]),
  frequencyDays: z.array(z.number().int().min(0).max(6)).optional(),
  targetPerWeek: z.number().int().min(1, "Must be at least 1").max(7, "Cannot exceed 7").optional(),
  streakGoal: z.number().int().min(1, "Must be at least 1").optional(),
});

export type HabitFormValues = z.infer<typeof habitSchema>;

/**
 * Returns a schema that additionally rejects duplicate names.
 * Pass `currentName` when editing so the existing name isn't flagged.
 */
export function makeHabitSchema(existingNames: string[], currentName?: string) {
  return habitSchema.refine(
    ({ name }) => {
      const trimmed = name.toLowerCase();
      const lowerCurrent = (currentName ?? "").trim().toLowerCase();
      return !existingNames.some(
        (n) => n.trim().toLowerCase() !== lowerCurrent && n.trim().toLowerCase() === trimmed
      );
    },
    { message: "A habit with this name already exists", path: ["name"] }
  );
}
