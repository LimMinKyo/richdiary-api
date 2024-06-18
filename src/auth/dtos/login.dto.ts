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

export class LoginResponseData {
  @ApiProperty()
  accessToken!: string;
}

export class LoginResponse extends ResponseDto<LoginResponseData> {
  @ApiProperty({ type: LoginResponseData })
  data!: LoginResponseData;
}
