import { ApiProperty } from '@nestjs/swagger';
import { Portfolio } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PortfolioEntity implements Portfolio {
  constructor(partial: Partial<PortfolioEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @Exclude()
  userId!: number;

  @Exclude()
  createdAt!: Date;

  @Exclude()
  updatedAt!: Date;
}
