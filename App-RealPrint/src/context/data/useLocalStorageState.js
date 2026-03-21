import { useEffect, useState } from "react";

/**
 * Estado React persistido en localStorage con API minima.
 * Reduce repeticion de useState + useEffect en DataContext.
 */
export function useLocalStorageState(storageKey, fallbackValue, options = {}) {
  const { onRead } = options;

  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallbackValue;

    try {
      const parsed = JSON.parse(raw);
      return onRead ? onRead(parsed, fallbackValue) : parsed;
    } catch {
      return fallbackValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
}

