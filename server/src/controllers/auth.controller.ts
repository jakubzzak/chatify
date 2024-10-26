import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: FirebaseService) {}

  @Post('login')
  async auth(@Body() body: any) {
    return this.service.authenticateWithEmail('');
  }
}
