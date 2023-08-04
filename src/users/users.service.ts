import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountRequest } from './dto/create-account.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount({ email, password }: CreateAccountRequest) {
    const user = await this.findOne(email);

    if (user) {
      throw new BadRequestException('Email already exist.');
    }

    password = await bcrypt.hash(password, 10);

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
