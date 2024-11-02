import { Fetcher } from 'swr';

export class FetchApiError extends Error {
  public status: number;
  public error: string;

  constructor(statusCode: number, error: string, message: string) {
    super(message);
    this.status = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, FetchApiError.prototype);
  }
}

export type RequestProps = {
  locale?: string;
  token?: string;
  isBlob?: boolean;
  body?: BodyInit | null | any;
} & Omit<RequestInit, 'body'> & { formData?: FormData };

export async function fetchApi(url: string, init?: RequestProps) {
  let headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${init.token}`,
  } as any;

  if (init?.locale) {
    headers = {
      ...headers,
      'Accept-Language': init.locale,
    };
  }

  if (init?.headers) {
    headers = {
      ...init.headers,
      ...headers,
    };
    delete init.headers;
  }

  if (init?.body) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
    init.body = JSON.stringify(init.body);
  } else if (init?.formData) {
    init.body = init.formData;
    delete init.formData;
  }

  return fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api' + url, {
    headers,
    ...(init || {}),
  }).then(async (response) => {
    if (response.status >= 300 || response.status < 200) {
      return response.json().then((errorObject) => {
        throw new FetchApiError(
          errorObject.statusCode,
          errorObject.error,
          errorObject.message,
        );
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else if (init?.isBlob) {
      return response.blob();
    } else {
      return response.text();
    }
  });
}

export type FetcherApi = (
  fetchOptions: {
    token: string;
    locale?: string;
    body?: any;
    haveTo?: boolean;
    withBasePath?: boolean;
  } & RequestInit,
) => Fetcher<any, any>;

export const fetcherApi: FetcherApi =
  ({ locale, body, headers, token, withBasePath, ...options }) =>
  ([subPath, body]) =>
    fetch(
      withBasePath
        ? subPath
        : process.env.NEXT_PUBLIC_BACKEND_URL + '/api' + subPath,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          ...((locale && { 'Accept-Language': locale }) || {}),
          ...(headers || {}),
        },
        ...((body && { method: 'POST', body }) || {}),
        ...options,
      },
    ).then(async (response) => {
      if (response.status >= 300 || response.status < 200) {
        return response.json().then((errorObject) => {
          throw new FetchApiError(
            errorObject.statusCode,
            errorObject.error,
            errorObject.message,
          );
        });
      }

      return response.json();
    });
