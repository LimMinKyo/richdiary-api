import { Dividend, Unit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DividendEntity implements Dividend {
  constructor(partial: Partial<DividendEntity>) {
    Object.assign(this, partial);
  }

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

  @Exclude()
  userId!: number;

  @Exclude()
  portfolioId!: number | null;
}
