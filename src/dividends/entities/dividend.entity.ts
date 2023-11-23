import { Dividend, Unit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DividendEntity implements Omit<Dividend, 'userId'> {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  dividendAt!: Date;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  dividend!: number;

  @ApiProperty()
  tax!: number;

  @ApiProperty({ enum: Unit })
  unit!: Unit;
}
