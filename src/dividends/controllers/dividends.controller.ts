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
import {
  CreateDividendRequest,
  CreateDividendResponse,
} from '../dtos/create-dividend.dto';
import {
  UpdateDividendForbiddenResponse,
  UpdateDividendNotFoundResponse,
  UpdateDividendRequest,
  UpdateDividendResponse,
} from '../dtos/update-dividend.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import {
  GetDividendsMonthRequest,
  GetDividendsMonthResponse,
} from '../dtos/get-dividends-month.dto';
import {
  DeleteDividendForbiddenResponse,
  DeleteDividendNotFoundResponse,
  DeleteDividendResponse,
} from '../dtos/delete-dividend.dto';
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
  GetDividendsYearResponse,
} from '../dtos/get-dividends-year.dto';

@ApiAuthRequired()
@ApiTags('배당일지 API')
@Controller('api/dividends')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post()
  @ApiOperation({
    summary: '배당일지 추가',
  })
  @ApiCreatedResponse({
    type: CreateDividendResponse,
  })
  createDividend(
    @AuthUser() user: User,
    @Body() createDividendRequest: CreateDividendRequest,
  ): Promise<CreateDividendResponse> {
    return this.dividendsService.createDividend(user, createDividendRequest);
  }

  @Patch(':id')
  @ApiOperation({ summary: '배당일지 수정' })
  @ApiOkResponse({
    type: UpdateDividendResponse,
  })
  @ApiForbiddenResponse({
    type: UpdateDividendForbiddenResponse,
  })
  @ApiNotFoundResponse({
    type: UpdateDividendNotFoundResponse,
  })
  updateDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateDividendRequest: UpdateDividendRequest,
  ): Promise<UpdateDividendResponse> {
    return this.dividendsService.updateDividend(
      user,
      id,
      updateDividendRequest,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '배당일지 삭제' })
  @ApiOkResponse({
    type: DeleteDividendResponse,
  })
  @ApiForbiddenResponse({
    type: DeleteDividendForbiddenResponse,
  })
  @ApiNotFoundResponse({
    type: DeleteDividendNotFoundResponse,
  })
  deleteDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteDividendResponse> {
    return this.dividendsService.deleteDividend(user, id);
  }

  @Get('month')
  @ApiOperation({ summary: '배당일지 조회' })
  @ApiOkResponsePaginated(DividendEntity)
  getDividends(
    @AuthUser() user: User,
    @Query() getDividendsRequest: GetDividendsMonthRequest,
  ): Promise<GetDividendsMonthResponse> {
    return this.dividendsService.getDividends(user, getDividendsRequest);
  }

  @Get('year')
  @ApiOperation({ summary: '배당일지 연간 통계' })
  @ApiOkResponse({ type: GetDividendsYearResponse })
  async getDividendsYear(
    @AuthUser() user: User,
    @Query() getDividendsYearRequest: GetDividendsYearRequest,
  ): Promise<GetDividendsYearResponse> {
    return this.dividendsService.getDividendsYear(
      user,
      getDividendsYearRequest,
    );
  }
}
