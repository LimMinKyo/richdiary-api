import { BadRequestException } from '@nestjs/common';

export class VerifyCodeInvalidException extends BadRequestException {
  constructor() {
    super('인증코드가 유효하지 않습니다.');
  }
}
