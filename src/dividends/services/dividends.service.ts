import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDividendRequest } from '../dtos/create-dividend.dto';
import { UpdateDividendRequest } from '../dtos/update-dividend.dto';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import { GetDividendsMonthRequest } from '../dtos/get-dividends-month.dto';
import dayjs from 'dayjs';
import {
  GetDividendsYearRequest,
  GetDividendsYearResponseData,
} from '../dtos/get-dividends-year.dto';
import { ExchangesService } from '@/exchanges/services/exchanges.service';
import { DividendEntity } from '../entities/dividend.entity';
import { PaginationData } from '@/common/dtos/pagination.dto';
import { DataNotFoundException } from '@/common/exceptions/data-not-found.exception';
import { PermissionDeniedException } from '@/common/exceptions/permission-denied.exception';

@Injectable()
export class DividendsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangesService: ExchangesService,
  ) {}

  async createDividend(
    user: User,
    createDividendRequest: CreateDividendRequest,
  ): Promise<void> {
    await this.prisma.dividend.create({
      data: {
        ...createDividendRequest,
        dividendAt: dayjs(createDividendRequest.dividendAt).toISOString(),
        tax: createDividendRequest.tax ? createDividendRequest.tax : 0,
        userId: user.id,
      },
    });
  }

  async getDividendsMonth(
    user: User,
    { date, page = 1, perPage = 10 }: GetDividendsMonthRequest,
  ): Promise<PaginationData<DividendEntity>> {
    const [result, meta] = await this.prisma.paginator.dividend
      .paginate({
        where: {
          userId: user.id,
          dividendAt: {
            gte: dayjs(date).startOf('month').toISOString(),
            lte: dayjs(date).endOf('month').toISOString(),
          },
        },
        orderBy: {
          dividendAt: 'asc',
        },
      })
      .withPages({
        page,
        limit: perPage,
      });

    const data = result.map((dividend) => new DividendEntity(dividend));

    return {
      data,
      meta,
    };
  }

  async updateDividend(
    user: User,
    dividendId: string,
    updateDividendRequest: UpdateDividendRequest,
  ): Promise<void> {
    await this.checkIsOwnDividend(user, dividendId);

    await this.prisma.dividend.update({
      data: {
        ...updateDividendRequest,
        ...(updateDividendRequest.dividendAt && {
          dividendAt: new Date(updateDividendRequest.dividendAt).toISOString(),
        }),
      },
      where: { id: dividendId },
    });
  }

  async deleteDividend(user: User, dividendId: string): Promise<void> {
    await this.checkIsOwnDividend(user, dividendId);

    await this.prisma.dividend.delete({
      where: {
        id: dividendId,
      },
    });
  }

  async getDividendsYear(
    user: User,
    { date }: GetDividendsYearRequest,
  ): Promise<GetDividendsYearResponseData> {
    const exchangeData = await this.exchangesService.getExchangeRate(
      dayjs(date).format('YYYY-MM'),
    );

    if (!exchangeData) {
      throw new InternalServerErrorException(
        '환율 데이터 조회에 실패했습니다.',
      );
    }

    const result = await this.prisma.dividend.findMany({
      where: {
        userId: user.id,
        dividendAt: {
          gte: dayjs(date).startOf('year').toISOString(),
          lte: dayjs(date).endOf('year').toISOString(),
        },
      },
      orderBy: {
        dividendAt: 'asc',
      },
    });

    const data = Array.from<null, DividendEntity[]>({ length: 12 }, () => []);

    result.forEach((dividend) => {
      const monthIndex = dayjs(dividend.dividendAt).month();

      data[monthIndex].push(new DividendEntity(dividend));
    });

    return {
      exchangeRate: exchangeData.rate,
      data,
    };
  }

  private async checkIsOwnDividend(user: User, dividendId: string) {
    const dividend = await this.prisma.dividend.findFirst({
      where: { id: dividendId },
    });

    if (!dividend) {
      throw new DataNotFoundException();
    }

    if (user.id !== dividend.userId) {
      throw new PermissionDeniedException();
    }
  }
}
