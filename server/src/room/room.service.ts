import { UserEntity } from '@domains/user/types';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from '@services/firebase/firebase.service';
import { FirebaseCollections } from '@services/firebase/types';
import { DocumentReference, FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  generateRoomCode = (length: number = 6) => {
    let codeBuilder = '';
    for (let i = 0; i < length; i++) {
      codeBuilder += Math.floor(Math.random() * 10).toString();
    }
    return codeBuilder;
  };

  joinPublicRoom = async (user: UserEntity, roomId: string) => {
    const roomDoc = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .doc(roomId)
      .get();
    if (!roomDoc.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    return await this.joinRoom(user, roomDoc.ref);
  };

  joinPrivateRoom = async (user: UserEntity, code: string) => {
    const roomDocs = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .where('code', '==', code)
      .get();
    if (roomDocs.size !== 1) {
      this.logger.error('data corruption', {
        issue: `found ${roomDocs.size} private rooms by Code<${code}>`,
        rooms: roomDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      });
      throw new InternalServerErrorException(`data corruption`);
    }

    return await this.joinRoom(user, roomDocs.docs[0].ref);
  };

  private joinRoom = async (user: UserEntity, roomRef: DocumentReference) => {
    await this.firebaseService.getDBClient().runTransaction(async (trx) => {
      const userRef = this.firebaseService
        .getDBClient()
        .collection(FirebaseCollections.Users)
        .doc(user.id);

      trx
        .update(roomRef, {
          members: FieldValue.arrayUnion(user.id),
        })
        .update(userRef, {
          rooms: FieldValue.arrayUnion(roomRef.id),
        });
    });

    return await roomRef
      .withConverter(this.firebaseService.roomConverter())
      .get();
  };
}
