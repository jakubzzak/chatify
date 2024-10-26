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
    app = await createNestApp(ChatWebSocketGateway);
    gateway = app.get<ChatWebSocketGateway>(ChatWebSocketGateway);

    await app.listen(3998);

    ioClientA = io('http://localhost:3998/chat?username=Kamil', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
    ioClientB = io('http://localhost:3998/chat?username=Ali', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
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
      ioClientB.on('message', (data) => {
        expect(data).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            message: 'Hello world!',
          }),
        );
        resolve();
      });

      ioClientB.connect();
      ioClientA.emit('message', { message: 'Hello world!' });
    });

    ioClientB.disconnect();
    ioClientA.disconnect();
  });
});
