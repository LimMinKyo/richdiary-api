import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDividendRequest,
  CreateDividendResponse,
} from '../dtos/create-dividend.dto';
import {
  UpdateDividendRequest,
  UpdateDividendResponse,
} from '../dtos/update-dividend.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import {
  GetDividendsMonthRequest,
  GetDividendsMonthResponse,
} from '../dtos/get-dividends-month.dto';
import dayjs from 'dayjs';
import {
  DeleteDividendResponse,
  deleteDividendErrorMessage,
} from '../dtos/delete-dividend.dto';
import {
  GetDividendsYearRequest,
  GetDividendsYearResponse,
} from '../dtos/get-dividends-year.dto';
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
    return { ok: true };
  }

  async deleteDividend(
    user: User,
    dividendId: number,
  ): Promise<DeleteDividendResponse> {
    await this.checkIsOwnDividend(user, dividendId);

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
    const { data: exchangeData } = await this.exchangesService.getExchangeRate(
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
      ok: true,
      data: { exchangeRate: exchangeData.rate, data },
    };
  }

  private async checkIsOwnDividend(user: User, dividendId: number) {
    const dividend = await this.prisma.dividend.findFirst({
      where: { id: dividendId },
    });

    if (!dividend) {
      throw new NotFoundException(deleteDividendErrorMessage.NOT_FOUND);
    }

    if (user.id !== dividend.userId) {
      throw new ForbiddenException(deleteDividendErrorMessage.FORBIDDEN);
    }
  }
}
