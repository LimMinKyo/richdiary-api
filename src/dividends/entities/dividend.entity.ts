import { Currency, Dividend } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DividendEntity implements Dividend {
  constructor(partial: Partial<DividendEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id!: string;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;

  @ApiProperty()
  dividendAt!: Date;

  @ApiProperty()
  companyName!: string;

  @ApiProperty()
  dividend!: number;

  @ApiProperty()
  tax!: number;

  @ApiProperty({ enum: Currency })
  currency!: Currency;

  @Exclude()
  userId!: string;

  @Exclude()
  portfolioId!: string | null;
}
