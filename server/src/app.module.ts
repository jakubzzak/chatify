import { RoomModule } from '@domains/room/room.module';
import { UserModule } from '@domains/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GraphqlModule } from './services/graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    RoomModule,
    FirebaseModule,
    ChatModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
