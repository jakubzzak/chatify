'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSessionStorage } from '@/lib/hooks/use-session.storage';
import { useRouter } from 'next/navigation';

type AuthProviderState = {
  token: string | null;
  setToken: (locale: string) => void;
  endSession: () => void;
};

const initialState = {
  token: null,
  setToken: () => null,
  endSession: () => null,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useSessionStorage<string>('token', {
    stringify: false,
    parse: false,
  });
  const router = useRouter();

  const endSession = () => {
    window.sessionStorage.removeItem('token');

    router.push('/tool');
  };

  return (
    <AuthProviderContext.Provider value={{ token, setToken, endSession }}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error('useAuth must be used within a IntlProvider');

  return context;
};
