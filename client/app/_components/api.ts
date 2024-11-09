'use server';

import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function setCookie(
  key: string,
  value: string,
  cookie?: Partial<ResponseCookie>,
) {
  cookies().set(key, value, {});
}
