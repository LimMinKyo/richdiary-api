import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_AUTH_TOKEN_KEY } from '../common.constants';

export const ApiAuthRequired = () =>
  applyDecorators(ApiBearerAuth(SWAGGER_AUTH_TOKEN_KEY));
