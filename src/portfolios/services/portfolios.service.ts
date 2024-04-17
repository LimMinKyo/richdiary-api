import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetPortfolioListResponse } from '../dtos/get-portfolio-list.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Portfolio, User } from '@prisma/client';
import { PortfolioEntity } from '../entities/portfolio.entity';
import {
  CreatePortfolioRequest,
  CreatePortfolioResponse,
} from '../dtos/create-portfolio.dto';
import { DeletePortfolioResponse } from '../dtos/delete-portfolio.dto';
import {
  UpdatePortfolioRequest,
  UpdatePortfolioResponse,
} from '../dtos/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private readonly prisma: PrismaService) {}

  async getPortfolioList(user: User): Promise<GetPortfolioListResponse> {
    const data = await this.prisma.portfolio
      .findMany({
        where: {
          userId: user.id,
        },
      })
      .then((portfolios) =>
        portfolios.map((portfolio) => new PortfolioEntity(portfolio)),
      );

    return { ok: true, data };
  }

  async createPortfolio(
    user: User,
    { name }: CreatePortfolioRequest,
  ): Promise<CreatePortfolioResponse> {
    const data = await this.prisma.portfolio.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return { ok: true, data: new PortfolioEntity(data) };
  }

  async updatePortfolio(
    user: User,
    portfolioId: number,
    { name }: UpdatePortfolioRequest,
  ): Promise<UpdatePortfolioResponse> {
    await this.checkIsOwnPortfolio(user, portfolioId);

    const data = await this.prisma.portfolio.update({
      where: { id: portfolioId },
      data: { name },
    });

    return { ok: true, data: new PortfolioEntity(data) };
  }

  async deletePortfolio(
    user: User,
    portfolioId: number,
  ): Promise<DeletePortfolioResponse> {
    await this.checkIsOwnPortfolio(user, portfolioId);

    await this.prisma.portfolio.delete({ where: { id: portfolioId } });

    return { ok: true };
  }

  private async checkIsOwnPortfolio(user: User, portfolioId: number) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException('해당하는 포트폴리오가 없습니다.');
    }

    if (portfolio.userId !== user.id) {
      throw new ForbiddenException('해당 포트폴리오를 삭제할 권한이 없습니다.');
    }
  }
}