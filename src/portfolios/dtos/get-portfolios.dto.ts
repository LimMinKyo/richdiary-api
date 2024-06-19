import { ResponseDto } from '@/common/dtos/response.dto';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetPortfoliosResponse extends ResponseDto<PortfolioEntity[]> {
  @ApiProperty({ type: [PortfolioEntity] })
  data!: PortfolioEntity[];
}
