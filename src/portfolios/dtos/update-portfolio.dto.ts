import { ResponseDto } from '@/common/dtos/response.dto';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { CreatePortfolioRequest } from './create-portfolio.dto';

export class UpdatePortfolioRequest extends CreatePortfolioRequest {}

export class UpdatePortfolioResponse extends ResponseDto<PortfolioEntity> {}
