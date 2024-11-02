import { Controller, Post } from '@nestjs/common';
import { Public } from '@core/decorators/is-public.decorator';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Controller('auth')
export class AuthController {
  // TODO this controller should be fully obsolete due to Firebase
  constructor(private readonly service: FirebaseService) {}

  @Public()
  @Post('login')
  async auth() {
    return this.service.authenticateWithEmail('');
  }
}
