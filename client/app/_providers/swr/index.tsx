'use client';

import { SWRConfig } from '@/app/_providers/swr/SWRConfig';
import { useRouter } from 'next/navigation';

export const SWRProvider = ({ children }) => {
  const router = useRouter();

  function endSession() {
    window.sessionStorage.removeItem('token');
    router.push('/');
  }

  return <SWRConfig onUnauthorized={endSession}>{children}</SWRConfig>;
};
