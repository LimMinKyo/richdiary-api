import { ApiProperty } from '@nestjs/swagger';
import { Provider, User } from '@prisma/client';

export class UserEntity implements Omit<User, 'id' | 'password'> {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  provider!: Provider;

  @ApiProperty()
  verified!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
