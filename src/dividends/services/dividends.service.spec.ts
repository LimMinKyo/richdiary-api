import { Test, TestingModule } from '@nestjs/testing';
import { DividendsService } from './dividends.service';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { Currency, Dividend, User } from '@prisma/client';
import { CreateDividendRequest } from '../dtos/create-dividend.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import dayjs from 'dayjs';
import { ExchangesService } from '@/exchanges/services/exchanges.service';
import { ConfigService } from '@nestjs/config';
import { UpdateDividendRequest } from '../dtos/update-dividend.dto';
import { when } from 'jest-when';
import { PermissionDeniedException } from '@/common/exceptions/permission-denied.exception';
import { DataNotFoundException } from '@/common/exceptions/data-not-found.exception';

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
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get(DividendsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDividend', () => {
    it('성공적으로 배당일지가 생성된다.', async () => {
      // given
      const createDividendRequest: CreateDividendRequest = {
        dividend: mockDividend.dividend,
        dividendAt: dayjs(mockDividend.dividendAt).format('YYYY-MM-DD'),
        companyName: mockDividend.companyName,
        currency: mockDividend.currency,
        tax: mockDividend.tax,
      };
      when(prisma.dividend.create).calledWith({
        data: {
          ...createDividendRequest,
          dividendAt: dayjs(createDividendRequest.dividendAt).toISOString(),
          user: { connect: { id: mockUser.id } },
        },
      });

      // when
      const target = service.createDividend(mockUser, createDividendRequest);

      // then
      await expect(target).resolves.not.toThrow();
    });
  });

  describe('updateDividend', () => {
    it('성공적으로 배당일지가 수정된다.', async () => {
      // given
      const updateDividendRequest: UpdateDividendRequest = {
        dividend: 1000,
        dividendAt: '2024-07-02',
        companyName: 'newCompanyName',
        currency: Currency.USD,
        tax: 10,
      };
      when(prisma.dividend.findUnique)
        .calledWith({ where: { id: mockDividend.id } })
        .mockResolvedValue(mockDividend);

      // when
      const target = service.updateDividend(
        mockUser,
        mockDividend.id,
        updateDividendRequest,
      );

      // then
      await expect(target).resolves.not.toThrow();
    });

    it('없는 배당일지 수정을 요청할 경우 에러를 반환한다.', async () => {
      // given
      const updateDividendRequest: UpdateDividendRequest = {
        dividend: 1000,
        dividendAt: '2024-07-02',
        companyName: 'newCompanyName',
        currency: Currency.USD,
        tax: 10,
      };
      when(prisma.dividend.findUnique)
        .calledWith({ where: { id: mockDividend.id } })
        .mockResolvedValue(mockDividend);

      // when
      const target = service.updateDividend(
        mockUser,
        'Invalid Id',
        updateDividendRequest,
      );

      // then
      await expect(target).rejects.toThrow(DataNotFoundException);
    });

    it('해당 배당일지를 수정할 권한이 없는 경우 에러를 반환한다.', async () => {
      // given
      const updateDividendRequest: UpdateDividendRequest = {
        dividend: 1000,
        dividendAt: '2024-07-02',
        companyName: 'newCompanyName',
        currency: Currency.USD,
        tax: 10,
      };
      when(prisma.dividend.findUnique)
        .calledWith({ where: { id: mockDividend.id } })
        .mockResolvedValue(mockDividend);

      // when
      const target = service.updateDividend(
        { ...mockUser, id: 'No Permission User Id' },
        mockDividend.id,
        updateDividendRequest,
      );

      // then
      await expect(target).rejects.toThrow(PermissionDeniedException);
    });
  });

  describe('deleteDividend', () => {
    it('배당일지가 성공적으로 삭제된다.', async () => {
      // given
      when(prisma.dividend.findUnique)
        .calledWith({ where: { id: mockDividend.id } })
        .mockResolvedValue(mockDividend);

      // when
      const target = service.deleteDividend(mockUser, mockDividend.id);

      // then
      await expect(target).resolves.not.toThrow();
    });

    it('없는 배당일지 삭제를 요청할 경우 에러를 반환한다.', async () => {
      // given
      when(prisma.dividend.findUnique)
        .calledWith({ where: { id: mockDividend.id } })
        .mockResolvedValue(mockDividend);

      // when
      const target = service.deleteDividend(mockUser, 'Invalid Id');

      // then
      await expect(target).rejects.toThrow(DataNotFoundException);
    });

    it('해당 배당일지를 삭제할 권한이 없는 경우 에러를 반환한다.', async () => {
      // given
      when(prisma.dividend.findUnique)
        .calledWith({ where: { id: mockDividend.id } })
        .mockResolvedValue(mockDividend);

      // when
      const target = service.deleteDividend(
        { ...mockUser, id: 'No Permission User Id' },
        mockDividend.id,
      );

      // then
      await expect(target).rejects.toThrow(PermissionDeniedException);
    });
  });
});
