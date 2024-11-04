import { Public } from '@core/decorators/is-public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api')
@ApiTags('health')
export class AppController {
  @Get('/ping')
  @Public()
  ping(): Record<string, string> {
    return { message: 'pong' };
  }
}
