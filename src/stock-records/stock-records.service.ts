import { Injectable } from '@nestjs/common';
import { CreateStockRecordDto } from './dtos/create-stock-record.dto';
import { UpdateStockRecordDto } from './dtos/update-stock-record.dto';

@Injectable()
export class StockRecordsService {
  create(createStockRecordDto: CreateStockRecordDto) {
    return 'This action adds a new stockRecord';
  }

  findAll() {
    return `This action returns all stockRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockRecord`;
  }

  update(id: number, updateStockRecordDto: UpdateStockRecordDto) {
    return `This action updates a #${id} stockRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockRecord`;
  }
}
