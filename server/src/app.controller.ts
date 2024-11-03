import { Public } from '@core/decorators/is-public.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('/api')
export class AppController {
  @Get('/ping')
  @Public()
  ping(): Record<string, string> {
    return { message: 'pong' };
  }
}
