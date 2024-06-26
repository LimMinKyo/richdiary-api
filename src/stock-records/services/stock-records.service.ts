import { Injectable } from '@nestjs/common';
import { CreateStockRecordRequest } from '../dtos/create-stock-record.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import dayjs from 'dayjs';
import { UpdateStockRecordRequest } from '../dtos/update-stock-record.dto';
import { GetStockRecordsRequest } from '../dtos/get-stock-records.dto';
import { StockRecordEntity } from '../entities/stock-record.entity';
import { PaginationData } from '@/common/dtos/pagination.dto';
import { DataNotFoundException } from '@/common/exceptions/data-not-found.exception';
import { PermissionDeniedException } from '@/common/exceptions/permission-denied.exception';

@Injectable()
export class StockRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStockRecord(
    user: User,
    createStockRecordRequest: CreateStockRecordRequest,
  ): Promise<void> {
    await this.prisma.stockRecord.create({
      data: {
        ...createStockRecordRequest,
        recordAt: dayjs(createStockRecordRequest.recordAt).toISOString(),
        userId: user.id,
      },
    });
  }

  async updateStockRecord(
    user: User,
    stockRecordId: string,
    updateStockRecordRequest: UpdateStockRecordRequest,
  ): Promise<void> {
    await this.checkIsOwnStockRecord(user, stockRecordId);

    await this.prisma.stockRecord.update({
      data: {
        ...updateStockRecordRequest,
        ...(updateStockRecordRequest.recordAt && {
          recordAt: new Date(updateStockRecordRequest.recordAt).toISOString(),
        }),
      },
      where: { id: stockRecordId },
    });
  }

  async deleteStockRecord(user: User, stockRecordId: string): Promise<void> {
    await this.checkIsOwnStockRecord(user, stockRecordId);

    await this.prisma.stockRecord.delete({
      where: {
        id: stockRecordId,
      },
    });
  }

  async getStockRecordList(
    user: User,
    { date, page = 1, perPage = 10 }: GetStockRecordsRequest,
  ): Promise<PaginationData<StockRecordEntity>> {
    const [result, meta] = await this.prisma.paginator.stockRecord
      .paginate({
        where: {
          userId: user.id,
          recordAt: {
            gte: dayjs(date).startOf('month').toISOString(),
            lte: dayjs(date).endOf('month').toISOString(),
          },
        },
        orderBy: {
          recordAt: 'asc',
        },
      })
      .withPages({
        page,
        limit: perPage,
      });

    const data = result.map(
      (stockRecord) => new StockRecordEntity(stockRecord),
    );

    return {
      data,
      meta,
    };
  }

  private async checkIsOwnStockRecord(user: User, stockRecordId: string) {
    const stockRecord = await this.prisma.stockRecord.findFirst({
      where: { id: stockRecordId },
    });

    if (!stockRecord) {
      throw new DataNotFoundException();
    }

    if (user.id !== stockRecord.userId) {
      throw new PermissionDeniedException();
    }
  }
}
