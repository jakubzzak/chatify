import { User } from '@core/types';
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

  authenticateWithEmail = async (authToken: string): Promise<User> => {
    if (!authToken) {
      throw new NotAcceptableException('missing auth token');
    }

    const decodedIdToken = await this.client.auth().verifyIdToken(authToken);
    if (!decodedIdToken.email) {
      throw new NotAcceptableException('login without email');
    }

    const userSnapshot = await this.getDBClient()
      .collection(FirebaseCollections.Users)
      .doc(decodedIdToken.uid)
      .get();

    if (userSnapshot.exists) {
      return {
        id: userSnapshot.id,
        username: userSnapshot.data().username,
        pictureUrl: userSnapshot.data().pictureUrl,
        email: userSnapshot.data().email,
        rooms: userSnapshot.data().rooms,
      };
    }

    const newUserPayload = {
      id: decodedIdToken.uid,
      username: decodedIdToken.name,
      pictureUrl: decodedIdToken.picture,
      email: decodedIdToken.email,
      rooms: [],
    };
    await this.getDBClient()
      .collection(FirebaseCollections.Users)
      .doc(decodedIdToken.uid)
      .set(newUserPayload);
    return newUserPayload;
  };

  getDBClient = () => {
    return this.client.firestore();
  };
}
