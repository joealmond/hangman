import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
