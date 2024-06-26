import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ResponseStatus, errorMessage } from '../../common.constants';
import { ResponseDto } from '../response.dto';

export class PermissionDeniedResponseDto implements ResponseDto {
  @ApiProperty({
    enum: ResponseStatus,
    example: ResponseStatus.PERMISSION_DENIED,
  })
  statusCode = ResponseStatus.PERMISSION_DENIED;

  @ApiProperty({ example: errorMessage[ResponseStatus.PERMISSION_DENIED] })
  message = errorMessage[ResponseStatus.PERMISSION_DENIED];
}
