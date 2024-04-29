import 'jest-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('/api/portfolios', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let accessToken: string;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  describe('GET /api/portfolios', () => {
    it.todo('내 포트폴리오 리스트를 성공적으로 조회를 한다.');
  });

  describe('POST /api/portfolios', () => {
    it.todo('포트폴리오를 성공적으로 생성한다.');
  });

  describe('PATCH /api/portfolios/:id', () => {
    it.todo('포트폴리오를 성공적으로 수정한다.');
  });

  describe('DELETE /api/portfolios/:id', () => {
    it.todo('포트폴리오를 성공적으로 삭제한다.');
  });
});
