import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationRequest,
  PaginationResponseDto,
} from '@/common/dtos/pagination.dto';
import { StockRecordEntity } from '../entities/stock-record.entity';

export class GetStockRecordsRequest extends PaginationRequest {
  @ApiProperty({ description: 'YYYY-MM', example: '2023-11' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class GetStockRecordsResponse extends PaginationResponseDto<StockRecordEntity> {}
