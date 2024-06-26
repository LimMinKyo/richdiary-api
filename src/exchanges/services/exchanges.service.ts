import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
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

  async getExchangeRate(searchdate: string): Promise<ExchangeEntity> {
    const APP_ID = this.configService.get('EXCHANGE_APP_ID');

    const formatedSearchDate = dayjs(searchdate).format('YYYY-MM');

    let data = await this.prisma.exchange.findUnique({
      where: {
        date_currency: {
          date: formatedSearchDate,
          currency: 'USD',
        },
      },
    });

    if (!data) {
      const searchDateEndOfMonth = dayjs(searchdate)
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

      const response = await fetch(requestUrl);
      const exchangeApiData: ExchangeApiData = await response.json();

      this.logger.debug('환율 조회 API 요청');

      data = await this.prisma.exchange.create({
        data: {
          date: formatedSearchDate,
          currency: 'USD',
          rate: +exchangeApiData.rates['KRW'].toFixed(2),
        },
      });
    }

    return new ExchangeEntity(data);
  }
}
