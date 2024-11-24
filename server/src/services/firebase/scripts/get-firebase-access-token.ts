/* eslint-disable no-console */
import { exec as execMacProcess } from 'child_process';
import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

dotenv.config();

const email = process.env.FIREBASE_LOCAL_AUTH_EMAIL;
const password = process.env.FIREBASE_LOCAL_AUTH_PASS;
const apiKey = process.env.FIREBASE_API_KEY;
const base64AccountObject = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT,
  'base64',
).toString('ascii');
const projectId = JSON.parse(base64AccountObject).project_id;

const app = initializeApp({ apiKey, projectId }, 'local-auth-script');
const auth = getAuth(app);

export const copyToClipboard = (input: string) => {
  execMacProcess(`echo "${input}" | pbcopy`, (err, stdout, stderr) => {
    if (err || stderr) {
      console.error(err);
      console.error(stderr);
      return;
    }
    console.log(stdout);
  });
};

const generateToken = async () => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const isEmailVerified = user.emailVerified;
    const token = await user.getIdToken();

    console.log(
      `generated token for User<${email}>`,
      isEmailVerified ? '' : ', email is not verified',
    );
    copyToClipboard(token.trim());
    console.log('token copied to clipboard');
  } catch (error) {
    console.error(
      `token generation failed with Code<${error.code}>;`,
      error.message,
    );
  }
};

generateToken();
