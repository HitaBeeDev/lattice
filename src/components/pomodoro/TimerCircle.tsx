import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTimeTracker } from "../../context/TimeTrackerContext";
import {
  timerSchema,
  type TimerFormValues,
} from "../../lib/timerSchema";

type TimerFormInput = z.input<typeof timerSchema>;

function TimerCircle() {
  const {
    totalSeconds,
    isEditing,
    handleUpdateTime,
    radius,
  } = useTimeTracker();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimerFormInput, undefined, TimerFormValues>({
    resolver: zodResolver(timerSchema),
    defaultValues: { minutes: Math.floor(totalSeconds / 60) },
  });

  useEffect(() => {
    if (isEditing) {
      reset({ minutes: Math.floor(totalSeconds / 60) });
    }
  }, [isEditing, reset, totalSeconds]);

  const onSubmit = (values: TimerFormValues) => {
    handleUpdateTime(values.minutes);
    reset({ minutes: values.minutes });
  };

  return (
    <div>
      <svg width="400" height="400" viewBox="0 0 200 200">
        <circle
          stroke="#424874"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="5"
          fill="transparent"
        />

        <circle
          stroke="#FFD1D1"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="9"
          fill="transparent"
        />

        {isEditing ? (
          <>
            <foreignObject x="55" y="78" width="120" height="70">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="number"
                  min={1}
                  max={99}
                  placeholder="Enter minutes"
                  {...register("minutes")}
                />
                {errors.minutes && <p>{errors.minutes.message}</p>}
                <button type="submit">Save</button>
              </form>
            </foreignObject>
          </>
        ) : (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
          >
            {`${Math.floor(totalSeconds / 60)}:${
              totalSeconds % 60 < 10 ? "0" : ""
            }${totalSeconds % 60}`}
          </text>
        )}
      </svg>
    </div>
  );
}

export default TimerCircle;
