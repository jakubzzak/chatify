import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Socket, io } from 'socket.io-client';
import { ChatWebSocketGateway } from './chat.gateway';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('ChatGateway', () => {
  let gateway: ChatWebSocketGateway;
  let app: INestApplication;
  let ioClientA: Socket;
  let ioClientB: Socket;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(ChatWebSocketGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<ChatWebSocketGateway>(ChatWebSocketGateway);
    // Create a new client that will interact with the gateway
    ioClientA = io('http://localhost:3998/chat', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
    ioClientB = io('http://localhost:3998/chat', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(3998);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "message"', async () => {
    ioClientA.connect();

    await new Promise<void>((resolve) => {
      ioClientB.on('connect', () => {
        console.log('connected');
      });
      ioClientB.on('message', (data) => {
        expect(data).toBe('Hello world!');
        resolve();
      });

      ioClientB.connect();
      ioClientA.emit('message', 'Hello world!');
    });

    ioClientB.disconnect();
    ioClientA.disconnect();
  });
});
