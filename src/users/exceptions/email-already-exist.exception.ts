import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistException extends BadRequestException {
  constructor() {
    super('해당 이메일은 이미 존재합니다.');
  }
}
