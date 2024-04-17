import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export const deleteDividendErrorMessage = {
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '해당 데이터가 존재하지 않습니다.',
};

export class DeleteDividendResponse extends ResponseDto {}
export class DeleteDividendForbiddenResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: deleteDividendErrorMessage.FORBIDDEN })
  message!: string;
}

export class DeleteDividendNotFoundResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: deleteDividendErrorMessage.NOT_FOUND })
  message!: string;
}
