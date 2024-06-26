import { ResponseStatus, errorMessage } from '@/common/common.constants';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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

export class EmailAlreadyExistResponseDto implements ResponseDto {
  @ApiProperty({
    enum: ResponseStatus,
    example: ResponseStatus.EMAIL_ALREADY_EXIST,
  })
  statusCode = ResponseStatus.EMAIL_ALREADY_EXIST;

  @ApiProperty({ example: errorMessage.EMAIL_ALREADY_EXIST })
  message = errorMessage[ResponseStatus.EMAIL_ALREADY_EXIST];
}
