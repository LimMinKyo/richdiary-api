import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PageNumberCounters,
  PageNumberPagination,
} from 'prisma-extension-pagination/dist/types';
import { IsNumber, IsOptional } from 'class-validator';
import { ResponseDto } from './response.dto';

export class PaginationMeta
  implements PageNumberPagination, PageNumberCounters
{
  @ApiProperty({ example: 1 })
  currentPage!: number;

  @ApiProperty({ example: true })
  isFirstPage!: boolean;

  @ApiProperty({ example: false })
  isLastPage!: boolean;

  @ApiProperty({ example: 2 })
  nextPage!: number | null;

  @ApiProperty({ example: 3 })
  pageCount!: number;

  @ApiProperty({ example: null })
  previousPage!: number | null;

  @ApiProperty({ example: 13 })
  totalCount!: number;
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

export class PaginationData<T> {
  @ApiProperty()
  data!: T[];

  @ApiProperty({ type: PaginationMeta })
  meta!: PaginationMeta;
}

export class PaginationResponseDto<T> extends ResponseDto<PaginationData<T>> {}
