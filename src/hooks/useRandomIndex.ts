import { useState } from "react";

/**
 * Returns a stable random index in [0, length) chosen once on mount.
 * Use this instead of a rotating interval timer for quotes, articles,
 * or any list where "show a random item per visit" is the right behaviour.
 */
export function useRandomIndex(length: number): number {
  const [index] = useState(() =>
    length > 0 ? Math.floor(Math.random() * length) : 0
  );
  return index;
}
