import { ResponseStatus, errorMessage } from '@/common/common.constants';
import { BadRequestException } from '@nestjs/common';

export class VerifyCodeInvalidException extends BadRequestException {
  constructor() {
    super(errorMessage[ResponseStatus.VERIFY_CODE_INVALID]);
  }
}
