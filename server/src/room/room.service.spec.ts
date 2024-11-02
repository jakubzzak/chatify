import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate room code successfully', () => {
    const code = service.generateRoomCode();

    expect(code.length).toBeGreaterThanOrEqual(1);
  });

  it.each([2, 4, 8, 16, 32, 64, 128, 256])(
    'should generate room code with correct length',
    (codeLength: number) => {
      const code = service.generateRoomCode(codeLength);

      expect(code.length).toEqual(codeLength);
    },
  );

  it('should generate different codes', () => {
    const codes = [];

    for (let i = 0; i < 100; i++) {
      codes.push(service.generateRoomCode());
    }

    expect(new Set(codes).size).toEqual(codes.length);
  });
});
