import { Module } from '@nestjs/common';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { RoomController } from './room.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [RoomController],
})
export class RoomModule {}
