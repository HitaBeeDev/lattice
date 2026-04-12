import { z } from "zod";

const TIMER_MIN_MINUTES = 1;
const TIMER_MAX_MINUTES = 99;

export const timerSchema = z.object({
  minutes: z.coerce
    .number()
    .int("Please enter a whole number")
    .min(TIMER_MIN_MINUTES, `Minimum ${TIMER_MIN_MINUTES} minute`)
    .max(TIMER_MAX_MINUTES, `Maximum ${TIMER_MAX_MINUTES} minutes`),
});

export type TimerFormValues = z.infer<typeof timerSchema>;
