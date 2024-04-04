import { ApiProperty } from '@nestjs/swagger';
import { Provider, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @Exclude()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  /**
   * provider가 LOCAL이 아닌 경우 null
   */
  @Exclude()
  password!: string | null;

  @ApiProperty()
  provider!: Provider;

  @ApiProperty()
  verified!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
