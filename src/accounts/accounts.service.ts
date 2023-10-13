import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAccountRequest } from './dtos/create-account.dto';
import { User } from '@prisma/client';
import { UpdateAccountRequest } from './dtos/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(user: User, { name }: CreateAccountRequest) {
    await this.prisma.account.create({
      data: {
        name,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async getAccounts(user: User) {
    const data = await this.prisma.account.findMany({
      where: { userId: user.id },
    });
    return {
      data,
    };
  }

  async updateAccounts(updateAccountRequest: UpdateAccountRequest) {
    await this.prisma.account.update({
      where: { id: updateAccountRequest.accountId },
      data: { name: updateAccountRequest.name },
    });
  }
}
