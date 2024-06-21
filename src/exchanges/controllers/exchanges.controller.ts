import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExchangesService } from '../services/exchanges.service';
import { Public } from '@/auth/decorators/public.decorator';
import { GetExchangeRateRequest } from '../dtos/get-exchange-rate.dto';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiOkResponseWithData } from '@/common/decorators/api-ok-response-with-data.decorator';
import { ExchangeEntity } from '../entity/exchange.entity';
import { OkWithDataResponseDto } from '@/common/dtos/ok/ok-with-data.dto';

@ApiTags('환율 API')
@Controller('api/exchanges')
export class ExchangesController {
  constructor(private readonly exchnagesService: ExchangesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '환율 조회',
  })
  @ApiOkResponseWithData(ExchangeEntity)
  async getExchangeRate(
    @Query() { searchDate }: GetExchangeRateRequest,
  ): Promise<OkWithDataResponseDto<ExchangeEntity>> {
    const data = await this.exchnagesService.getExchangeRate(searchDate);
    return ResponseDto.OK_WITH(data);
  }
}
