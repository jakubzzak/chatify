import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [AuthController],
})
export class AuthModule {}
