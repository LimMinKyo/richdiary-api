import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesService } from './exchanges.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/modules/prisma/prisma.service';

describe('ExchangesService', () => {
  let service: ExchangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangesService, ConfigService, PrismaService],
    }).compile();

    service = module.get<ExchangesService>(ExchangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
