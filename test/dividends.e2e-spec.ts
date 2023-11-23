import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDividendRequest } from '@/dividends/dto/create-dividend.dto';
import { User, Dividend } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UpdateDividendRequest } from '@/dividends/dto/update-dividend.dto';

describe('DividendController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let otherUser: User;
  let accessToken: string;
  let otherAccessToken: string;
  const dividendShape: Omit<Dividend, 'userId'> = expect.objectContaining({
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    dividendAt: expect.any(String),
    name: expect.any(String),
    dividend: expect.any(Number),
    tax: expect.any(Number),
    unit: expect.any(String),
  });

  const createDividendRequest: CreateDividendRequest = {
    name: 'MSFT',
    dividendAt: '2023-11-10',
    unit: 'KRW',
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
        email: 'test@test.com',
        provider: 'KAKAO',
      },
    });

    otherUser = await prisma.user.create({
      data: {
        name: '김철수',
        email: 'test1@test.com',
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

  it('/api/dividends (POST)', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/api/dividends')
      .auth(accessToken, { type: 'bearer' })
      .send(createDividendRequest);

    expect(status).toBe(201);
    expect(body).toEqual({
      ok: true,
    });
  });

  it('/api/dividends (GET)', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/dividends')
      .auth(accessToken, { type: 'bearer' });

    expect(status).toBe(200);
    expect(body).toEqual({
      ok: true,
      data: expect.arrayContaining([dividendShape]),
    });
  });

  it('/api/dividends/:id (PATCH)', async () => {
    const [dividend] = await prisma.dividend.findMany();
    const dividendId = dividend.id;
    const updateDividendRequest: UpdateDividendRequest = {
      name: 'APPL',
      dividend: 100,
      tax: 2,
      dividendAt: '2023-11-01',
      unit: 'USD',
    };

    const { status, body } = await request(app.getHttpServer())
      .patch(`/api/dividends/${dividendId}`)
      .auth(accessToken, { type: 'bearer' })
      .send(updateDividendRequest);

    expect(status).toBe(200);
    expect(body).toEqual({
      ok: true,
    });

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

  describe('/api/dividends/:id (DELETE)', () => {
    it('Forbidden (403)', async () => {
      const [dividend] = await prisma.dividend.findMany();

      const { status, body } = await request(app.getHttpServer())
        .delete(`/api/dividends/${dividend.id}`)
        .auth(otherAccessToken, { type: 'bearer' });

      const count = await prisma.dividend.count();

      expect(status).toBe(403);
      expect(body).toEqual({
        ok: false,
        message: '해당 데이터를 삭제할 권한이 없습니다.',
      });

      expect(count).toBe(1);
    });

    it('Not Found (404)', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`/api/dividends/${999}`)
        .auth(accessToken, { type: 'bearer' });

      expect(status).toBe(404);
      expect(body).toEqual({
        ok: false,
        message: '해당 데이터가 존재하지 않습니다.',
      });
    });

    it('Success (200)', async () => {
      const [dividend] = await prisma.dividend.findMany();

      const { status, body } = await request(app.getHttpServer())
        .delete(`/api/dividends/${dividend.id}`)
        .auth(accessToken, { type: 'bearer' });

      const count = await prisma.dividend.count();

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
      });

      expect(count).toBe(0);
    });
  });
});
