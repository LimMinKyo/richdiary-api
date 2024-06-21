import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response.dto';
import { ResponseStatus, errorMessage } from '../common.constants';

export class DataNotFoundResponseDto implements ResponseDto {
  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.DATA_NOT_FOUND })
  statusCode = ResponseStatus.DATA_NOT_FOUND;

  @ApiProperty({ example: errorMessage[ResponseStatus.DATA_NOT_FOUND] })
  message = errorMessage[ResponseStatus.DATA_NOT_FOUND];
}
