import { useEffect, useState } from "react";

/**
 * Returns the current time and refreshes it on the provided interval.
 */
export function useCurrentTime(tickIntervalMs: number): Date {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, tickIntervalMs);

    return () => {
      clearInterval(timeInterval);
    };
  }, [tickIntervalMs]);

  return currentTime;
}
