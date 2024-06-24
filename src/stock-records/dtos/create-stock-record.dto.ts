import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateStockRecordRequest {
  @ApiProperty({ description: '배당일' })
  @IsDateString()
  @IsNotEmpty()
  recordAt!: string;

  @ApiProperty({ description: '주식종목' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({ enum: Currency, description: '화폐단위' })
  @IsEnum(Currency)
  currency!: Currency;

  @ApiProperty({ description: '구매가' })
  @IsNumber()
  buyPrice!: number;

  @ApiProperty({ description: '현재가' })
  @IsNumber()
  currentPrice!: number;

  @ApiProperty({ description: '보유 수량' })
  @IsNumber()
  quantity!: number;
}
