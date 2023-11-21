import { ResponseDto } from '@/common/dtos/response.dto';
import { Unit } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDividendRequest {
  @IsDateString()
  @IsNotEmpty()
  dividendAt!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(Unit)
  unit!: Unit;

  @IsNumber()
  dividend!: number;

  @IsNumber()
  @IsOptional()
  tax?: number;
}

export interface CreateDividendResponse extends ResponseDto {}
