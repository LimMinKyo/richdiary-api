import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStockRecordRequest,
  CreateStockRecordResponse,
} from '../dtos/create-stock-record.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import dayjs from 'dayjs';
import {
  UpdateStockRecordRequest,
  UpdateStockRecordResponse,
  updateStockRecordErrorMessage,
} from '../dtos/update-stock-record.dto';
import { DeleteStockRecordResponse } from '../dtos/delete-stock-record.dto';

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

  async updateStockRecord(
    user: User,
    stockRecordId: string,
    updateStockRecordRequest: UpdateStockRecordRequest,
  ): Promise<UpdateStockRecordResponse> {
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
    return { ok: true };
  }

  async deleteStockRecord(
    user: User,
    stockRecordId: string,
  ): Promise<DeleteStockRecordResponse> {
    await this.checkIsOwnStockRecord(user, stockRecordId);

    await this.prisma.stockRecord.delete({
      where: {
        id: stockRecordId,
      },
    });

    return { ok: true };
  }

  private async checkIsOwnStockRecord(user: User, stockRecordId: string) {
    const stockRecord = await this.prisma.stockRecord.findFirst({
      where: { id: stockRecordId },
    });

    if (!stockRecord) {
      throw new NotFoundException(updateStockRecordErrorMessage.NOT_FOUND);
    }

    if (user.id !== stockRecord.userId) {
      throw new ForbiddenException(updateStockRecordErrorMessage.FORBIDDEN);
    }
  }
}
