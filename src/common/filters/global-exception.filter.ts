import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();

    let httpError: ResponseDto;

    if (exception instanceof HttpException) {
      // status: XXX, message: 'XXX' 형식의 에러인지 판단합니다.
      httpError = {
        ok: false,
        message: exception.message,
      };
    } else {
      // XXXX() is not a function와 같은 서버 자체에서의 오류일때, 서버 오류로 처리합니다.
      httpError = {
        ok: false,
        message: 'INTERNAL_SERVER_ERROR',
      };
    }

    response.status(statusCode).json(httpError);
  }
}
