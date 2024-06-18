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

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { httpStatus, message } = this.getStatusCodeAndMessage(exception);

    const error = ResponseDto.ERROR_WITH(message);

    this.logger.error(error);
    response.status(httpStatus).json(error);
  }

  /**
   * Http Status 코드와 error message 가져오기
   */
  private getStatusCodeAndMessage(exception: unknown) {
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        httpStatus = HttpStatus.CONFLICT;
        message = exception.message.replace(/\n/g, '');
      }
    }

    return {
      httpStatus,
      message,
    };
  }
}
