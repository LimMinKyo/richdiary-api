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
} from '../dto/create-dividend.dto';
import {
  UpdateDividendRequest,
  UpdateDividendResponse,
} from '../dto/update-dividend.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import {
  GetDividendsRequest,
  GetDividendsResponse,
} from '../dto/get-dividends.dto';
import { DeleteDividendResponse } from '../dto/delete-dividend.dto';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DividendEntity } from '../entities/dividend.entity';
import { ApiOkResponsePaginated } from '@/common/decorators/api-ok-response-paginated.decorator';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';

@ApiAuthRequired()
@ApiTags('배당일지 API')
@Controller('api/dividends')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post()
  @ApiOperation({
    summary: '배당일지 추가',
  })
  @ApiExtraModels(CreateDividendResponse)
  @ApiCreatedResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(CreateDividendResponse) }],
      example: {
        ok: true,
      },
    },
  })
  createDividend(
    @AuthUser() user: User,
    @Body() createDividendRequest: CreateDividendRequest,
  ): Promise<CreateDividendResponse> {
    return this.dividendsService.createDividend(user, createDividendRequest);
  }

  @Get()
  @ApiOperation({ summary: '배당일지 조회' })
  @ApiOkResponsePaginated(DividendEntity)
  getDividends(
    @AuthUser() user: User,
    @Query() getDividendsRequest: GetDividendsRequest,
  ): Promise<GetDividendsResponse> {
    return this.dividendsService.getDividends(user, getDividendsRequest);
  }

  @Patch(':id')
  @ApiOperation({ summary: '배당일지 수정' })
  @ApiExtraModels(UpdateDividendResponse)
  @ApiOkResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(UpdateDividendResponse) }],
      example: {
        ok: true,
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(UpdateDividendResponse) }],
      example: {
        ok: false,
        message: '해당 데이터를 삭제할 권한이 없습니다.',
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(UpdateDividendResponse) }],
      example: {
        ok: false,
        message: '해당 데이터가 존재하지 않습니다.',
      },
    },
  })
  updateDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateDividendRequest: UpdateDividendRequest,
  ): Promise<UpdateDividendResponse> {
    return this.dividendsService.updateDividend(
      user,
      +id,
      updateDividendRequest,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '배당일지 삭제' })
  @ApiExtraModels(DeleteDividendResponse)
  @ApiOkResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(DeleteDividendResponse) }],
      example: {
        ok: true,
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(DeleteDividendResponse) }],
      example: {
        ok: false,
        message: '해당 데이터가 존재하지 않습니다.',
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(DeleteDividendResponse) }],
      example: {
        ok: false,
        message: '해당 데이터가 존재하지 않습니다.',
      },
    },
  })
  deleteDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteDividendResponse> {
    return this.dividendsService.deleteDividend(user, +id);
  }
}
