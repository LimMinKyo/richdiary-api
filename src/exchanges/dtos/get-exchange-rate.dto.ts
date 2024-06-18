import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { ExchangeEntity } from '../entity/exchange.entity';

export class GetExchangeRateRequest {
  @ApiProperty({ description: 'YYYY-MM' })
  @IsDateString()
  searchDate!: string;
}

export class GetExchangeRateResponse extends ResponseDto<ExchangeEntity> {
  @ApiProperty({ type: ExchangeEntity })
  data!: ExchangeEntity;
}
