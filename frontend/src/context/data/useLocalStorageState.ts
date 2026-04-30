import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface UseLocalStorageOptions<T> {
  onRead?: (parsed: unknown, fallbackValue: T) => T;
}

/**
 * Estado React persistido en localStorage con API minima.
 * Reduce repeticion de useState + useEffect en DataContext.
 */
export function useLocalStorageState<T>(
  storageKey: string,
  fallbackValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const { onRead } = options;

  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallbackValue;

    try {
      const parsed = JSON.parse(raw);
      return onRead ? onRead(parsed, fallbackValue) : (parsed as T);
    } catch {
      return fallbackValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
}


