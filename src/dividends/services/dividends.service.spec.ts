import { Test, TestingModule } from '@nestjs/testing';
import { DividendsService } from './dividends.service';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { Currency, Dividend, PrismaClient, User } from '@prisma/client';
import { CreateDividendRequest } from '../dtos/create-dividend.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import dayjs from 'dayjs';
import { ExchangesService } from '@/exchanges/services/exchanges.service';
import { ConfigService } from '@nestjs/config';

const mockUser: User = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '홍길동',
  email: 'test@test.com',
  password: null,
  provider: 'KAKAO',
  verified: true,
};

const mockDividend: Dividend = {
  id: '2',
  createdAt: new Date(),
  updatedAt: new Date(),
  dividendAt: new Date(),
  companyName: 'MSFT',
  dividend: 123,
  tax: 1,
  currency: Currency.KRW,
  userId: mockUser.id,
  portfolioId: null,
};

describe('DividendsService', () => {
  let service: DividendsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        DividendsService,
        ExchangesService,
        ConfigService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(DividendsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDividend', () => {
    it('Success', async () => {
      // given
      const createDividendRequest: CreateDividendRequest = {
        dividend: mockDividend.dividend,
        dividendAt: dayjs(mockDividend.dividendAt).format('YYYY-MM-DD'),
        companyName: mockDividend.companyName,
        currency: mockDividend.currency,
        tax: mockDividend.tax,
      };

      // when
      await service.createDividend(mockUser, createDividendRequest);
    });
  });

  describe('deleteDividend', () => {
    it('Success', async () => {
      // // given
      prisma.dividend.findFirst.mockResolvedValue(mockDividend);

      // when
      await service.deleteDividend(mockUser, mockDividend.id);
    });
  });
});
