import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountRequest } from './dto/create-account.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { hashPassword } from '@/utils/password';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({ email, password }: CreateAccountRequest) {
    const user = await this.findOne(email);

    if (user) {
      throw new BadRequestException('Email already exist.');
    }

    password = await hashPassword(password);

    const newUser = await this.prisma.user.create({
      data: { email, password },
    });

    const verification = await this.prisma.verification.create({
      data: { userId: newUser.id },
    });

    await this.mailService.sendVerificationEmail(
      newUser.email,
      verification.code,
    );
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
