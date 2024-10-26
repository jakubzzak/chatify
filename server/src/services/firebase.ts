import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT;

const firebaseClient = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount ?? '{}')),
});

