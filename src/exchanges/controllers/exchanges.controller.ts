import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExchangesService } from '../services/exchanges.service';
import { Public } from '@/auth/decorators/public.decorator';
import {
  GetExchangeRateRequest,
  GetExchangeRateResponse,
} from '../dtos/get-exchange-rate.dto';

@ApiTags('환율 API')
@Controller('api/exchanges')
export class ExchangesController {
  constructor(private readonly exchnagesService: ExchangesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '환율 조회',
  })
  @ApiOkResponse({ type: GetExchangeRateResponse })
  getExchangeRate(
    @Query() { searchDate }: GetExchangeRateRequest,
  ): Promise<GetExchangeRateResponse> {
    return this.exchnagesService.getExchangeRate(searchDate);
  }
}
