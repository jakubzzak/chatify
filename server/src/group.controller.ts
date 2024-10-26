import { Controller, Get, Logger } from '@nestjs/common';

@Controller({ path: '/api/group' })
export class GroupController {
  private readonly logger = new Logger(GroupController.name);

  constructor() {}

  @Get()
  getHello(): Record<string, any> {
    this.logger.log('GET /api/group');
    return { test: 'me' };
  }
}
