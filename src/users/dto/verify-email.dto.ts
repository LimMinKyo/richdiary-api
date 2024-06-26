import { ResponseStatus, errorMessage } from '@/common/common.constants';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailRequest {
  @ApiProperty()
  @IsString()
  code!: string;
}

export class VerifyCodeInvalidResponseDto implements ResponseDto {
  @ApiProperty({
    enum: ResponseStatus,
    example: ResponseStatus.VERIFY_CODE_INVALID,
  })
  statusCode = ResponseStatus.VERIFY_CODE_INVALID;

  @ApiProperty({ example: errorMessage[ResponseStatus.VERIFY_CODE_INVALID] })
  message = errorMessage[ResponseStatus.VERIFY_CODE_INVALID];
}
