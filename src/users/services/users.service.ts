import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateAccountRequest,
  CreateAccountResponse,
} from '../dto/create-account.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { hashPassword } from '@/utils/password';
import { MailService } from '@/mail/mail.service';
import {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../dto/verify-email.dto';
import { Provider, User } from '@prisma/client';
import { GetMyProfileResponse } from '../dto/get-my-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    name,
    email,
    password,
  }: CreateAccountRequest): Promise<CreateAccountResponse> {
    const user = await this.findOneByEmail(email);

    if (user) {
      throw new BadRequestException({
        ok: false,
        message: '해당 이메일은 이미 존재합니다.',
      });
    }

    password = await hashPassword(password);

    const newUser = await this.prisma.user.create({
      data: { name, email, password, provider: Provider.LOCAL },
    });

    const verification = await this.prisma.verification.create({
      data: { userId: newUser.id },
    });

    await this.mailService.sendVerificationEmail(
      newUser.email,
      verification.code,
    );

    return {
      ok: true,
    };
  }

  getMyProfile({ password, id, ...rest }: User): GetMyProfileResponse {
    return {
      ok: true,
      data: rest,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneByEmailOrSave({
    email,
    name,
    provider,
  }: {
    email: string;
    name: string;
    provider: Provider;
  }): Promise<User | null> {
    const user = await this.findOneByEmail(email);

    if (user) {
      return user;
    }

    const newUser = await this.prisma.user.create({
      data: { name, email, provider, verified: true },
    });

    return newUser;
  }

  async verifyEmail({
    code,
  }: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const verification = await this.prisma.verification.findFirst({
      where: { code },
      include: { user: true },
    });

    if (!verification) {
      throw new BadRequestException({
        ok: false,
        message: '인증코드가 유효하지 않습니다.',
      });
    }

    await this.prisma.user.update({
      data: { verified: true },
      where: { id: verification.userId },
    });

    await this.prisma.verification.delete({ where: { id: verification.id } });

    return {
      ok: true,
    };
  }
}
