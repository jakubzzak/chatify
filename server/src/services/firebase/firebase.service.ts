import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

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
      throw new Error('login without email');
    }
  };

  getDBClient = () => {
    return this.client.firestore();
  };
}
