import { useState, useCallback, useRef } from "react";

export const useDelaySetState = <T>(
  delay: number,
  defaultValue: T
): [T, (value: T, immediate?: boolean) => void] => {
  const [value, set] = useState<T>(defaultValue);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(-1);

  const update = useCallback(
    (newValue: T, immediate: boolean = false) => {
      clearTimeout(timerRef.current);
      if (immediate) {
        set(newValue);
      } else {
        timerRef.current = setTimeout(() => {
          set(newValue);
        }, delay);
      }
    },
    [delay]
  );

  return [value, update];
};
