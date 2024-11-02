import { AuthGuard } from '@core/guards/auth.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core/constants';
import { FirebaseModule } from '@services/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
