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

class Data {
  @ApiProperty()
  accessToken!: string;
}

export class LoginResponse extends ResponseDto<Data> {
  @ApiProperty({ type: Data })
  data!: Data;
}
