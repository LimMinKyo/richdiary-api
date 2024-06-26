import { AppModule } from '@/app.module';
import {
  PaginationMeta,
  PaginationResponseDto,
} from '@/common/dtos/pagination.dto';
import { CreateDividendRequest } from '@/dividends/dtos/create-dividend.dto';
import { GetDividendsMonthRequest } from '@/dividends/dtos/get-dividends-month.dto';
import { UpdateDividendRequest } from '@/dividends/dtos/update-dividend.dto';
import { DividendEntity } from '@/dividends/entities/dividend.entity';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Currency, User } from '@prisma/client';
import request from 'supertest';
import { OkResponseDto } from '@/common/dtos/ok/ok.dto';
import { PermissionDeniedResponseDto } from '@/common/dtos/error/permission-denied.dto';
import { DataNotFoundResponseDto } from '@/common/dtos/error/data-not-found.dto';
import { randomUUID } from 'crypto';

const paginationMetaShape = expect.objectContaining<PaginationMeta>({
  isFirstPage: expect.any(Boolean),
  isLastPage: expect.any(Boolean),
  currentPage: expect.any(Number),
  previousPage: expect.toBeOneOf([expect.any(Number), null]),
  nextPage: expect.toBeOneOf([expect.any(Number), null]),
  pageCount: expect.any(Number),
  totalCount: expect.any(Number),
});

describe('/api/dividends', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let otherUser: User;
  let accessToken: string;
  let otherAccessToken: string;
  const dividendShape: DividendEntity = expect.objectContaining({
    id: expect.any(String),
    dividendAt: expect.any(String),
    companyName: expect.any(String),
    dividend: expect.any(Number),
    tax: expect.any(Number),
    currency: expect.any(String),
  });

  const createDividendRequest: CreateDividendRequest = {
    companyName: 'MSFT',
    dividendAt: '2023-11-10',
    currency: Currency.KRW,
    dividend: 123,
    tax: 1,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);
    const jwtService = app.get(JwtService);

    await app.init();

    user = await prisma.user.create({
      data: {
        name: '홍길동',
        email: 'dividends@test.com',
        provider: 'KAKAO',
      },
    });

    otherUser = await prisma.user.create({
      data: {
        name: '김철수',
        email: 'dividends1@test.com',
        provider: 'LOCAL',
      },
    });

    accessToken = jwtService.sign({ id: user.id });
    otherAccessToken = jwtService.sign({ id: otherUser.id });
  });

  afterAll(async () => {
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/dividends', () => {
    it('배당일지를 성공적으로 생성한다.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/api/dividends')
        .auth(accessToken, { type: 'bearer' })
        .send(createDividendRequest);

      expect(status).toBe(201);
      expect(body).toEqual(new OkResponseDto());
    });
  });

  describe('GET /api/dividends/month', () => {
    it('해당 월에 해당하는 배당일지 리스트를 조회한다.', async () => {
      const getDividendsRequest: GetDividendsMonthRequest = {
        date: '2023-11',
      };

      const { status, body } = await request(app.getHttpServer())
        .get('/api/dividends/month')
        .auth(accessToken, { type: 'bearer' })
        .query(getDividendsRequest);

      expect(status).toBe(200);
      expect(body).toEqual(
        new PaginationResponseDto({
          data: expect.arrayContaining([dividendShape]),
          meta: paginationMetaShape,
        }),
      );
    });
  });

  describe('PATCH /api/dividends/:dividendId', () => {
    it('다른 사람의 배당일지를 수정하지 못한다.', async () => {
      const [dividend] = await prisma.dividend.findMany();

      const { status, body } = await request(app.getHttpServer())
        .patch(`/api/dividends/${dividend.id}`)
        .auth(otherAccessToken, { type: 'bearer' });

      expect(status).toBe(403);
      expect(body).toEqual(new PermissionDeniedResponseDto());
    });

    it('없는 배당일지는 수정하지 못한다.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/api/dividends/${randomUUID()}`)
        .auth(accessToken, { type: 'bearer' });

      expect(status).toBe(404);
      expect(body).toEqual(new DataNotFoundResponseDto());
    });

    it('배당일지를 성공적으로 수정한다.', async () => {
      const [dividend] = await prisma.dividend.findMany();
      const dividendId = dividend.id;
      const updateDividendRequest: UpdateDividendRequest = {
        companyName: 'APPL',
        dividend: 100,
        tax: 2,
        dividendAt: '2023-11-01',
        currency: Currency.USD,
      };

      const { status, body } = await request(app.getHttpServer())
        .patch(`/api/dividends/${dividendId}`)
        .auth(accessToken, { type: 'bearer' })
        .send(updateDividendRequest);

      expect(status).toBe(200);
      expect(body).toEqual(new OkResponseDto());

      const updatedDividend = await prisma.dividend.findFirst({
        where: { id: dividendId },
      });
      expect(updatedDividend).toEqual({
        ...dividend,
        ...updateDividendRequest,
        updatedAt: expect.any(Date),
        dividendAt: new Date(new Date('2023-11-01').toISOString()),
      });
    });
  });

  describe('DELETE /api/dividends/:dividendId', () => {
    it('다른 사람의 배당일지를 삭제하지 못한다.', async () => {
      const [dividend] = await prisma.dividend.findMany();

      const { status, body } = await request(app.getHttpServer())
        .delete(`/api/dividends/${dividend.id}`)
        .auth(otherAccessToken, { type: 'bearer' });

      const count = await prisma.dividend.count();

      expect(status).toBe(403);
      expect(body).toEqual(new PermissionDeniedResponseDto());

      expect(count).toBe(1);
    });

    it('없는 배당일지는 삭제하지 못한다.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`/api/dividends/${randomUUID()}`)
        .auth(accessToken, { type: 'bearer' });

      expect(status).toBe(404);
      expect(body).toEqual(new DataNotFoundResponseDto());
    });

    it('배당일지를 성공적으로 삭제한다.', async () => {
      const [dividend] = await prisma.dividend.findMany();

      const { status, body } = await request(app.getHttpServer())
        .delete(`/api/dividends/${dividend.id}`)
        .auth(accessToken, { type: 'bearer' });

      const count = await prisma.dividend.count();

      expect(status).toBe(200);
      expect(body).toEqual(new OkResponseDto());

      expect(count).toBe(0);
    });
  });
});
