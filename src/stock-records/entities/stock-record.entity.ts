import { StockRecord, Currency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class StockRecordEntity implements StockRecord {
  constructor(partial: Partial<StockRecordEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id!: string;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;

  @ApiProperty()
  recordAt!: Date;

  @ApiProperty()
  companyName!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  buyPrice!: number;

  @ApiProperty()
  currentPrice!: number;

  @ApiProperty({ enum: Currency })
  currency!: Currency;

  @Exclude()
  userId!: string;
}
