import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ChatWebSocketGateway } from '../services/websocket/chat.gateway';
// import { AuthModule } from './auth.module';
import { AuthModule } from './auth.module';
import { FirebaseModule } from './firebase.module';
import { RoomModule } from './room.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    RoomModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatWebSocketGateway],
})
export class AppModule {}
