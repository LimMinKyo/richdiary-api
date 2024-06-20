import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequest } from '@/common/dtos/pagination.dto';

export class GetDividendsMonthRequest extends PaginationRequest {
  @ApiProperty({ description: 'YYYY-MM', example: '2023-11' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}
