import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus, errorMessage } from '../common.constants';
import { OkResponseDto } from '../responses/ok.response';
import { OkWithDataResponseDto } from '../responses/ok-with-data.response';

export class ResponseDto<T = undefined> {
  @ApiProperty({ enum: ResponseStatus, description: '응답 코드' })
  readonly statusCode: ResponseStatus;

  @ApiProperty({ description: '응답 메시지', required: false })
  readonly message?: string;

  @ApiProperty({ description: '응답 데이터', required: false })
  readonly data?: T;

  constructor({
    statusCode,
    message,
    data,
  }: {
    statusCode: ResponseStatus;
    message?: string;
    data?: T;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static OK(): OkResponseDto {
    return new OkResponseDto();
  }

  static OK_WITH<T>(data: T): OkWithDataResponseDto<T> {
    return new OkWithDataResponseDto<T>(data);
  }

  static ERROR(): ResponseDto {
    return new ResponseDto({
      statusCode: ResponseStatus.SERVER_ERROR,
      message: errorMessage[ResponseStatus.SERVER_ERROR],
    });
  }

  static ERROR_WITH(
    message: string,
    statusCode: ResponseStatus = ResponseStatus.SERVER_ERROR,
  ): ResponseDto {
    return new ResponseDto({ statusCode, message });
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    data: T,
    statusCode: ResponseStatus = ResponseStatus.SERVER_ERROR,
  ): ResponseDto<T> {
    return new ResponseDto({ statusCode, message, data });
  }
}
