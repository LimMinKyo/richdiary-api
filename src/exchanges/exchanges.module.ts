import { Module } from '@nestjs/common';
import { ExchangesService } from './services/exchanges.service';

@Module({
  providers: [ExchangesService],
  exports: [ExchangesService],
})
export class ExchangesModule {}
