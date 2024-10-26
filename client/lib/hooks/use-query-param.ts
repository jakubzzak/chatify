"use client"

import {useCallback, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export function useQueryParam(key: string, defaultValue?: string) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const getValue = () => {
    if (searchParams.has(key)) {
      return searchParams.get(key) as string
    }
    return defaultValue
  }

  const [state, setState] = useState(getValue)

  useEffect(() => {
    setState(getValue())
  }, [searchParams]);

  const update = (value: ((prev: string) => string) | string) => {
    if (typeof value === "function") {
      const result = value(state)
      router.push(pathname + "?" + createQueryString(key, result))
    } else {
      router.push(pathname + "?" + createQueryString(key, value))
    }
  }

  return {
    update,
    state
  }
}