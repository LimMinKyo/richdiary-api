import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationRequest,
  PaginationResponse,
} from '@/common/dtos/pagination.dto';
import { StockRecordEntity } from '../entities/stock-record.entity';

export class GetStockRecordListRequest extends PaginationRequest {
  @ApiProperty({ description: 'YYYY-MM', example: '2023-11' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class GetStockRecordListResponse extends PaginationResponse<StockRecordEntity> {}
