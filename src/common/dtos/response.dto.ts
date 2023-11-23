import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto<T = undefined> {
  @ApiProperty({ description: 'API 성공 여부' })
  ok!: boolean;

  @ApiPropertyOptional({ description: '메세지' })
  message?: string;

  @ApiPropertyOptional({ description: '데이터' })
  data?: T;
}
