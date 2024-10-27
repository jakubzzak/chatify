import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Public } from 'src/core/decorators/is-public.decorator';
import { CreateOrUpdateRoomDto } from 'src/core/inputs';
import { mapRoomRecordToRoom } from 'src/core/mappers';
import { RoomResponse } from 'src/core/responses/room.res';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { FirebaseCollections } from 'src/services/firebase/types';

@Controller({ path: '/api/rooms' })
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  private roomsCollection: FirebaseFirestore.CollectionReference;

  constructor(private readonly service: FirebaseService) {
    this.roomsCollection = this.service
      .getDBClient()
      .collection(FirebaseCollections.Rooms);
  }

  @Get()
  @Public()
  @ApiNotFoundResponse({
    description: 'No rooms found',
  })
  async listRooms(): Promise<RoomResponse[]> {
    const snapshot = await this.roomsCollection.get();
    if (snapshot.empty) {
      throw new Error('No rooms found');
    }

    const rooms: RoomResponse[] = [];
    snapshot.forEach((doc) => rooms.push(mapRoomRecordToRoom(doc)));
    return rooms;
  }

  @Get(':roomId')
  @ApiNotFoundResponse({
    description: 'Room not found',
  })
  async getRoom(@Param('roomId') roomId: string): Promise<RoomResponse> {
    const snapshot = await this.roomsCollection.doc(roomId).get();
    if (!snapshot.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }
    return mapRoomRecordToRoom(snapshot);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: RoomResponse,
  })
  async createRoom(
    @Headers() headers,
    @Body() body: CreateOrUpdateRoomDto,
  ): Promise<RoomResponse> {
    let code = null;
    if (body.isPrivate) {
      code = this.generateRoomCode();
    }

    const docRef = await this.roomsCollection.add({
      name: body.name,
      code,
      isPersistent: body.isPersistent === true,
    });

    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw new InternalServerErrorException(
        `Created Room<${docRef.id}>, but the entity wasn\'t found`,
      );
    }
    return mapRoomRecordToRoom(snapshot);
  }

  @Put(':roomId')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: RoomResponse,
  })
  @ApiNotFoundResponse({
    description: 'Room not found',
  })
  async updateRoom(
    @Param('roomId') roomId: string,
    @Body() body: CreateOrUpdateRoomDto,
  ): Promise<RoomResponse> {
    const snapshot = await this.roomsCollection.doc(roomId).get();
    if (!snapshot.exists) {
      throw new NotFoundException(`Room<${roomId}> not found`);
    }

    await this.roomsCollection.doc(roomId).set(body);
    const updatedSnapshot = await this.roomsCollection.doc(roomId).get();
    if (!updatedSnapshot.exists) {
      throw new InternalServerErrorException(
        `Updated Room<${roomId}>, but the entity wasn\'t found after update`,
      );
    }
    return mapRoomRecordToRoom(updatedSnapshot);
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

  private generateRoomCode = (length: number = 6) => {
    let codeBuilder = '';
    for (let i = 0; i < length; i++) {
      codeBuilder += Math.floor(Math.random() * 10).toString();
    }
    return codeBuilder;
  };
}
