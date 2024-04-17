import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDividendRequest } from './create-dividend.dto';
import { ResponseDto } from '@/common/dtos/response.dto';

export const updateDividendErrorMessage = {
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '해당 데이터가 존재하지 않습니다.',
};

export class UpdateDividendRequest extends PartialType(CreateDividendRequest) {}

export class UpdateDividendResponse extends ResponseDto {}

export class UpdateDividendForbiddenResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: updateDividendErrorMessage.FORBIDDEN })
  message!: string;
}

export class UpdateDividendNotFoundResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: updateDividendErrorMessage.NOT_FOUND })
  message!: string;
}
