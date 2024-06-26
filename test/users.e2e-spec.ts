import 'jest-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountRequest } from '@/users/dto/create-account.dto';
import { MailService } from '@/common/modules/mail/mail.service';

describe('/api/users', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let accessToken: string;
  let jwtService: JwtService;

  const mockMailService = () => ({
    sendVerificationEmail: jest.fn(),
  });

  const createAccountRequest: CreateAccountRequest = {
    name: '홍길동',
    email: 'users@test.com',
    password: '12345',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService())
      .compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/users', () => {
    it('회원가입을 성공적으로 한다.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/api/users')
        .send(createAccountRequest);

      expect(status).toBe(201);
      expect(body).toEqual({
        ok: true,
      });

      const [newUser] = await prisma.user.findMany();

      user = newUser;
      accessToken = jwtService.sign({ id: newUser.id });

      const count = await prisma.user.count();

      expect(count).toBe(1);
    });
  });

  describe('GET /api/users/profile', () => {
    it('내 정보를 성공적으로 조회를 한다.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/api/users/profile')
        .auth(accessToken, { type: 'bearer' });

      const { id, password, createdAt, updatedAt, ...rest } = user;

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
        data: rest,
      });
    });
  });

  describe('PATCH /api/users/verify', () => {
    it('잘못된 인증코드로 이메일 인증을 할 경우 실패한다.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/api/users/verify`)
        .auth(accessToken, { type: 'bearer' })
        .send({ code: '123' });

      expect(status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: '인증코드가 유효하지 않습니다.',
      });
    });

    it('이메일 인증이 성공적으로 완료된다.', async () => {
      const verification = await prisma.verification.findFirst({
        where: { userId: user.id },
      });

      const { status, body } = await request(app.getHttpServer())
        .patch(`/api/users/verify`)
        .auth(accessToken, { type: 'bearer' })
        .send({ code: verification?.code });

      expect(status).toBe(200);
      expect(body).toEqual({
        ok: true,
      });

      const count = await prisma.verification.count();

      expect(count).toBe(0);
    });
  });
});
