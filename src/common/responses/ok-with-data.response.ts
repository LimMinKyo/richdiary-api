import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response.dto';
import { ResponseStatus } from '../common.constants';

export class OkWithDataResponseDto<T> implements ResponseDto<T> {
  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.OK })
  statusCode = ResponseStatus.OK;

  @ApiProperty()
  data!: T;

  constructor(data: T) {
    this.data = data;
  }
}
