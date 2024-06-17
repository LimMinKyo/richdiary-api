import { Module } from '@nestjs/common';
import { StockRecordsController } from './controllers/stock-records.controller';
import { StockRecordsService } from './services/stock-records.service';

@Module({
  controllers: [StockRecordsController],
  providers: [StockRecordsService],
})
export class StockRecordsModule {}
