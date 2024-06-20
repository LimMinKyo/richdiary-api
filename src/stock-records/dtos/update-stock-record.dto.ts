import { PartialType } from '@nestjs/swagger';
import { CreateStockRecordRequest } from './create-stock-record.dto';

export class UpdateStockRecordRequest extends PartialType(
  CreateStockRecordRequest,
) {}
