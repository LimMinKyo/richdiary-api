import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}

export class LoginResponse extends ResponseDto<{ access_token: string }> {}
