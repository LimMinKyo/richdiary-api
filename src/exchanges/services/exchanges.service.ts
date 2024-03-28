import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangesService {
  async getExchangeRate() {
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json',
    );
    const exchangeData = await response.json();

    const krwExchangeRate = +exchangeData.usd.krw.toFixed(2);

    return krwExchangeRate;
  }
}
