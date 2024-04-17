import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export const createAccountErrorMessage = {
  EMAIL_ALREADY_EXIST: '해당 이메일은 이미 존재합니다.',
};

export class CreateAccountRequest {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}

export class CreateAccountResponse extends ResponseDto {}

export class CreateAccountBadRequestResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: createAccountErrorMessage.EMAIL_ALREADY_EXIST })
  message!: string;
}
