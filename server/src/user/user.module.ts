import { Module } from '@nestjs/common';
import { FirebaseModule } from '@services/firebase/firebase.module';
import { UserController } from './user.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
})
export class UserModule {}
