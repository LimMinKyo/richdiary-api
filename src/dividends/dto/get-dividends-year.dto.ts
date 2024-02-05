import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

class StatisticsData {
  @ApiProperty({ example: '2024-01' })
  date!: string;

  @ApiProperty({ type: Number })
  total!: string | number | bigint;

  @ApiProperty({ type: Number })
  dividend!: string | number | bigint;

  @ApiProperty({ type: Number })
  tax!: string | number | bigint;
}

export class GetDividendsYearRequest {
  @ApiProperty({ description: 'YYYY', example: '2024' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class GetDividendsYearResponse extends ResponseDto<StatisticsData[]> {
  @ApiProperty({ type: StatisticsData, isArray: true })
  data?: StatisticsData[];
}
