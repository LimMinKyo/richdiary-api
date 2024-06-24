import { ResponseStatus, errorMessage } from '@/common/common.constants';
import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistException extends BadRequestException {
  constructor() {
    super(errorMessage[ResponseStatus.EMAIL_ALREADY_EXIST]);
  }
}
