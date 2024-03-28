import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { LoggerContextMiddleware } from './middleware/logger-context.middleware';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { GlobalValidationPipe } from './pipes/global-validation-pipe.pipe';

@Global()
@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_PIPE, useClass: GlobalValidationPipe },
    Logger,
  ],
})
export class CommonModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
