import { User } from '@core/decorators/user.decorator';
import { RoomService } from '@domains/room/room.service';
import { UserEntity } from '@domains/user/types';
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ListRoomsArgs } from '@services/graphql/args/list-rooms.args';
import { CreateRoomInput } from '@services/graphql/inputs/create-room.input';
import { JoinRoomInput } from '@services/graphql/inputs/join-room.input';
import { UpdateRoomInput } from '@services/graphql/inputs/update-room.input';
import { UserModel } from '@services/graphql/models';
import { MessageModel } from '@services/graphql/models/message.model';
import { RoomModel } from '@services/graphql/models/room.model';
import { mapMessageResponse } from '@services/graphql/res/message.res';
import { mapRoomResponse } from '@services/graphql/res/room.res';
import { mapUserResponse } from '@services/graphql/res/user.res';
import { FieldPath } from 'firebase-admin/firestore';
import * as crypto from 'node:crypto';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import {
  FirebaseCollections,
  FirebaseRoomSubCollections,
} from 'src/services/firebase/types';

@Resolver(() => RoomModel)
export class RoomsGqlQueryResolver {
  private readonly logger = new Logger(RoomsGqlQueryResolver.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly roomService: RoomService,
  ) {}

  @Query(() => RoomModel)
  async getRoom(@User() user: UserEntity, @Args('roomId') roomId: string) {
    if (!user.rooms.includes(roomId)) {
      throw new ConflictException(`not a member of Room<${roomId}>`);
    }

    const roomDoc = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .doc(roomId)
      .get();

    if (!roomDoc.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    return mapRoomResponse(roomDoc);
  }

  @Query(() => [RoomModel])
  async listRooms(@User() user: UserEntity, @Args() args: ListRoomsArgs) {
    if (args.type === 'member') {
      const roomDocs = await this.firebaseService
        .getDBClient()
        .collection(FirebaseCollections.Rooms)
        .withConverter(this.firebaseService.roomConverter())
        .where(FieldPath.documentId(), 'in', user.rooms)
        .orderBy('name')
        .get();

      return roomDocs.docs.map(mapRoomResponse);
    }

    if (args.type === 'not_member') {
      const roomDocs = await this.firebaseService
        .getDBClient()
        .collection(FirebaseCollections.Rooms)
        .withConverter(this.firebaseService.roomConverter())
        .where('code', '==', null)
        .where(FieldPath.documentId(), 'not-in', user.rooms)
        .orderBy('name')
        .get();

      return roomDocs.docs.map(mapRoomResponse);
    }

    const roomDocs = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .where('code', '==', null)
      .orderBy('name')
      .get();

    return roomDocs.docs.map(mapRoomResponse);
  }

  @Mutation(() => RoomModel)
  async createRoom(
    @User() user: UserEntity,
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
  ) {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048, // can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' }, // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, // whether the key is extractable (i.e. can be used in exportKey)
      ['encrypt', 'decrypt'], // can be any combination of "encrypt" and "decrypt"
    );
    console.log(publicKey, privateKey);

    console.log('encrypting..');
    const encBuff = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      Buffer.from('sending over some message'),
    );
    console.log('encrypted: ', encBuff);

    console.log('decrypting..');
    const decBuff = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encBuff,
    );
    console.log('decrypted: ', new TextDecoder().decode(decBuff));

    const now = new Date().toDateString();
    const roomRef = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .add({
        createdAt: now,
        updatedAt: now,
        name: createRoomInput.name,
        admin: this.firebaseService
          .getDBClient()
          .collection(FirebaseCollections.Users)
          .doc(user.id),
        code: createRoomInput.isPersistent
          ? this.roomService.generateRoomCode()
          : null,
        members: [user.id],
        isPersistent: createRoomInput.isPersistent,
        encryption: {
          privateKey: privateKey as unknown as string,
          publicKey: publicKey as unknown as string,
        },
      });

    const roomDoc = await roomRef.get();
    return mapRoomResponse(roomDoc);
  }

  @Mutation(() => RoomModel)
  async updateRoom(
    @User() user: UserEntity,
    @Args('roomId') roomId: string,
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ) {
    if (!user.rooms.includes(roomId)) {
      throw new ConflictException(`not a member of Room<${roomId}>`);
    }

    if (Object.keys(updateRoomInput).length === 0) {
      throw new BadRequestException('input is empty');
    }

    const roomRef = this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .withConverter(this.firebaseService.roomConverter())
      .doc(roomId);

    const roomDoc = await roomRef.get();
    if (!roomDoc.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }
    if (roomDoc.data().admin !== user.id) {
      throw new ConflictException(`not an admin of Room<${roomId}>`);
    }

    await roomRef.update({
      ...updateRoomInput,
      updatedAt: new Date().toISOString(),
    });

    return mapRoomResponse(roomDoc);
  }

  @Mutation(() => RoomModel)
  async joinRoom(
    @User() user: UserEntity,
    @Args('joinRoomInput') joinRoomInput: JoinRoomInput,
  ) {
    if (!joinRoomInput.roomId && !joinRoomInput.code) {
      throw new BadRequestException(
        "'roomId' or 'code' body param is required",
      );
    }

    if (joinRoomInput.roomId) {
      if (user.rooms?.includes(joinRoomInput.roomId)) {
        throw new ConflictException(
          `already a member of Room<${joinRoomInput.roomId}>`,
        );
      }

      const publicRoomDoc = await this.roomService.joinPublicRoom(
        user,
        joinRoomInput.roomId,
      );
      return mapRoomResponse(publicRoomDoc);
    }

    const privateRoomDoc = await this.roomService.joinPrivateRoom(
      user,
      joinRoomInput.code,
    );
    return mapRoomResponse(privateRoomDoc);
  }

  @ResolveField(() => [UserModel])
  async members(@Parent() room: RoomModel) {
    const users = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users)
      .withConverter(this.firebaseService.userConverter())
      .where(FieldPath.documentId(), 'in', room.members)
      .get();

    return users.docs.map(mapUserResponse);
  }

  @ResolveField(() => [MessageModel])
  async messages(@Parent() room: RoomModel) {
    const messageDocs = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(room.id)
      .collection(FirebaseRoomSubCollections.Messages)
      .withConverter(this.firebaseService.messageConverter())
      .orderBy('createdAt')
      .get();

    return messageDocs.docs.map(mapMessageResponse);
  }

  @ResolveField(() => MessageModel)
  async lastMessage(@Parent() room: RoomModel) {
    const messageDocs = await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(room.id)
      .collection(FirebaseRoomSubCollections.Messages)
      .withConverter(this.firebaseService.messageConverter())
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (messageDocs.docs.length === 0) {
      return null;
    }

    return mapMessageResponse(messageDocs.docs[0]);
  }
}
