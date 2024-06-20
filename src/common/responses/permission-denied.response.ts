import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ResponseStatus, errorMessage } from '../common.constants';
import { ResponseDto } from '../dtos/response.dto';

export class PermissionDeniedResponse implements ResponseDto {
  @ApiProperty({
    enum: ResponseStatus,
    example: ResponseStatus.PERMISSION_DENIED,
  })
  statusCode!: ResponseStatus;

  @ApiProperty({ example: errorMessage[ResponseStatus.PERMISSION_DENIED] })
  message!: string;

  @ApiHideProperty()
  data = undefined;
}
