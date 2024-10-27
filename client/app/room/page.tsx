'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Message } from '@/app/_providers/intl/message';
import { CreateRoomForm } from '@/app/room/_components/create-room-form';
import { JoinRoomForm } from '@/app/room/_components/join-room-form';
import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/app/firebase-config';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useAuth } from '@/app/_providers/auth';

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useAuth();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href) && !token) {
      let email = window.localStorage.getItem('emailForSignIn');

      setLoading(true);
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          result.user.getIdTokenResult().then((res) => setToken(res.token));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          router.push('/');
        });
    }
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8.5rem)] px-4 pb-4 w-full items-center justify-center">
      <Tabs defaultValue="createRoom" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="createRoom">
            <Message value="chatRoom.createNew" />
          </TabsTrigger>
          <TabsTrigger value="joinRoom">
            <Message value="chatRoom.joinExisting" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="createRoom">
          <CreateRoomForm />
        </TabsContent>
        <TabsContent value="joinRoom">
          <JoinRoomForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
