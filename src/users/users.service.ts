import { Injectable } from '@nestjs/common';
import { CreateAccountRequest } from './dto/create-account.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount({ email, password }: CreateAccountRequest) {
    await this.prisma.user.create({ data: { email, password } });
    return true;
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
