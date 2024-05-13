import { Module } from '@nestjs/common';
import { StockRecordsService } from './stock-records.service';
import { StockRecordsController } from './stock-records.controller';

@Module({
  controllers: [StockRecordsController],
  providers: [StockRecordsService],
})
export class StockRecordsModule {}
