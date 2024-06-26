import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { ResponseStatus } from '../common.constants';
import { DataNotFoundException } from '../exceptions/data-not-found.exception';
import { PermissionDeniedException } from '../exceptions/permission-denied.exception';
import { VerifyCodeInvalidException } from '@/users/exceptions/verify-code-invalid.exception';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { httpStatus, statusCode, message } =
      this.getHttpStatusAndStatusCodeAndMessage(exception);

    const error = ResponseDto.ERROR_WITH(message, statusCode);

    if (this.configService.get('NODE_ENV') !== 'test') {
      this.logger.error(error);
    }

    response.status(httpStatus).json(error);
  }

  /**
   * Http Status 코드와 error message 가져오기
   */
  private getHttpStatusAndStatusCodeAndMessage(exception: unknown) {
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let statusCode = ResponseStatus.SERVER_ERROR;
    let message = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      statusCode = this.getStatusCode(exception);
      message = exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        httpStatus = HttpStatus.CONFLICT;
        statusCode = ResponseStatus.CONFLICT;
        message = exception.message.replace(/\n/g, '');
      }
    }

    return {
      httpStatus,
      statusCode,
      message,
    };
  }

  private getStatusCode(exception: HttpException) {
    if (exception instanceof DataNotFoundException)
      return ResponseStatus.DATA_NOT_FOUND;
    if (exception instanceof PermissionDeniedException)
      return ResponseStatus.PERMISSION_DENIED;
    if (exception instanceof VerifyCodeInvalidException)
      return ResponseStatus.VERIFY_CODE_INVALID;

    return ResponseStatus.SERVER_ERROR;
  }
}
