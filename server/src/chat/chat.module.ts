import { Module } from '@nestjs/common';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { ChatWebSocketGateway } from './chat.gateway';

@Module({
  imports: [FirebaseModule],
  providers: [ChatWebSocketGateway],
})
export class ChatModule {}
