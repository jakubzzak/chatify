import { User } from '@core/decorators/user.decorator';
import { RoomResponse } from '@domains/room/responses/room.res';
import { UserEntity } from '@domains/user/types';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import {
  mapRoomDocToRoomResponse,
  mapRoomToRoomResponse,
} from './mappers/room.mapper';
import { RoomService } from './room.service';

@Controller({ path: '/api/rooms' })
@ApiTags('room')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  private roomsCollection: FirebaseFirestore.CollectionReference;
  private usersCollection: FirebaseFirestore.CollectionReference;

  constructor(
    private readonly roomService: RoomService,
    private readonly firebaseService: FirebaseService,
  ) {
    this.roomsCollection = this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms);
    this.usersCollection = this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Users);
  }

  @Get()
  async listRooms(
    @User() user: UserEntity,
    @Query('excludeSelf') excludeSelf?: boolean, // type=member|all|
    @Query('search') search?: string,
    @Query('withLastMessage') withLastMessage?: boolean,
  ): Promise<RoomResponse[]> {
    let qb = this.roomsCollection.where('code', '==', null);

    if (excludeSelf && Array.isArray(user.rooms) && user.rooms.length > 0) {
      const maxBatchSize = 10;
      const numOfBatches = Math.floor(user.rooms.length / maxBatchSize);
      for (let i = 0; i < numOfBatches; i++) {
        const batch = user.rooms.slice(
          i * numOfBatches,
          i * numOfBatches + numOfBatches,
        );
        qb = qb.where(FieldPath.documentId(), 'not-in', batch);
      }
    }

    const snapshot = await qb
      .withConverter(this.firebaseService.roomConverter())
      .orderBy('name')
      .get();
    if (search) {
      return snapshot.docs
        .map((room) => mapRoomDocToRoomResponse(room))
        .filter((room) => room.name.includes(search));
    }

    if (withLastMessage) {
      return await Promise.all(
        snapshot.docs.map(async (roomDoc) => {
          const messages = await roomDoc.ref
            .collection('messages')
            .withConverter(this.firebaseService.messageConverter())
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
          return mapRoomToRoomResponse(roomDoc, messages.docs);
        }),
      );
    }

    return snapshot.docs.map((room) => mapRoomDocToRoomResponse(room));
  }

  @Get('new')
  async listRoomsNew(
    @User() user: UserEntity,
    @Query('type') type: 'member' | 'all' | 'notmember' = 'all',
    @Query('search') search?: string,
    @Query('withLastMessage') withLastMessage?: boolean,
  ): Promise<RoomResponse[]> {
    let qb = this.roomsCollection.where('name', '!=', null);
    if (type === 'notmember') {
      console.log('notmember');
      qb = qb.where('code', '==', null);
    }

    if (type !== 'all' && Array.isArray(user.rooms) && user.rooms.length > 0) {
      console.log('not all');
      const comparison = type === 'member' ? 'in' : 'not-in';
      const maxBatchSize = 10;
      const numOfBatches = Math.floor(user.rooms.length / maxBatchSize);
      for (let i = 0; i < numOfBatches; i++) {
        const batch = user.rooms.slice(
          i * numOfBatches,
          i * numOfBatches + numOfBatches,
        );
        qb = qb.where(FieldPath.documentId(), comparison, batch);
      }
    }

    const snapshot = await qb
      .withConverter(this.firebaseService.roomConverter())
      .orderBy('name')
      .get();

    let searchedNameFilter = snapshot.docs;
    if (search) {
      console.log('search');
      searchedNameFilter = snapshot.docs.filter((room) =>
        room.data().name.includes(search),
      );
    }

    if (withLastMessage) {
      console.log('with message');
      return await Promise.all(
        searchedNameFilter.map(async (roomDoc) => {
          const messages = await roomDoc.ref
            .collection('messages')
            .withConverter(this.firebaseService.messageConverter())
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
          return mapRoomToRoomResponse(roomDoc, messages.docs);
        }),
      );
    }

    console.log('bottom');
    return searchedNameFilter.map((room) => mapRoomDocToRoomResponse(room));
  }

  @Get(':roomId')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
    type: RoomResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Room not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Room<roomId> not found',
        error: 'Not Found',
      },
    },
  })
  async getRoom(
    @User('rooms') roomIds: string[],
    @Param('roomId') roomId: string,
  ): Promise<RoomResponse> {
    if (!roomIds.includes(roomId)) {
      throw new ConflictException(`not a member of Room<${roomId}>`);
    }

    const roomRef = this.roomsCollection.doc(roomId);
    const roomDoc = await roomRef.get();
    if (!roomDoc.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    const [roomMembers, roomMessages] = await Promise.all([
      this.usersCollection.where('rooms', 'array-contains', roomId).get(),
      roomRef
        .collection('messages')
        .withConverter(this.firebaseService.messageConverter())
        .orderBy('createdAt')
        .get(),
    ]);
    if (roomMembers.empty) {
      throw new NotFoundException(`Room<${roomId}> has no members`);
    }
    return mapRoomDocToRoomResponse(
      roomDoc,
      roomMessages.docs,
      roomMembers.docs,
    );
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: RoomResponse,
  })
  async createRoom(
    @User('id') userId: string,
    @Body() body: CreateRoomDto,
  ): Promise<RoomResponse> {
    const roomDocument = await this.firebaseService
      .getDBClient()
      .runTransaction(async (trx) => {
        const userRef = this.usersCollection.doc(userId);
        // TODO is this valid transaction?
        const docRef = await this.roomsCollection
          .withConverter(this.firebaseService.roomConverter())
          .add({
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: body.name,
            admin: userRef,
            code: body.isPrivate ? this.roomService.generateRoomCode() : null,
            isPersistent: body.isPersistent === true,
            members: [userId],
          });

        trx.update(userRef, {
          rooms: FieldValue.arrayUnion(docRef.id),
        });

        return await docRef.get();
      });

    if (!roomDocument.exists) {
      throw new InternalServerErrorException(
        `Created Room<${roomDocument.id}>, but the entity wasn\'t found`,
      );
    }
    return mapRoomToRoomResponse(roomDocument);
  }

  @Patch(':roomId')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: RoomResponse,
  })
  @ApiNotFoundResponse({
    description: 'Room not found',
  })
  async updateRoom(
    @Param('roomId') roomId: string,
    @Body() body: UpdateRoomDto,
  ): Promise<RoomResponse> {
    const snapshot = await this.roomsCollection.doc(roomId).get();
    if (!snapshot.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    await this.roomsCollection.doc(roomId).set({
      name: body.name ?? snapshot.data().name,
      code:
        typeof body.isPrivate === 'boolean'
          ? body.isPrivate === true
            ? (snapshot.data().code ?? this.roomService.generateRoomCode())
            : null
          : snapshot.data().code,
      isPersistent:
        typeof body.isPersistent === 'boolean'
          ? body.isPersistent
          : snapshot.data().isPersistent,
    });
    const updatedSnapshot = await this.roomsCollection.doc(roomId).get();
    if (!updatedSnapshot.exists) {
      throw new InternalServerErrorException(
        `Updated Room<${roomId}>, but the entity wasn\'t found after update`,
      );
    }
    return mapRoomDocToRoomResponse(updatedSnapshot);
  }

  @Delete(':roomId')
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Room not found',
  })
  async deleteRoom(@Param('roomId') roomId: string): Promise<void> {
    const snapshot = await this.roomsCollection.doc(roomId).get();
    if (!snapshot.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    await this.roomsCollection.doc(roomId).delete();
  }

  @Post('/join')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Room joined successfully.',
    type: RoomResponse,
  })
  async joinRoom(
    @User() user: UserEntity,
    @Body() body: JoinRoomDto,
  ): Promise<RoomResponse> {
    if (body.roomId) {
      const publicRoom = await this.roomService.joinPublicRoom(
        user,
        body.roomId,
      );
      return mapRoomToRoomResponse(publicRoom);
    }

    const privateRoom = await this.roomService.joinPrivateRoom(user, body.code);
    return mapRoomToRoomResponse(privateRoom);
  }
}
