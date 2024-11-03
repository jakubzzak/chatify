import { Room } from '@core/types';
import { UserEntity } from '@domains/user/types';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from '@services/firebase/firebase.service';
import { FirebaseCollections } from '@services/firebase/types';
import { DocumentSnapshot, FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class RoomService {
  constructor(private readonly firebaseService: FirebaseService) {}

  generateRoomCode = (length: number = 6) => {
    let codeBuilder = '';
    for (let i = 0; i < length; i++) {
      codeBuilder += Math.floor(Math.random() * 10).toString();
    }
    return codeBuilder;
  };

  joinPublicRoom = async (user: UserEntity, roomId: string) => {
    return await this.joinRoom(user, roomId);
  };

  joinPrivateRoom = async (user: UserEntity, code: string) => {
    const roomDocument = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .where('code', '==', code)
      .get();

    if (roomDocument.empty) {
      throw new NotFoundException(`Room<code:${code}> not found`);
    }
    if (roomDocument.docs.length > 1) {
      throw new InternalServerErrorException(
        `More than one Room<code:${code}> found`,
      );
    }

    return await this.joinRoom(user, roomDocument.docs[0].id);
  };

  private joinRoom = async (
    user: UserEntity,
    roomId: string,
  ): Promise<DocumentSnapshot<Omit<Room, 'id' | 'messages'>>> => {
    return await this.firebaseService
      .getDBClient()
      .runTransaction(async (trx) => {
        const roomRef = this.firebaseService
          .getDBClient()
          .collection(FirebaseCollections.Rooms)
          .withConverter(this.firebaseService.roomConverter())
          .doc(roomId);
        const roomDoc = await trx.get(roomRef);
        if (!roomDoc.exists) {
          throw new NotFoundException(`Room<${roomId}> not found`);
        }

        if (roomDoc.data().members.includes(user.id)) {
          throw new ConflictException('already a member');
        }

        const userRef = this.firebaseService
          .getDBClient()
          .collection(FirebaseCollections.Users)
          .doc(user.id);

        trx
          .update(roomRef, {
            members: FieldValue.arrayUnion(user.id),
          })
          .update(userRef, {
            rooms: FieldValue.arrayUnion(roomId),
          });

        roomDoc.data().members.push(user.id);
        return roomDoc;
      });
  };
}
