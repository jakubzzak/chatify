import { Module } from '@nestjs/common';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [FirebaseModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
