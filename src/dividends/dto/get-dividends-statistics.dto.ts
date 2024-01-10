import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Unit } from '@/db/enums';

class StatisticsData {
  @ApiProperty({ example: '2023-12' })
  date!: string;

  @ApiProperty({ type: Number })
  total!: string | number | bigint;

  @ApiProperty({ type: Number })
  dividend!: string | number | bigint;

  @ApiProperty({ type: Number })
  tax!: string | number | bigint;
}

export class GetDividendsStatisticsResponse extends ResponseDto<
  StatisticsData[]
> {
  @ApiProperty({ type: StatisticsData, isArray: true })
  data?: StatisticsData[];
}
