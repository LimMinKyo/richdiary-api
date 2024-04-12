import { Module } from '@nestjs/common';
import { PortfoliosService } from './services/portfolios.service';
import { PortfoliosController } from './controllers/portfolios.controller';

@Module({
  providers: [PortfoliosService],
  controllers: [PortfoliosController],
})
export class PortfoliosModule {}
