import { PartialType } from '@nestjs/swagger';
import { CreateStockRecordDto } from './create-stock-record.dto';

export class UpdateStockRecordDto extends PartialType(CreateStockRecordDto) {}
