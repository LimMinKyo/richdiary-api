import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DividendsModule } from './dividends/dividends.module';
import Joi from 'joi';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { StockRecordsModule } from './stock-records/stock-records.module';
import { FinancialLedgersModule } from './financial-ledgers/financial-ledgers.module';

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
        DOMAIN: Joi.string().required(),
        FRONT_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_CLIENT_SECRET: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        EXCHANGE_APP_ID: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    DividendsModule,
    CommonModule,
    PortfoliosModule,
    StockRecordsModule,
    FinancialLedgersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector) => {
        return new ClassSerializerInterceptor(reflector);
      },
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
