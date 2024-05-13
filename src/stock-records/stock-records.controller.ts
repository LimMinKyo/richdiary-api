import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StockRecordsService } from './stock-records.service';
import { CreateStockRecordDto } from './dtos/create-stock-record.dto';
import { UpdateStockRecordDto } from './dtos/update-stock-record.dto';

@Controller('stock-records')
export class StockRecordsController {
  constructor(private readonly stockRecordsService: StockRecordsService) {}

  @Post()
  create(@Body() createStockRecordDto: CreateStockRecordDto) {
    return this.stockRecordsService.create(createStockRecordDto);
  }

  @Get()
  findAll() {
    return this.stockRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockRecordDto: UpdateStockRecordDto,
  ) {
    return this.stockRecordsService.update(+id, updateStockRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockRecordsService.remove(+id);
  }
}
