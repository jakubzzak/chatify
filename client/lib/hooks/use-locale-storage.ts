"use client"

import {useState} from "react"

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== undefined) {
        const item = window.localStorage.getItem(key)
        const value = item ? JSON.parse(item) as T : initialValue
        window.localStorage.setItem(key, JSON.stringify(value))
        return value
      }
      return initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue: SetValue<T> = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== undefined) window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}