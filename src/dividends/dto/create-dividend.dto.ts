import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Unit } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DividendEntity } from '../entities/dividend.entity';

export class CreateDividendRequest {
  @ApiProperty({ description: '배당일' })
  @IsDateString()
  @IsNotEmpty()
  dividendAt!: string;

  @ApiProperty({ description: '주식종목' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '화폐' })
  @IsEnum(Unit)
  unit!: Unit;

  @ApiProperty({ description: '배당금' })
  @IsNumber()
  dividend!: number;

  @ApiPropertyOptional({ description: '세금' })
  @IsNumber()
  @IsOptional()
  tax?: number;
}

export class CreateDividendResponse extends ResponseDto {}
