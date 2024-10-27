import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseCollections } from './types';

@Injectable()
export class FirebaseService {
  private client: admin.app.App;

  constructor() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT;

    this.client = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount ?? '{}')),
    });
  }

  authenticateWithEmail = async (authToken: string) => {
    const decodedIdToken = await this.client.auth().verifyIdToken(authToken);
    if (!decodedIdToken.email) {
      throw new NotAcceptableException('login without email');
    }

    const userSnapshot = await this.getDBClient()
      .collection(FirebaseCollections.Users)
      .doc(decodedIdToken.uid)
      .get();
    if (!userSnapshot.exists) {
      await this.getDBClient()
        .collection(FirebaseCollections.Users)
        .doc(decodedIdToken.uid)
        .set({
          username: null,
          rooms: [],
        });
    }
  };

  getDBClient = () => {
    return this.client.firestore();
  };
}
