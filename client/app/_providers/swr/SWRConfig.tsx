import {SWRConfig as SWR} from 'swr'

const PI = 3.141

const config = {
  refreshInterval: PI * 60 * 1000,
  revalidateOnFocus: false,
  revalidateOnMount: true,
  revalidateOnReconnect: true,

  dedupingInterval: PI * 1000,
  keepPreviousData: true,

  shouldRetryOnError: false,
} as Parameters<typeof SWR>[0]['value']

export const SWRConfig = ({children, onUnauthorized}) => {

  const onError = (err) => {
    if (err.status == 401) {
      onUnauthorized()
    }
  }

  return <SWR value={{...config, onError}}>
    {children}
  </SWR>
}