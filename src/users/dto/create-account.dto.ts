import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountRequest {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
