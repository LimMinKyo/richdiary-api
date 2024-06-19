import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { CreatePortfolioRequest } from '../dtos/create-portfolio.dto';
import { deletePortfolioErrorMessage } from '../dtos/delete-portfolio.dto';
import { UpdatePortfolioRequest } from '../dtos/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private readonly prisma: PrismaService) {}

  async getPortfolios(user: User): Promise<PortfolioEntity[]> {
    const data = await this.prisma.portfolio
      .findMany({
        where: {
          userId: user.id,
        },
      })
      .then((portfolios) =>
        portfolios.map((portfolio) => new PortfolioEntity(portfolio)),
      );

    return data;
  }

  async createPortfolio(
    user: User,
    { name }: CreatePortfolioRequest,
  ): Promise<void> {
    await this.prisma.portfolio.create({
      data: {
        name,
        userId: user.id,
      },
    });
  }

  async updatePortfolio(
    user: User,
    portfolioId: string,
    { name }: UpdatePortfolioRequest,
  ): Promise<void> {
    await this.checkIsOwnPortfolio(user, portfolioId);

    await this.prisma.portfolio.update({
      where: { id: portfolioId },
      data: { name },
    });
  }

  async deletePortfolio(user: User, portfolioId: string): Promise<void> {
    await this.checkIsOwnPortfolio(user, portfolioId);

    await this.prisma.portfolio.delete({ where: { id: portfolioId } });
  }

  private async checkIsOwnPortfolio(user: User, portfolioId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(deletePortfolioErrorMessage.NOT_FOUND);
    }

    if (portfolio.userId !== user.id) {
      throw new ForbiddenException(deletePortfolioErrorMessage.FORBIDDEN);
    }
  }
}
