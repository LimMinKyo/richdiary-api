import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CreateStockRecordRequest } from '../dtos/create-stock-record.dto';
import { StockRecordsService } from '../services/stock-records.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { UpdateStockRecordRequest } from '../dtos/update-stock-record.dto';
import { ApiOkResponsePaginated } from '@/common/decorators/api-ok-response-paginated.decorator';
import { StockRecordEntity } from '../entities/stock-record.entity';
import { GetStockRecordsRequest } from '../dtos/get-stock-records.dto';
import { ResponseDto } from '@/common/dtos/response.dto';
import { DataNotFoundResponse } from '@/common/responses/data-not-found.response';
import { PermissionDeniedResponse } from '@/common/responses/permission-denied.response';
import { OkResponse } from '@/common/responses/ok.response';
import { PaginationResponseDto } from '@/common/dtos/pagination.dto';

@ApiAuthRequired()
@ApiTags('주식투자기록 API')
@Controller('api/stock-records')
export class StockRecordsController {
  constructor(private readonly stockRecordsService: StockRecordsService) {}

  @Post()
  @ApiOperation({
    summary: '주식투자기록 추가',
  })
  @ApiCreatedResponse({
    type: CreateStockRecordRequest,
  })
  async createStockRecord(
    @AuthUser() user: User,
    @Body() body: CreateStockRecordRequest,
  ): Promise<OkResponse> {
    await this.stockRecordsService.createStockRecord(user, body);
    return ResponseDto.OK();
  }

  @Patch(':id')
  @ApiOperation({ summary: '주식투자기록 수정' })
  @ApiOkResponse({ type: OkResponse })
  @ApiForbiddenResponse({ type: PermissionDeniedResponse })
  @ApiNotFoundResponse({ type: DataNotFoundResponse })
  async updateStockRecord(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateStockRecordRequest,
  ): Promise<OkResponse> {
    await this.stockRecordsService.updateStockRecord(user, id, body);
    return ResponseDto.OK();
  }

  @Delete(':id')
  @ApiOperation({ summary: '주식투자기록 삭제' })
  @ApiOkResponse({ type: OkResponse })
  @ApiForbiddenResponse({ type: PermissionDeniedResponse })
  @ApiNotFoundResponse({ type: DataNotFoundResponse })
  async deleteStockRecord(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<OkResponse> {
    await this.stockRecordsService.deleteStockRecord(user, id);
    return ResponseDto.OK();
  }

  @Get()
  @ApiOperation({ summary: '주식투자기록 조회' })
  @ApiOkResponsePaginated(StockRecordEntity)
  async getStockRecordList(
    @AuthUser() user: User,
    @Query() query: GetStockRecordsRequest,
  ): Promise<PaginationResponseDto<StockRecordEntity>> {
    const data = await this.stockRecordsService.getStockRecordList(user, query);
    return ResponseDto.OK_WITH(data);
  }
}
