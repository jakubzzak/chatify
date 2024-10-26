"use client"

import {useIntl} from "@/app/_providers/intl/intl-provider";
import useSWR, {KeyedMutator, mutate, useSWRConfig} from "swr";
import {PublicConfiguration, ScopedMutator} from "swr/_internal";
import {FetcherApi, fetcherApi} from "@/lib/fetch";

type UseFetchReturn<T> = {
  data: T,
  error: any,
  loading: boolean,
  revalidating: boolean,
  mutate: KeyedMutator<any>
}

type RevalidateOption = { revalidate?: boolean }

export type UseFetchOptions = Partial<Omit<Parameters<FetcherApi>, 'locale'>[0]> & RevalidateOption

export const useFetch = <T, >(
  subPath: string | null,
  {body, ...fetchOptions}: UseFetchOptions = {revalidate: true},
  swrOptions?: Partial<PublicConfiguration>
): UseFetchReturn<T> => {
  const {locale} = useIntl()

  if (fetchOptions.haveTo !== undefined && !fetchOptions.haveTo)
    subPath = null

  let {data, isValidating, isLoading, error, mutate} =
    useSWR(
      subPath && [subPath, body && JSON.stringify(body)],
      fetcherApi({locale, token: fetchOptions.token, ...fetchOptions}),
      {
        ...(fetchOptions.revalidate === false ? {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
        } : {}),
        ...swrOptions
      }
    )

  return {data, loading: isLoading, revalidating: isValidating, error, mutate}
}

export function revalidateFetch(key: string, _mutate: ScopedMutator = mutate) {
  function handleKey(_key: string) {
    let __key = typeof _key === 'string'
      ? _key
      : _key[0]

    return __key.includes(key)
  }

  return _mutate(handleKey)
}

export const useRevalidate = () => {
  const {mutate} = useSWRConfig()

  return (key: string) => revalidateFetch(key, mutate)
}