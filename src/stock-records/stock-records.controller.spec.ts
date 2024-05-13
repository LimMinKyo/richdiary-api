import { Test, TestingModule } from '@nestjs/testing';
import { StockRecordsController } from './stock-records.controller';
import { StockRecordsService } from './stock-records.service';

describe('StockRecordsController', () => {
  let controller: StockRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockRecordsController],
      providers: [StockRecordsService],
    }).compile();

    controller = module.get<StockRecordsController>(StockRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
