import { PrismaService } from '@/common/modules/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { ExchangeEntity } from '../entity/exchange.entity';

interface ExchangeApiData {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: 'USD';
  rates: {
    [key: string]: number;
  };
}

@Injectable()
export class ExchangesService {
  private readonly logger = new Logger(ExchangesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getExchangeRate(searchDate: string): Promise<ExchangeEntity> {
    searchDate = dayjs(searchDate).format('YYYY-MM');

    const data = await this.prisma.exchange.findUnique({
      where: {
        date_currency: {
          date: searchDate,
          currency: 'USD',
        },
      },
    });

    if (data) {
      return new ExchangeEntity(data);
    }

    const newData = await this.fetchAndSaveExchangeRate(searchDate);

    return new ExchangeEntity(newData);
  }

  private async fetchAndSaveExchangeRate(searchDate: string) {
    try {
      const APP_ID = this.configService.get('EXCHANGE_APP_ID');

      const searchDateEndOfMonth = dayjs(searchDate)
        .endOf('month')
        .format('YYYY-MM-DD');

      const requestUrl = new URL(
        `https://openexchangerates.org/api/historical/${searchDateEndOfMonth}.json`,
      );
      const searchParams = new URLSearchParams({
        app_id: APP_ID,
        symbols: ['KRW'].join(','),
        show_alternative: 'false',
        prettyprint: 'false',
      }).toString();

      requestUrl.search = searchParams;

      this.logger.debug('환율 조회 API 요청 Start');

      const response = await fetch(requestUrl);
      const exchangeApiData: ExchangeApiData = await response.json();

      this.logger.debug('환율 조회 API 요청 End');

      const data = await this.prisma.exchange.create({
        data: {
          date: dayjs(searchDate).format('YYYY-MM'),
          currency: 'USD',
          rate: +exchangeApiData.rates['KRW'].toFixed(2),
        },
      });

      return data;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        '환율 데이터 조회에 실패했습니다.',
      );
    }
  }
}
