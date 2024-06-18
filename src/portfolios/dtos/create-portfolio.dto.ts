import { ResponseDto } from '@/common/dtos/response.dto';
import { PickType } from '@nestjs/mapped-types';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioRequest extends PickType(PortfolioEntity, [
  'name',
]) {
  @ApiProperty()
  name!: string;
}

export class CreatePortfolioResponse extends ResponseDto {}
