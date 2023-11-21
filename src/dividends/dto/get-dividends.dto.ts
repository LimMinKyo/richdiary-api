import { ResponseDto } from '@/common/dtos/response.dto';
import { Dividend } from '@prisma/client';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetDividendsRequest {
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export interface GetDividendsResponse
  extends ResponseDto<Omit<Dividend, 'userId'>[]> {}
