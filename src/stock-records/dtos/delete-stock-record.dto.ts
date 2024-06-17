import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export const deleteStockRecordErrorMessage = {
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '해당 데이터가 존재하지 않습니다.',
};

export class DeleteStockRecordResponse extends ResponseDto {}

export class DeleteStockRecordForbiddenResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: deleteStockRecordErrorMessage.FORBIDDEN })
  message!: string;
}

export class DeleteStockRecordNotFoundResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: deleteStockRecordErrorMessage.NOT_FOUND })
  message!: string;
}
