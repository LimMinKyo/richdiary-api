import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';
import {
  PageNumberCounters,
  PageNumberPagination,
} from 'prisma-extension-pagination/dist/types';
import { IsNumber, IsOptional } from 'class-validator';

export interface PaginationMeta
  extends PageNumberPagination,
    PageNumberCounters {
  perPage: number;
}

export class PaginationRequest {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  perPage?: number;
}

export class PaginationResponse<T> extends ResponseDto<T[]> {
  @ApiProperty()
  data!: T[];

  @ApiProperty()
  meta!: PaginationMeta;
}
