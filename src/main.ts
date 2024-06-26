import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { winstonLogger } from './config/logger.config';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });

  // Cookie Parser
  app.use(cookieParser());

  // Swagger Setup
  setupSwagger(app);

  // CORS Setting
  app.enableCors({
    origin: [process.env.FRONT_URL || ''],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
