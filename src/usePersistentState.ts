import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key);
    if (!storedState) {
      return initialValue;
    }

    try {
      return JSON.parse(storedState) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
