import { Module } from '@nestjs/common';
import { ExchangesService } from './services/exchanges.service';
import { ExchangesController } from './controllers/exchanges.controller';

@Module({
  controllers: [ExchangesController],
  providers: [ExchangesService],
  exports: [ExchangesService],
})
export class ExchangesModule {}
