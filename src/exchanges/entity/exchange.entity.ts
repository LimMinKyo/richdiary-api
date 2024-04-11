import { ApiProperty } from '@nestjs/swagger';
import { Exchange, Unit } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ExchangeEntity implements Exchange {
  constructor(partial: Partial<ExchangeEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  date!: string;

  @ApiProperty()
  currency!: Unit;

  @ApiProperty()
  rate!: number;

  @Exclude()
  updatedAt!: Date;

  @Exclude()
  createdAt!: Date;
}
