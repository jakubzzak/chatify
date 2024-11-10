import { UserEntity } from '@domains/user/types';
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
import { FirebaseCollections, Message, Room, User } from './types';

@Injectable()
export class FirebaseService {
  private client: admin.app.App;

  private logger = new Logger(FirebaseService.name);

  constructor() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_OBJECT;

    this.client = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(Buffer.from(serviceAccount, 'base64').toString('ascii')),
      ),
    });
  }

  authenticateWithEmail = async (authToken: string): Promise<UserEntity> => {
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

  userConverter = () => {
    return {
      toFirestore(user: Omit<User, 'id'>): DocumentData {
        return {
          username: user.username,
          email: user.email,
          pictureUrl: user.pictureUrl,
          rooms: FieldValue.arrayUnion(...user.rooms),
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): User {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          username: data.username,
          email: data.email,
          pictureUrl: data.pictureUrl,
          rooms: data.rooms,
        };
      },
    };
  };

  roomConverter = () => {
    return {
      toFirestore(room: Omit<Room, 'id'>): DocumentData {
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
          encryption: data.encryption,
        };
      },
    };
  };

  messageConverter = () => {
    return {
      toFirestore(payload: Omit<Message, 'id'>): DocumentData {
        return {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...payload,
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): Message {
        const data = snapshot.data();
        const finalCreatedAt = data.createdAt ?? new Date().toISOString();
        return {
          id: snapshot.id,
          createdAt: finalCreatedAt,
          updatedAt: data.updatedAt ?? finalCreatedAt,
          userId: data.userId,
          content: data.content,
        };
      },
    };
  };
}
