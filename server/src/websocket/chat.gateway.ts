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

@WebSocketGateway({ namespace: 'chat' })
export class ChatWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatWebSocketGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(socket: Socket) {
    this.io.emit('meta', {
      type: 'user_connected',
      userId: socket.id,
      username: '',
    });

    this.logger.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.io.emit('meta', {
      type: 'user_disconnected',
      userId: socket.id,
      username: '',
    });

    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('message')
  handleMessageEvent(socket: Socket, data: Record<string, any>) {
    this.logger.log(`Message received: ${data}`);

    this.io.emit('message', data);
    return { success: true };
  }

  @SubscribeMessage('meta')
  handleMetaEvent(client: any, data: any) {
    this.logger.log(`Meta event received: ${data}`);

    this.io.emit('meta', data);
    return { success: true };
  }
}
