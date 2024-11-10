import { initializeApp } from '@firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = JSON.parse(
  Buffer.from(process.env.NEXT_PUBLIC_FIREBASE_CONFIG, 'base64').toString(
    'ascii',
  ),
);

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
