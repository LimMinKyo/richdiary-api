import { Controller, Get } from '@nestjs/common';
import { Public } from '@/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('공통 API')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Health Check' })
  @Public()
  @Get()
  async healthCheck(): Promise<string> {
    return 'OK';
  }
}
