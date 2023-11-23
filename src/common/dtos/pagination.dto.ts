import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

export class PaginationResponse<T> extends ResponseDto<T[]> {
  @ApiProperty()
  data!: T[];
}
