import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class GetExchangeRateRequest {
  @ApiProperty({ description: 'YYYY-MM' })
  @IsDateString()
  searchDate!: string;
}
