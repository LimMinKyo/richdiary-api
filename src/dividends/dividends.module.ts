import { Module } from '@nestjs/common';
import { DividendsService } from './services/dividends.service';
import { DividendsController } from './controllers/dividends.controller';

@Module({
  controllers: [DividendsController],
  providers: [DividendsService],
})
export class DividendsModule {}
