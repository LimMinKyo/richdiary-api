import { Injectable } from '@nestjs/common';
import {
  CreateStockRecordRequest,
  CreateStockRecordResponse,
} from '../dtos/create-stock-record.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class StockRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStockRecord(
    user: User,
    createStockRecordRequest: CreateStockRecordRequest,
  ): Promise<CreateStockRecordResponse> {
    await this.prisma.stockRecord.create({
      data: {
        ...createStockRecordRequest,
        recordAt: dayjs(createStockRecordRequest.recordAt).toISOString(),
        userId: user.id,
      },
    });

    return {
      ok: true,
    };
  }
}
