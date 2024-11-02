import { AuthModule } from '@domains/auth/auth.module';
import { RoomModule } from '@domains/room/room.module';
import { UserModule } from '@domains/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { ChatWebSocketGateway } from '@services/websocket/chat.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    RoomModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [ChatWebSocketGateway],
})
export class AppModule {}
