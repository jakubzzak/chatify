import { User } from '@core/decorators/user.decorator';
import { UserEntity } from '@domains/user/types';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
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
} from '@nestjs/swagger';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { Public } from 'src/core/decorators/is-public.decorator';
import { RoomResponse } from 'src/core/responses/room.res';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import {
  mapRoomRecordToRoomResponse,
  mapRoomToRoomResponse,
} from './mappers/room.mapper';
import { RoomService } from './room.service';

@Controller({ path: '/api/rooms' })
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
  @Public()
  @ApiNotFoundResponse({
    description: 'No rooms found',
  })
  async listPublicRooms(
    @User() user?: UserEntity,
    @Query('excludeSelf')
    excludeSelf?: boolean,
  ): Promise<RoomResponse[]> {
    const qb = this.roomsCollection.where('code', '==', null);
    if (user && excludeSelf) {
      qb.where(FieldPath.documentId(), 'not-in', user.rooms);
    }

    const snapshot = await qb.get();
    return snapshot.docs.map((room) => mapRoomRecordToRoomResponse(room));
  }

  @Get(':roomId')
  @ApiNotFoundResponse({
    description: 'Room not found',
  })
  async getRoom(
    @User('rooms') roomIds: string[],
    @Param('roomId') roomId: string,
  ): Promise<RoomResponse> {
    if (!roomIds.includes(roomId)) {
      throw new ConflictException(`not a member of Room<${roomId}>`);
    }

    const roomSnapshot = await this.roomsCollection.doc(roomId).get();
    if (!roomSnapshot.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    const roomMembersSnapshot = await this.usersCollection
      .where('rooms', 'array-contains', roomId)
      .get();
    if (roomMembersSnapshot.empty) {
      throw new NotFoundException(`Room<${roomId}> members not found`);
    }
    return mapRoomRecordToRoomResponse(roomSnapshot, roomMembersSnapshot.docs);
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
    const docRef = await this.firebaseService
      .getDBClient()
      .runTransaction(async () => {
        const innerDocRef = await this.roomsCollection.add({
          name: body.name,
          admin: userId,
          code: body.isPrivate ? this.roomService.generateRoomCode() : null,
          isPersistent: body.isPersistent === true,
          members: [userId],
        });

        await this.usersCollection.doc(userId).update({
          rooms: FieldValue.arrayUnion(innerDocRef.id),
        });

        return innerDocRef;
      });

    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw new InternalServerErrorException(
        `Created Room<${docRef.id}>, but the entity wasn\'t found`,
      );
    }
    return mapRoomRecordToRoomResponse(snapshot);
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
    return mapRoomRecordToRoomResponse(updatedSnapshot);
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
