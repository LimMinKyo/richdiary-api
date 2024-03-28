import { Module } from '@nestjs/common';
import { DividendsService } from './services/dividends.service';
import { DividendsController } from './controllers/dividends.controller';
import { ExchangesModule } from '@/exchanges/exchanges.module';

@Module({
  imports: [ExchangesModule],
  controllers: [DividendsController],
  providers: [DividendsService],
})
export class DividendsModule {}
