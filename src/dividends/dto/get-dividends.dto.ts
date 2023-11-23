import { ResponseDto } from '@/common/dtos/response.dto';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { DividendEntity } from '../entities/dividend.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetDividendsRequest {
  @ApiProperty({ description: 'YYYY-MM-DD', example: '2023-11-24' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class GetDividendsResponse extends ResponseDto<DividendEntity[]> {}
