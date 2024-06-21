import { ResponseStatus } from '@/common/common.constants';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../response.dto';

export class OkResponseDto implements ResponseDto {
  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.OK })
  statusCode = ResponseStatus.OK;
}
