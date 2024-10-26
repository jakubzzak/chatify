import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupController } from './group.controller';
import { ChatWebSocketGateway } from './websocket/chat.gateway';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, GroupController],
  providers: [AppService, ChatWebSocketGateway],
})
export class AppModule {}
