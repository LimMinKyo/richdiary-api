import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response.dto';
import { ResponseStatus } from '../common.constants';

export class OkWithDataResponse<T> implements ResponseDto<T> {
  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.OK })
  statusCode!: ResponseStatus;

  @ApiHideProperty()
  message?: string;

  @ApiProperty()
  data!: T;
}
