import { Message, Room, User } from '@core/types';
import {
  Injectable,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { FirebaseCollections } from './types';

@Injectable()
export class FirebaseService {
  private client: admin.app.App;

  private logger = new Logger(FirebaseService.name);

  constructor() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT;

    this.client = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount ?? '{}')),
    });
  }

  authenticateWithEmail = async (authToken: string): Promise<User> => {
    let decodedIdToken;
    try {
      decodedIdToken = await this.client.auth().verifyIdToken(authToken);
    } catch (error) {
      this.logger.warn('firebase.verifyIdToken failed', {
        error,
      });
      throw new UnauthorizedException();
    }

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

  roomConverter = () => {
    return {
      toFirestore(room: Omit<Room, 'id' | 'messages'>): DocumentData {
        return {
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          name: room.name,
          admin: room.admin,
          code: room.code,
          isPersistent: room.isPersistent,
          members: FieldValue.arrayUnion(...room.members),
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): Room {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          name: data.name,
          admin: data.admin,
          code: data.code,
          isPersistent: data.isPersistent,
          members: data.members,
          messages: data.messages,
        };
      },
    };
  };

  messageConverter = () => {
    return {
      toFirestore(message: Omit<Message, 'id'>): DocumentData {
        return {
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          userId: message.userId,
          content: message.content,
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): Message {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          userId: data.userId,
          content: data.content,
        };
      },
    };
  };
}
