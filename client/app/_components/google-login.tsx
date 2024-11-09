'use client';

import { Button } from '@/components/ui/button';
import { Message } from '@/app/_providers/intl/message';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { auth } from '@/app/firebase-config';
import GoogleIcon from '@/public/google.png';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStorage } from '@/lib/hooks/use-session-storage';
import { setCookie } from '@/app/_components/api';

export function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [, setToken] = useSessionStorage('token');

  const onSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    await signInWithPopup(auth, provider)
      .then(async (res) => {
        const result = await res.user.getIdTokenResult();

        await setCookie('token', result.token, {
          expires: new Date(result.expirationTime),
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        setToken(result.token);
        router.push('/rooms');
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Button
      onClick={onSignIn}
      type="submit"
      loading={loading}
      variant="outline">
      <Image src={GoogleIcon} alt="Google icon" height="20" width="20" />
      <Message value="signIn.google" />
    </Button>
  );
}
