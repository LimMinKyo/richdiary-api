import { Test, TestingModule } from '@nestjs/testing';
import { DividendsController } from './dividends.controller';
import { DividendsService } from '../services/dividends.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { ExchangesService } from '@/exchanges/services/exchanges.service';

describe('DividendsController', () => {
  let controller: DividendsController;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DividendsController],
      providers: [DividendsService, PrismaService, ExchangesService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get(DividendsController);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
