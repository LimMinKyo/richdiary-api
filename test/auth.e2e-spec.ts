import 'jest-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('/api/auth', () => {
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

  describe('POST /api/auth/login', () => {
    it.todo('email과 password를 입력하여 정상적으로 로그인한다.');
  });

  describe('GET /api/auth/login/kakao', () => {
    it.todo('카카오 SSO 소셜 로그인에 성공한다.');
  });

  describe('POST /api/auth/refresh', () => {
    it.todo('리프레쉬 토큰으로 액세스 토큰을 성공적으로 재발급 받는다.');
  });

  describe('POST /api/auth/logout', () => {
    it.todo('성공적으로 로그아웃한다.');
  });
});
