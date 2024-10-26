import { Module } from '@nestjs/common';
import { RoomController } from 'src/controllers/room.controller';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [RoomController],
})
export class RoomModule {}
