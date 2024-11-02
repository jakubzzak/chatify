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
import { FieldValue } from 'firebase-admin/firestore';

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

  joinPublicRoom = async (user: UserEntity, roomId: string): Promise<Room> => {
    return await this.joinRoom(user, roomId);
  };

  joinPrivateRoom = async (user: UserEntity, code: string): Promise<Room> => {
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
  ): Promise<Room> => {
    console.log('joining room', roomId);
    return await this.firebaseService
      .getDBClient()
      .runTransaction(async (trx) => {
        const roomRef = this.firebaseService
          .getDBClient()
          .collection(FirebaseCollections.Rooms)
          .doc(roomId);
        const roomDocument = await trx.get(roomRef);
        if (!roomDocument.exists) {
          throw new NotFoundException(`Room<${roomId}> not found`);
        }

        const room = { ...roomDocument.data(), id: roomDocument.id } as Room;
        if (room.members.includes(user.id)) {
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

        return {
          ...room,
          members: [...room.members, user.id],
        };
      });
  };
}
