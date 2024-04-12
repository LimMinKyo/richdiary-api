import { ResponseDto } from '@/common/dtos/response.dto';
import { PortfolioEntity } from '../entities/portfolio.entity';

export class GetPortfolioListResponse extends ResponseDto<PortfolioEntity[]> {}
