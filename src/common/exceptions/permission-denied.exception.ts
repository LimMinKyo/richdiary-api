import { ForbiddenException } from '@nestjs/common';
import { ResponseStatus, errorMessage } from '../common.constants';

export class PermissionDeniedException extends ForbiddenException {
  constructor() {
    super(errorMessage[ResponseStatus.PERMISSION_DENIED]);
  }
}
