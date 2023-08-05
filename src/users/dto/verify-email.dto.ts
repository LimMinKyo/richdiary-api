import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailRequest {
  @ApiProperty()
  @IsString()
  code!: string;
}
