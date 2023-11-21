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

@Controller('api/dividends')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post()
  create(
    @AuthUser() user: User,
    @Body() createDividendRequest: CreateDividendRequest,
  ): Promise<CreateDividendResponse> {
    return this.dividendsService.createDividend(user, createDividendRequest);
  }

  @Get()
  getDividends(
    @AuthUser() user: User,
    @Query() getDividendsRequest: GetDividendsRequest,
  ): Promise<GetDividendsResponse> {
    return this.dividendsService.getDividends(user, getDividendsRequest);
  }

  @Patch(':id')
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
  deleteDividend(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteDividendResponse> {
    return this.dividendsService.deleteDividend(user, +id);
  }
}
