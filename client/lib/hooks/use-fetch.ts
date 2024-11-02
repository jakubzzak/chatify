'use client';

import { useIntl } from '@/app/_providers/intl/intl-provider';
import useSWR, { KeyedMutator, mutate, useSWRConfig } from 'swr';
import { PublicConfiguration, ScopedMutator } from 'swr/_internal';
import {
  fetchApi,
  FetchApiError,
  FetcherApi,
  fetcherApi,
  RequestProps,
} from '@/lib/fetch';
import { useSessionStorage } from '@/lib/hooks/use-session-storage';
import { useAuth } from '@/app/_providers/auth';
import { useToast } from '@/components/ui/toast/use-toast';

type UseFetchReturn<T> = {
  data: T;
  error: any;
  loading: boolean;
  revalidating: boolean;
  mutate: KeyedMutator<any>;
};

type RevalidateOption = { revalidate?: boolean };

export type UseFetchOptions = Partial<
  Omit<Parameters<FetcherApi>, 'locale'>[0]
> &
  RevalidateOption;

export const useFetcher = () => {
  const mutate = useRevalidate();
  const { token, endSession } = useAuth();
  const { defaultErrorToast, toast } = useToast();

  const errorHandler = (err: FetchApiError) => {
    if (err.status === 401) {
      toast({
        title: 'error.sessionExpired',
        variant: 'info',
      });
      endSession();
    } else if (err.status !== 400) {
      defaultErrorToast();
    }
  };

  const fetcher = async (url: string, init?: RequestProps) => {
    return fetchApi(url, init ? { token, ...init } : { token });
  };

  return { mutate, fetcher, errorHandler };
};

export const useFetch = <T>(
  subPath: string | null,
  { body, ...fetchOptions }: UseFetchOptions = { revalidate: true },
  swrOptions?: Partial<PublicConfiguration>,
): UseFetchReturn<T> => {
  const { locale } = useIntl();
  const [token] = useSessionStorage<string>('token');
  if (fetchOptions.haveTo !== undefined && !fetchOptions.haveTo) subPath = null;

  let { data, isValidating, isLoading, error, mutate } = useSWR(
    subPath && [subPath, body && JSON.stringify(body)],
    fetcherApi({ locale, token: token || fetchOptions.token, ...fetchOptions }),
    {
      ...(fetchOptions.revalidate === false
        ? {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }
        : {}),
      ...swrOptions,
    },
  );

  return {
    data,
    loading: isLoading,
    revalidating: isValidating,
    error,
    mutate,
  };
};

export function revalidateFetch(key: string, _mutate: ScopedMutator = mutate) {
  function handleKey(_key: string) {
    let __key = typeof _key === 'string' ? _key : _key[0];

    return __key.includes(key);
  }

  return _mutate(handleKey);
}

export const useRevalidate = () => {
  const { mutate } = useSWRConfig();

  return (key: string) => revalidateFetch(key, mutate);
};
