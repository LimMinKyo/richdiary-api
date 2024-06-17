import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStockRecordRequest } from './create-stock-record.dto';
import { ResponseDto } from '@/common/dtos/response.dto';

export const updateStockRecordErrorMessage = {
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '해당 데이터가 존재하지 않습니다.',
};

export class UpdateStockRecordRequest extends PartialType(
  CreateStockRecordRequest,
) {}

export class UpdateStockRecordResponse extends ResponseDto {}

export class UpdateStockRecordForbiddenResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: updateStockRecordErrorMessage.FORBIDDEN })
  message!: string;
}

export class UpdateStockRecordNotFoundResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: updateStockRecordErrorMessage.NOT_FOUND })
  message!: string;
}
