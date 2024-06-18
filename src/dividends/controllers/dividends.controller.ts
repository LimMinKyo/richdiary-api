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
import { ResponseDto } from '@/common/dtos/response.dto';

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
  async createDividend(
    @AuthUser() user: User,
    @Body() body: CreateDividendRequest,
  ): Promise<CreateDividendResponse> {
    await this.dividendsService.createDividend(user, body);
    return ResponseDto.OK();
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
  async updateDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateDividendRequest,
  ): Promise<UpdateDividendResponse> {
    await this.dividendsService.updateDividend(user, id, body);
    return ResponseDto.OK();
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
  async deleteDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteDividendResponse> {
    await this.dividendsService.deleteDividend(user, id);
    return ResponseDto.OK();
  }

  @Get('month')
  @ApiOperation({ summary: '배당일지 조회' })
  @ApiOkResponsePaginated(DividendEntity)
  async getDividends(
    @AuthUser() user: User,
    @Query() query: GetDividendsMonthRequest,
  ): Promise<GetDividendsMonthResponse> {
    const data = await this.dividendsService.getDividendsMonth(user, query);
    return ResponseDto.OK_WITH(data);
  }

  @Get('year')
  @ApiOperation({ summary: '배당일지 연간 통계' })
  @ApiOkResponse({ type: GetDividendsYearResponse })
  async getDividendsYear(
    @AuthUser() user: User,
    @Query() query: GetDividendsYearRequest,
  ): Promise<GetDividendsYearResponse> {
    const data = await this.dividendsService.getDividendsYear(user, query);
    return ResponseDto.OK_WITH(data);
  }
}
