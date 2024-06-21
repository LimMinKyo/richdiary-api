import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PortfoliosService } from '../services/portfolios.service';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';
import { CreatePortfolioRequest } from '../dtos/create-portfolio.dto';
import { UpdatePortfolioRequest } from '../dtos/update-portfolio.dto';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiOkResponseWithData } from '@/common/decorators/api-ok-response-with-data.decorator';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { OkWithDataResponseDto } from '@/common/responses/ok-with-data.response';
import { OkResponseDto } from '@/common/responses/ok.response';
import { PermissionDeniedResponseDto } from '@/common/responses/permission-denied.response';
import { DataNotFoundResponseDto } from '@/common/responses/data-not-found.response';

@ApiAuthRequired()
@ApiTags('포트폴리오 API')
@Controller('api/portfolios')
export class PortfoliosController {
  constructor(private readonly portfolioService: PortfoliosService) {}

  @Get()
  @ApiOperation({ summary: '내 포트폴리오 조회' })
  @ApiOkResponseWithData(PortfolioEntity, { isArray: true })
  async getPortfolios(
    @AuthUser() user: User,
  ): Promise<OkWithDataResponseDto<PortfolioEntity[]>> {
    const data = await this.portfolioService.getPortfolios(user);
    return ResponseDto.OK_WITH(data);
  }

  @Post()
  @ApiOperation({ summary: '포트폴리오 생성' })
  @ApiCreatedResponse({ type: OkResponseDto })
  async createPortfolio(
    @AuthUser() user: User,
    @Body() body: CreatePortfolioRequest,
  ): Promise<OkResponseDto> {
    await this.portfolioService.createPortfolio(user, body);
    return ResponseDto.OK();
  }

  @Patch(':id')
  @ApiOperation({ summary: '포트폴리오 수정' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiForbiddenResponse({ type: PermissionDeniedResponseDto })
  @ApiNotFoundResponse({ type: DataNotFoundResponseDto })
  async updatePortfolio(
    @AuthUser() user: User,
    @Param('id') portfolioId: string,
    @Body() body: UpdatePortfolioRequest,
  ): Promise<OkResponseDto> {
    await this.portfolioService.updatePortfolio(user, portfolioId, body);
    return ResponseDto.OK();
  }

  @Delete(':id')
  @ApiOperation({ summary: '포트폴리오 삭제' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiForbiddenResponse({ type: PermissionDeniedResponseDto })
  @ApiNotFoundResponse({ type: DataNotFoundResponseDto })
  async deletePortfolio(
    @AuthUser() user: User,
    @Param('id') portfolioId: string,
  ): Promise<OkResponseDto> {
    await this.portfolioService.deletePortfolio(user, portfolioId);
    return ResponseDto.OK();
  }
}
