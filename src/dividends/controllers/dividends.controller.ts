import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DividendsService } from '../services/dividends.service';
import { CreateDividendRequest } from '../dtos/create-dividend.dto';
import { UpdateDividendRequest } from '../dtos/update-dividend.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { GetDividendsMonthRequest } from '../dtos/get-dividends-month.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DividendEntity } from '../entities/dividend.entity';
import { ApiOkResponsePaginated } from '@/common/decorators/api-ok-response-paginated.decorator';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';
import {
  GetDividendsYearRequest,
  GetDividendsYearResponseData,
} from '../dtos/get-dividends-year.dto';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiOkResponseWithData } from '@/common/decorators/api-ok-response-with-data.decorator';
import { PaginationResponseDto } from '@/common/dtos/pagination.dto';
import { OkResponseDto } from '@/common/dtos/ok/ok.dto';
import { PermissionDeniedResponseDto } from '@/common/dtos/error/permission-denied.dto';
import { DataNotFoundResponseDto } from '@/common/dtos/error/data-not-found.dto';
import { OkWithDataResponseDto } from '@/common/dtos/ok/ok-with-data.dto';

@ApiAuthRequired()
@ApiTags('배당일지 API')
@Controller('api/dividends')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post()
  @ApiOperation({ summary: '배당일지 추가' })
  @ApiCreatedResponse({ type: OkResponseDto })
  async createDividend(
    @AuthUser() user: User,
    @Body() body: CreateDividendRequest,
  ): Promise<OkResponseDto> {
    await this.dividendsService.createDividend(user, body);
    return ResponseDto.OK();
  }

  @Patch(':id')
  @ApiOperation({ summary: '배당일지 수정' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiForbiddenResponse({ type: PermissionDeniedResponseDto })
  @ApiNotFoundResponse({ type: DataNotFoundResponseDto })
  async updateDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateDividendRequest,
  ): Promise<OkResponseDto> {
    await this.dividendsService.updateDividend(user, id, body);
    return ResponseDto.OK();
  }

  @Delete(':id')
  @ApiOperation({ summary: '배당일지 삭제' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiForbiddenResponse({ type: PermissionDeniedResponseDto })
  @ApiNotFoundResponse({ type: DataNotFoundResponseDto })
  async deleteDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<OkResponseDto> {
    await this.dividendsService.deleteDividend(user, id);
    return ResponseDto.OK();
  }

  @Get('month')
  @ApiOperation({ summary: '배당일지 조회' })
  @ApiOkResponsePaginated(DividendEntity)
  async getDividends(
    @AuthUser() user: User,
    @Query() query: GetDividendsMonthRequest,
  ): Promise<PaginationResponseDto<DividendEntity>> {
    const data = await this.dividendsService.getDividendsMonth(user, query);
    return ResponseDto.OK_WITH(data);
  }

  @Get('year')
  @ApiOperation({ summary: '배당일지 연간 통계' })
  @ApiOkResponseWithData(GetDividendsYearResponseData)
  async getDividendsYear(
    @AuthUser() user: User,
    @Query() query: GetDividendsYearRequest,
  ): Promise<OkWithDataResponseDto<GetDividendsYearResponseData>> {
    const data = await this.dividendsService.getDividendsYear(user, query);
    return ResponseDto.OK_WITH(data);
  }
}
