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

type SocketWithUsername = Socket & { username: string };

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class ChatWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatWebSocketGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleConnection(socket: Socket) {
    const username = socket.handshake.query.username;
    if (!username) {
      return socket.disconnect();
    }

    socket['username'] = username;

    this.io.emit('meta', {
      type: 'user_connected',
      userId: socket.id,
      username,
    });

    this.logger.log(`Client<${socket['username']}:${socket.id}> connected`);
    return { success: true, userId: socket.id };
  }

  handleDisconnect(socket: SocketWithUsername) {
    this.io.emit('meta', {
      type: 'user_disconnected',
      userId: socket.id,
      username: socket.username,
    });

    this.logger.log(`Client<${socket['username']}:${socket.id}> disconnected`);
  }

  @SubscribeMessage('message')
  handleMessageEvent(socket: SocketWithUsername, data: Record<string, any>) {
    this.logger.log(`Message received: ${data.message}`, data);

    this.io.emit('message', {
      createdAt: new Date().toISOString(),
      message: data.message,
      userId: socket.id,
      username: socket.username,
    });
    return { success: true };
  }

  @SubscribeMessage('meta')
  handleMetaEvent(socket: SocketWithUsername, data: Record<string, any>) {
    this.logger.log(`Meta event received`, data);

    socket.broadcast.emit('meta', {
      type: data.type,
      userId: socket.id,
      username: socket.username,
    });
    return { success: true };
  }
}
