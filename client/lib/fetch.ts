import {Fetcher} from "swr";
import {ServerError} from "@/lib/errors";

export class FetchApiError extends Error {
  public code: string
  public status: number
  public errors: any

  constructor(code: string, status: number, message: string, errors?: any) {
    super(message)
    this.code = code
    this.status = status
    this.errors = errors
    Object.setPrototypeOf(this, FetchApiError.prototype)
  }
}

export type RequestProps = {
  locale?: string
  token?: string,
  isBlob?: boolean,
  body?: BodyInit | null | any
} & Omit<RequestInit, "body"> & { formData?: FormData }

export async function fetchApi(url: string, init?: RequestProps) {
  let headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${init.token}`
  } as any

  if (init?.locale) {
    headers = {
      ...headers,
      'Accept-Language': init.locale
    }
  }

  if (init?.headers) {
    headers = {
      ...init.headers,
      ...headers
    }
    delete init.headers
  }

  if (init?.body) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    }
    init.body = JSON.stringify(init.body)
  } else if (init?.formData) {
    init.body = init.formData
    delete init.formData
  }

  if (!init.credentials) {
    init.credentials = 'include'
  }

  return fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api" + url, {
    headers,
    ...(init || {})
  }).then(async (response) => {
    if (response.status === 401) {
      throw new FetchApiError(ServerError.UNAUTHORIZED, response.status, `Unauthorized`)
    }

    if (response.status >= 300 || response.status < 200) {
      if (response.status === 400)
        return response.json().then(errorObject => {
          throw new FetchApiError(errorObject.code, response.status, errorObject.message, errorObject?.errors)
        })

      throw new FetchApiError('NO_CODE', response.status, `status ${response.status}`)
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    } else if (init?.isBlob) {
      return response.blob()
    } else {
      return response.text()
    }
  })
}

export type FetcherApi =
  (fetchOptions: {
    token: string,
    locale?: string,
    body?: any,
    haveTo?: boolean,
    withBasePath?: boolean,
  } & RequestInit) => Fetcher<any, any>

export const fetcherApi: FetcherApi = ({ locale, body, headers, token, withBasePath, ...options }) =>
  ([subPath, body]) =>
    fetch(withBasePath ? subPath : process.env.NEXT_PUBLIC_BACKEND_URL + "/api" + subPath, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...((locale && { 'Accept-Language': locale }) || {}),
        ...(headers || {})
      },
      ...((body && { method: 'POST', body }) || {}),
      ...options
    })
      .then(async (response) => {
        if (response.status === 401) {
          throw new FetchApiError(ServerError.UNAUTHORIZED, response.status, `Unauthorized`)
        }

        if (response.status >= 300 || response.status < 200) {
          if (response.status == 400)
            return response.json().then(errorObject => {
              throw new FetchApiError(errorObject.code, response.status, errorObject.message)
            })

          throw new FetchApiError('NO_CODE', response.status, `status ${response.status}`)
        }

        return response.json()
      })


