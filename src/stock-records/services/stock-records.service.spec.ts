import { Test, TestingModule } from '@nestjs/testing';
import { StockRecordsService } from './stock-records.service';

describe('StockRecordsService', () => {
  let service: StockRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockRecordsService],
    }).compile();

    service = module.get<StockRecordsService>(StockRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
