import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = undefined> {
  @ApiProperty({ description: 'API 성공 여부' })
  ok!: boolean;

  message?: string;

  data?: T;
}
