import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

interface HttpError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

@Catch()
export default class CatchExceptionFilter
  implements ExceptionFilter<HttpException>
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    let httpError: HttpError;

    if (exception instanceof HttpException) {
      // status: XXX, message: 'XXX' 형식의 에러인지 판단합니다.
      httpError = {
        status: statusCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    } else {
      // XXXX() is not a function와 같은 서버 자체에서의 오류일때, 서버 오류로 처리합니다.
      httpError = {
        status: 500,
        message: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    response.status(statusCode).json(httpError);
  }
}
