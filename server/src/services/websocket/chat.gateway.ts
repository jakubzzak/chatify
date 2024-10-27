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
import { mapRoomRecordToRoom } from 'src/core/mappers';
import { Room } from 'src/core/types';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseCollections } from '../firebase/types';

type SocketWithMetadata = Socket & { username: string; room: Room };

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class ChatWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatWebSocketGateway.name);

  constructor(private readonly service: FirebaseService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(socket: Socket) {
    const username = socket.handshake.query.username as string;
    if (!username) {
      this.logger.debug(`'username' query param is required`);
      return socket.disconnect();
    }
    const roomId = socket.handshake.query.roomId as string;
    if (!roomId) {
      this.logger.debug(`'roomId' query param is required`);
      return socket.disconnect();
    }
    const room = await this.service
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(roomId)
      .get();
    if (!room.exists) {
      this.logger.debug(`Room<${roomId}> not found`);
      return socket.disconnect();
    }
    // TODO check if is a member
    socket.join(roomId);

    socket['username'] = username;
    socket['room'] = mapRoomRecordToRoom(room);
    // socket.handshake.auth

    this.handleMetaEvent(socket as SocketWithMetadata, {
      type: 'user_connected',
    });
    this.logger.log(
      `Client<${socket['username']}:${socket.handshake.address}> connected`,
    );
  }

  handleDisconnect(socket: SocketWithMetadata) {
    if (!socket.room?.id) {
      return;
    }

    this.handleMetaEvent(socket, { type: 'user_disconnected' });
    this.logger.log(
      `Client<${socket['username']}:${socket.handshake.address}> disconnected`,
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
    this.logger.log(`Message received: ${data.message}`, data);

    await this.service
      .getDBClient()
      .collection(FirebaseCollections.Rooms)
      .doc(socket.room.id)
      .collection('messages')
      .add({
        userId: socket.handshake.address,
        content: data.message,
      });

    this.io.to(socket.room.id).emit('message', {
      createdAt: new Date().toISOString(),
      message: data.message,
      userId: socket.handshake.address, // TODO change to userId after auth
      username: socket.username,
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
    this.logger.log(`Meta event received`, data);

    socket.broadcast.to(socket.room.id).emit('meta', {
      type: data.type,
      userId: socket.handshake.address, // TODO change to userId after auth
      username: socket.username,
    });
  }
}
