import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { DividendsModule } from './dividends/dividends.module';
import Joi from 'joi';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : process.env.NODE_ENV === 'production'
            ? '.env'
            : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        FRONT_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_CLIENT_SECRET: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    DividendsModule,
    CommonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
