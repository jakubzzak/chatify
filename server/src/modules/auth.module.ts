import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AuthController } from '../controllers/auth.controller';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
