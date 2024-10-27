import { initializeApp } from '@firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD2i5M5aadFAA_agiEaDik174OSZc0quu0',
  authDomain: 'chatify-2024-10.firebaseapp.com',
  projectId: 'chatify-2024-10',
  storageBucket: 'chatify-2024-10.appspot.com',
  messagingSenderId: '884674076348',
  appId: '1:884674076348:web:fcb8807aa923ec8e383ab9',
  measurementId: 'G-DK7SFFLDCV',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
