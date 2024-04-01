import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDividendRequest,
  CreateDividendResponse,
} from '../dto/create-dividend.dto';
import {
  UpdateDividendRequest,
  UpdateDividendResponse,
} from '../dto/update-dividend.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Dividend, User } from '@prisma/client';
import {
  GetDividendsMonthRequest,
  GetDividendsMonthResponse,
} from '../dto/get-dividends-month.dto';
import dayjs from 'dayjs';
import { DeleteDividendResponse } from '../dto/delete-dividend.dto';
import {
  GetDividendsYearRequest,
  GetDividendsYearResponse,
} from '../dto/get-dividends-year.dto';
import { ExchangesService } from '@/exchanges/services/exchanges.service';
import { DividendEntity } from '../entities/dividend.entity';

@Injectable()
export class DividendsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangesService: ExchangesService,
  ) {}

  async createDividend(
    user: User,
    createDividendRequest: CreateDividendRequest,
  ): Promise<CreateDividendResponse> {
    await this.prisma.dividend.create({
      data: {
        ...createDividendRequest,
        dividendAt: dayjs(createDividendRequest.dividendAt).toISOString(),
        tax: createDividendRequest.tax ? createDividendRequest.tax : 0,
        userId: user.id,
      },
    });

    return {
      ok: true,
    };
  }

  async getDividends(
    user: User,
    { date, page = 1, perPage = 10 }: GetDividendsMonthRequest,
  ): Promise<GetDividendsMonthResponse> {
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
      ok: true,
      data,
      meta: {
        ...meta,
        perPage,
      },
    };
  }

  async updateDividend(
    user: User,
    dividendId: number,
    updateDividendRequest: UpdateDividendRequest,
  ): Promise<UpdateDividendResponse> {
    const dividend = await this.prisma.dividend.findFirst({
      where: { id: dividendId },
    });

    if (!dividend) {
      throw new NotFoundException({
        ok: false,
        message: '해당 데이터가 존재하지 않습니다.',
      });
    }

    if (!this.checkIsOwnDividend(user, dividend)) {
      throw new ForbiddenException({
        ok: false,
        message: '해당 데이터를 변경할 권한이 없습니다.',
      });
    }

    const dividendAt = updateDividendRequest.dividendAt
      ? new Date(updateDividendRequest.dividendAt).toISOString()
      : null;

    delete updateDividendRequest.dividendAt;

    await this.prisma.dividend.update({
      data: {
        ...updateDividendRequest,
        ...(dividendAt && { dividendAt }),
      },
      where: { id: dividendId },
    });
    return { ok: true };
  }

  async deleteDividend(
    user: User,
    dividendId: number,
  ): Promise<DeleteDividendResponse> {
    const dividend = await this.prisma.dividend.findFirst({
      where: { id: dividendId },
    });

    if (!dividend) {
      throw new NotFoundException({
        ok: false,
        message: '해당 데이터가 존재하지 않습니다.',
      });
    }

    if (!this.checkIsOwnDividend(user, dividend)) {
      throw new ForbiddenException({
        ok: false,
        message: '해당 데이터를 삭제할 권한이 없습니다.',
      });
    }

    await this.prisma.dividend.delete({
      where: {
        id: dividendId,
      },
    });

    return { ok: true };
  }

  async getDividendsYear(
    user: User,
    { date }: GetDividendsYearRequest,
  ): Promise<GetDividendsYearResponse> {
    const krwExchangeRate = await this.exchangesService.getExchangeRate();

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
      ok: true,
      data: { exchangeRate: krwExchangeRate, data },
    };
  }

  private checkIsOwnDividend(user: User, dividend: Dividend) {
    if (user.id === dividend.userId) {
      return true;
    }

    return false;
  }
}
