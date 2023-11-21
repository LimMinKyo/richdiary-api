import { Test, TestingModule } from '@nestjs/testing';
import { DividendsService } from './dividends.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';
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
    it('Success', () => {
      // given
      const createDividendRequest: CreateDividendRequest = {
        dividend: 123,
        dividendAt: '2023-11-20',
        name: 'MSFT',
        unit: 'USD',
        tax: 3,
      };

      // when
      service.createDividend(mockUser, createDividendRequest);

      // then
      expect(prisma.dividend.create).toHaveBeenCalledTimes(1);
      expect(prisma.dividend.create).toHaveBeenCalledWith({
        data: {
          ...createDividendRequest,
          dividendAt: dayjs(createDividendRequest.dividendAt).toISOString(),
          userId: mockUser.id,
        },
      });
    });
  });

  describe('deleteDividend', () => {
    it('Success', async () => {
      // // given
      prisma.dividend.findFirst.mockResolvedValue({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        dividendAt: new Date(),
        name: 'MSFT',
        dividend: 123,
        tax: 1,
        unit: 'KRW',
        userId: 1,
      });

      // when
      const result = await service.deleteDividend(mockUser, 1);

      // then
      expect(result).toEqual({ ok: true });

      expect(prisma.dividend.delete).toHaveBeenCalledTimes(1);
      expect(prisma.dividend.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });
  });
});
