import { IsDateString, IsNotEmpty } from 'class-validator';
import { DividendEntity } from '../entities/dividend.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationRequest,
  PaginationResponse,
} from '@/common/dtos/pagination.dto';

export class GetDividendsRequest extends PaginationRequest {
  @ApiProperty({ description: 'YYYY-MM', example: '2023-11' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class GetDividendsResponse extends PaginationResponse<DividendEntity> {}
