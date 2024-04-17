import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export const deletePortfolioErrorMessage = {
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '해당 데이터가 존재하지 않습니다.',
};

export class DeletePortfolioResponse extends ResponseDto {}

export class DeletePortfolioForbiddenResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: deletePortfolioErrorMessage.FORBIDDEN })
  message!: string;
}

export class DeletePortfolioNotFoundResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: deletePortfolioErrorMessage.NOT_FOUND })
  message!: string;
}
