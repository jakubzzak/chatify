import { mapRoomDocToRoomResponse } from '@domains/room/mappers/room.mapper';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Room, User } from 'src/core/types';
import { FirebaseService } from '../services/firebase/firebase.service';
import { FirebaseCollections } from '../services/firebase/types';

type SocketWithMetadata = Socket & { user: User; room: Room };

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class ChatWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatWebSocketGateway.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string;
    if (!roomId) {
      this.logger.debug(`'roomId' query param is required`);
      return socket.disconnect();
    }

    let user;
    try {
      user = await this.firebaseService.authenticateWithEmail(
        socket.handshake.auth.token,
      );
    } catch {
      return socket.disconnect();
    }

    const roomRef = this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(roomId);

    const roomDocument = await roomRef.get();
    if (!roomDocument.exists) {
      this.logger.warn(`Room<${roomId}> not found`);
      return socket.disconnect();
    }
    const room = mapRoomDocToRoomResponse(roomDocument);

    socket.join(roomId);
    socket['user'] = user;
    socket['room'] = room;

    this.handleMetaEvent(socket as SocketWithMetadata, {
      type: 'user_connected',
    });
    this.logger.log(`Client<${user.id}:${user.username}> connected`);
  }

  handleDisconnect(socket: SocketWithMetadata) {
    if (!socket.room?.id) {
      this.logger.error(`Room missing on SocketWithMetadata`, {
        func: 'handleDisconnect',
      });
      return;
    }
    if (!socket.user?.id) {
      this.logger.error(`User missing on SocketWithMetadata`, {
        func: 'handleDisconnect',
      });
      return;
    }

    this.handleMetaEvent(socket, { type: 'user_disconnected' });
    this.logger.log(
      `Client<${socket.user.id}:${socket.user.username}> disconnected`,
    );
  }

  @SubscribeMessage('message')
  async handleMessageEvent(
    socket: SocketWithMetadata,
    data: Record<string, any>,
  ) {
    if (!socket.room?.id) {
      this.logger.error(`Room missing on SocketWithMetadata`, {
        func: 'handleMessageEvent',
      });
      return;
    }
    if (!socket.user?.id) {
      this.logger.error(`User missing on SocketWithMetadata`, {
        func: 'handleMessageEvent',
      });
      return;
    }
    this.logger.log(`Message received: ${data.message}`, data);

    this.io.to(socket.room.id).emit('message', {
      createdAt: new Date().toISOString(),
      message: data.message,
      userId: socket.user.id,
      username: socket.user.username,
    });

    await this.firebaseService
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(socket.room.id)
      .collection('messages')
      .add({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: socket.user.id,
        content: data.message,
      });
  }

  @SubscribeMessage('meta')
  handleMetaEvent(socket: SocketWithMetadata, data: Record<string, any>) {
    if (!socket.room?.id) {
      this.logger.error(`Room missing on SocketWithMetadata`, {
        func: 'handleMetaEvent',
      });
      return;
    }
    if (!socket.user?.id) {
      this.logger.error(`User missing on SocketWithMetadata`, {
        func: 'handleMetaEvent',
      });
      return;
    }
    this.logger.log(`Meta event received`, data);

    socket.broadcast.to(socket.room.id).emit('meta', {
      type: data.type,
      userId: socket.user.id,
      username: socket.user.username,
    });
  }
}
