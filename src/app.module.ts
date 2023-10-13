import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AccountsModule } from './accounts/accounts.module';
import { APP_FILTER } from '@nestjs/core';
import CatchExceptionFilter from './common/filters/catch-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    AccountsModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: CatchExceptionFilter }],
})
export class AppModule {}
