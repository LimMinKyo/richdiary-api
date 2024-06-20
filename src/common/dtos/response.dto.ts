import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus, errorMessage } from '../common.constants';

export class ResponseDto<T = undefined> {
  @ApiProperty({ enum: ResponseStatus, description: '응답 코드' })
  readonly statusCode: ResponseStatus;

  @ApiProperty({ description: '응답 메시지', required: false })
  readonly message?: string;

  @ApiProperty({ description: '응답 데이터', required: false })
  readonly data: T;

  constructor({
    statusCode,
    message,
    data,
  }: {
    statusCode: ResponseStatus;
    data: T;
    message?: string;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static OK(): ResponseDto {
    return new ResponseDto({
      statusCode: ResponseStatus.OK,
      data: undefined,
    });
  }

  static OK_WITH<T>(data: T): ResponseDto<T> {
    return new ResponseDto<T>({
      statusCode: ResponseStatus.OK,
      data,
    });
  }

  static ERROR(): ResponseDto {
    return new ResponseDto({
      statusCode: ResponseStatus.SERVER_ERROR,
      message: errorMessage[ResponseStatus.SERVER_ERROR],
      data: undefined,
    });
  }

  static ERROR_WITH(
    message: string,
    statusCode: ResponseStatus = ResponseStatus.SERVER_ERROR,
  ): ResponseDto {
    return new ResponseDto({ statusCode, message, data: undefined });
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    data: T,
    statusCode: ResponseStatus = ResponseStatus.SERVER_ERROR,
  ): ResponseDto<T> {
    return new ResponseDto({ statusCode, message, data });
  }
}
