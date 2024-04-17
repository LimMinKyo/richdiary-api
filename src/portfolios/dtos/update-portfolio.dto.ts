import { ResponseDto } from '@/common/dtos/response.dto';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { CreatePortfolioRequest } from './create-portfolio.dto';
import { ApiProperty } from '@nestjs/swagger';

export const updatePortfolioErrorMessage = {
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '해당 데이터가 존재하지 않습니다.',
};

export class UpdatePortfolioRequest extends CreatePortfolioRequest {}

export class UpdatePortfolioResponse extends ResponseDto<PortfolioEntity> {}

export class UpdatePortfolioForbiddenResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: updatePortfolioErrorMessage.FORBIDDEN })
  message!: string;
}

export class UpdatePortfolioNotFoundResponse extends ResponseDto {
  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: updatePortfolioErrorMessage.NOT_FOUND })
  message!: string;
}
