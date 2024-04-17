import { ResponseDto } from '@/common/dtos/response.dto';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetPortfolioListResponse extends ResponseDto<PortfolioEntity[]> {
  @ApiProperty({ type: [PortfolioEntity] })
  data!: PortfolioEntity[];
}
