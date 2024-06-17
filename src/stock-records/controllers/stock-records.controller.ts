import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  CreateStockRecordRequest,
  CreateStockRecordResponse,
} from '../dtos/create-stock-record.dto';
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
import {
  UpdateStockRecordForbiddenResponse,
  UpdateStockRecordNotFoundResponse,
  UpdateStockRecordRequest,
  UpdateStockRecordResponse,
} from '../dtos/update-stock-record.dto';
import {
  DeleteStockRecordForbiddenResponse,
  DeleteStockRecordNotFoundResponse,
  DeleteStockRecordResponse,
} from '../dtos/delete-stock-record.dto';

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
  createStockRecord(
    @AuthUser() user: User,
    @Body() createDividendRequest: CreateStockRecordRequest,
  ): Promise<CreateStockRecordResponse> {
    return this.stockRecordsService.createStockRecord(
      user,
      createDividendRequest,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: '주식투자기록 수정' })
  @ApiOkResponse({
    type: UpdateStockRecordResponse,
  })
  @ApiForbiddenResponse({
    type: UpdateStockRecordForbiddenResponse,
  })
  @ApiNotFoundResponse({
    type: UpdateStockRecordNotFoundResponse,
  })
  updateStockRecord(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateStockRecordRequest: UpdateStockRecordRequest,
  ): Promise<UpdateStockRecordResponse> {
    return this.stockRecordsService.updateStockRecord(
      user,
      id,
      updateStockRecordRequest,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '주식투자기록 삭제' })
  @ApiOkResponse({
    type: DeleteStockRecordResponse,
  })
  @ApiForbiddenResponse({
    type: DeleteStockRecordForbiddenResponse,
  })
  @ApiNotFoundResponse({
    type: DeleteStockRecordNotFoundResponse,
  })
  deleteStockRecord(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteStockRecordResponse> {
    return this.stockRecordsService.deleteStockRecord(user, id);
  }
}
