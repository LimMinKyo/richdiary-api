import { Test, TestingModule } from '@nestjs/testing';
import { DividendsService } from './dividends.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Dividend, PrismaClient, User } from '@prisma/client';
import { CreateDividendRequest } from '../dto/create-dividend.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import dayjs from 'dayjs';

const mockUser: User = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '홍길동',
  email: 'test@test.com',
  password: null,
  provider: 'KAKAO',
  verified: true,
};

const mockDividend: Dividend = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  dividendAt: new Date(),
  name: 'MSFT',
  dividend: 123,
  tax: 1,
  unit: 'KRW',
  userId: mockUser.id,
};

describe('DividendsService', () => {
  let service: DividendsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DividendsService, PrismaService],
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
        name: mockDividend.name,
        unit: mockDividend.unit,
        tax: mockDividend.tax,
      };

      // when
      const result = await service.createDividend(
        mockUser,
        createDividendRequest,
      );

      // then
      expect(result).toEqual({
        ok: true,
      });
    });
  });

  describe('deleteDividend', () => {
    it('Success', async () => {
      // // given
      prisma.dividend.findFirst.mockResolvedValue(mockDividend);

      // when
      const result = await service.deleteDividend(mockUser, 1);

      // then
      expect(result).toEqual({ ok: true });
    });
  });
});
