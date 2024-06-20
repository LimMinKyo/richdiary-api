import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { DividendEntity } from '../entities/dividend.entity';

export class GetDividendsYearRequest {
  @ApiProperty({ description: 'YYYY', example: '2024' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

export class GetDividendsYearResponseData {
  @ApiProperty({ example: 1230.5 })
  exchangeRate!: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: {
        allOf: [{ $ref: getSchemaPath(DividendEntity) }],
      },
    },
  })
  data!: DividendEntity[][];
}
