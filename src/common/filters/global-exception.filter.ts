import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<HttpException> {
  logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const statusCode = this.getHttpStatus(exception);
    const dateTime = new Date();

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'INTERNAL_SERVER_ERROR';

    const error: ResponseDto = {
      ok: false,
      message,
    };

    const errorResponse = {
      ...error,
      code: statusCode,
      timestamp: dateTime,
      path: req.url,
      method: req.method,
      message: message,
    };

    if (exception instanceof HttpException) {
      this.logger.warn({ err: errorResponse });
    } else {
      this.logger.error({ err: errorResponse, args: { req, res } });
    }

    res.status(statusCode).json(errorResponse);
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
