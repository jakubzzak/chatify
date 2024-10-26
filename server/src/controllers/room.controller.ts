import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
import { CreateOrUpdateRoomDto } from 'src/core/inputs';
import { RoomResponse } from 'src/core/responses/room.res';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Controller({ path: '/api/rooms' })
export class RoomController {
  private readonly logger = new Logger(RoomController.name);
  private roomsCollection: FirebaseFirestore.CollectionReference;

  constructor(private readonly service: FirebaseService) {
    this.roomsCollection = this.service.getDBClient().collection('rooms');
  }

  @Get()
  @ApiNotFoundResponse({
    description: 'No rooms found',
  })
  async listRooms(): Promise<RoomResponse[]> {
    const snapshot = await this.roomsCollection.get();
    if (snapshot.empty) {
      throw new Error('No rooms found');
    }

    const rooms: RoomResponse[] = [];
    snapshot.forEach((doc) => rooms.push(this.mapRoomResponse(doc)));
    return rooms;
  }

  @Get(':roomId')
  async getRoom(@Param('roomId') roomId: string): Promise<RoomResponse> {
    const room = await this.roomsCollection.doc(roomId).get();
    return {} as RoomResponse;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: RoomResponse,
  })
  async createRoom(@Body() body: CreateOrUpdateRoomDto): Promise<RoomResponse> {
    let code = '';
    const codeLength = 6;
    for (let i = 0; i < codeLength; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }

    const docRef = await this.roomsCollection.add({ name: body.name, code });
    const snapshot = await docRef.get();
    return this.mapRoomResponse(snapshot);
  }

  @Put(':roomId')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: RoomResponse,
  })
  async updateRoom(
    @Param('roomId') roomId: string,
    @Body() body: CreateOrUpdateRoomDto,
  ): Promise<RoomResponse> {
    const room = await this.roomsCollection.doc(roomId).set(body);
    return {} as RoomResponse;
  }

  @Delete(':roomId')
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  async deleteRoom(@Param('roomId') roomId: string): Promise<void> {
    await this.roomsCollection.doc(roomId).delete();
  }

  private mapRoomResponse = (
    roomSnapshot:
      | FirebaseFirestore.QueryDocumentSnapshot<
          FirebaseFirestore.DocumentData,
          FirebaseFirestore.DocumentData
        >
      | FirebaseFirestore.DocumentSnapshot<
          FirebaseFirestore.DocumentData,
          FirebaseFirestore.DocumentData
        >,
  ): RoomResponse => {
    return new RoomResponse({
      id: roomSnapshot.id,
      createdAt: roomSnapshot.createTime.toDate().toISOString(),
      name: roomSnapshot.data().name,
      code: roomSnapshot.data().code,
    });
  };
}
