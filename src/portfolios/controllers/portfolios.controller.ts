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
import { GetPortfolioListResponse } from '../dtos/get-portfolio-list.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';
import {
  CreatePortfolioRequest,
  CreatePortfolioResponse,
} from '../dtos/create-portfolio.dto';
import {
  DeletePortfolioForbiddenResponse,
  DeletePortfolioNotFoundResponse,
  DeletePortfolioResponse,
} from '../dtos/delete-portfolio.dto';
import {
  UpdatePortfolioForbiddenResponse,
  UpdatePortfolioNotFoundResponse,
  UpdatePortfolioRequest,
  UpdatePortfolioResponse,
} from '../dtos/update-portfolio.dto';

@ApiExcludeController()
@ApiAuthRequired()
@ApiTags('포트폴리오 API')
@Controller('api/portfolios')
export class PortfoliosController {
  constructor(private readonly portfolioService: PortfoliosService) {}

  @Get()
  @ApiOperation({ summary: '내 포트폴리오 조회' })
  @ApiOkResponse({ type: GetPortfolioListResponse })
  async getPortfolioList(
    @AuthUser() user: User,
  ): Promise<GetPortfolioListResponse> {
    return await this.portfolioService.getPortfolioList(user);
  }

  @Post()
  @ApiOperation({ summary: '포트폴리오 생성' })
  @ApiCreatedResponse({ type: CreatePortfolioResponse })
  async createPortfolio(
    @AuthUser() user: User,
    @Body() createPortfolioRequest: CreatePortfolioRequest,
  ): Promise<CreatePortfolioResponse> {
    return await this.portfolioService.createPortfolio(
      user,
      createPortfolioRequest,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: '포트폴리오 수정' })
  @ApiOkResponse({ type: UpdatePortfolioResponse })
  @ApiForbiddenResponse({ type: UpdatePortfolioForbiddenResponse })
  @ApiNotFoundResponse({ type: UpdatePortfolioNotFoundResponse })
  async updatePortfolio(
    @AuthUser() user: User,
    @Param('id') portfolioId: number,
    @Body() updatePortfolioRequest: UpdatePortfolioRequest,
  ): Promise<UpdatePortfolioResponse> {
    return await this.portfolioService.updatePortfolio(
      user,
      portfolioId,
      updatePortfolioRequest,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '포트폴리오 삭제' })
  @ApiOkResponse({ type: DeletePortfolioResponse })
  @ApiForbiddenResponse({ type: DeletePortfolioForbiddenResponse })
  @ApiNotFoundResponse({ type: DeletePortfolioNotFoundResponse })
  async deletePortfolio(
    @AuthUser() user: User,
    @Param('id') portfolioId: number,
  ): Promise<DeletePortfolioResponse> {
    return await this.portfolioService.deletePortfolio(user, portfolioId);
  }
}
