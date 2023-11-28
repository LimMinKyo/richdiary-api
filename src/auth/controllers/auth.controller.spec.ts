import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../auth.constants';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { KakaoStrategy } from '../strategies/kakao.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { MailService } from '@/mail/mail.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '24h' },
        }),
        PrismaModule,
        MailModule,
        ConfigModule,
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        KakaoStrategy,
        MailService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
      ],
      controllers: [AuthController],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
