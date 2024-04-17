import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const verifyEmailErrorMessage = {
  CODE_INVALID: '인증코드가 유효하지 않습니다.',
};

export class VerifyEmailRequest {
  @ApiProperty()
  @IsString()
  code!: string;
}

export class VerifyEmailResponse extends ResponseDto {}

export class VerifyEmailBadRequestResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: verifyEmailErrorMessage.CODE_INVALID })
  message!: string;
}
