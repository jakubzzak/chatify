'use client';

import { useState } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

type UseSessionStorage<T> = {
  parse?: boolean;
  defaultValue?: T;
  stringify?: boolean;
};

export function useSessionStorage<T>(
  key: string,
  props?: UseSessionStorage<T>,
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState(() => {
    const defaultValue = props?.defaultValue ? (props.defaultValue as T) : null;

    try {
      if (typeof window !== undefined) {
        const item = window.sessionStorage.getItem(key);

        if (props?.parse === true) {
          const value = item ? (JSON.parse(item) as T) : defaultValue;

          if (props?.stringify) {
            window.sessionStorage.setItem(key, JSON.stringify(value));
          } else {
            window.sessionStorage.setItem(key, value as string);
          }
        } else {
          if (props?.stringify) {
            window.sessionStorage.setItem(key, JSON.stringify(item));
          } else {
            window.sessionStorage.setItem(key, item);
          }
          return item as T;
        }
      }
      return defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  const setValue: SetValue<T> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== undefined)
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
