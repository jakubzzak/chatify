'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSessionStorage } from '@/lib/hooks/use-session-storage';
import { useParams, useRouter } from 'next/navigation';
import { useFetch } from '@/lib/hooks/use-fetch';
import Loading from '@/app/loading';
import { signOut } from '@firebase/auth';
import { auth } from '@/app/firebase-config';
import { useSocket } from '@/app/rooms/[id]/_components/use-socket';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Room } from '@/app/rooms/_components/schema';

type AuthProviderState = {
  token: string | null;
  setToken: (locale: string) => void;
  endSession: () => Promise<any>;
  user: User;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const initialState = {
  token: null,
  setToken: () => null,
  endSession: () => null,
  user: null,
  socket: null,
};

export type User = {
  id: string;
  username: string;
  pictureUrl: string;
  email: string;
  rooms: Omit<Room, 'members'>[];
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useSessionStorage<string>('token', {
    stringify: false,
    parse: false,
  });
  const router = useRouter();
  const { data: user, loading } = useFetch<User>('/profile');
  const params = useParams();

  const { socket } = useSocket({
    autoConnect: false,
    query: { roomId: params.id },
    auth: { token },
  });

  const endSession = async () => {
    return signOut(auth).then(() => {
      window.sessionStorage.removeItem('token');
      router.push('/');
    });
  };

  return (
    <AuthProviderContext.Provider
      value={{ token, setToken, endSession, user, socket }}>
      {loading ? <Loading /> : children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error('useAuth must be used within a IntlProvider');

  return context;
};
