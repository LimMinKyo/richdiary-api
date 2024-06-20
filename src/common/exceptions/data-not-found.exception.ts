import { NotFoundException } from '@nestjs/common';
import { ResponseStatus, errorMessage } from '../common.constants';

export class DataNotFoundException extends NotFoundException {
  constructor() {
    super(errorMessage[ResponseStatus.DATA_NOT_FOUND]);
  }
}
