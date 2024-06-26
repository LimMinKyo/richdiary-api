import { Injectable } from '@nestjs/common';
import { CreateAccountRequest } from '../dto/create-account.dto';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { hashPassword } from '@/utils/password';
import { MailService } from '@/common/modules/mail/mail.service';
import { VerifyEmailRequest } from '../dto/verify-email.dto';
import { Provider, User } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { EmailAlreadyExistException } from '../exceptions/email-already-exist.exception';
import { VerifyCodeInvalidException } from '../exceptions/verify-code-invalid.exception';

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
  }: CreateAccountRequest): Promise<void> {
    const user = await this.findOneByEmail(email);

    if (user) {
      throw new EmailAlreadyExistException();
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
  }

  getMyProfile(user: User): UserEntity {
    return new UserEntity(user);
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

  async findOneById(id: string): Promise<User | null> {
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
  }): Promise<User> {
    const user = await this.findOneByEmail(email);

    if (user) {
      return user;
    }

    const newUser = await this.prisma.user.create({
      data: { name, email, provider, verified: true },
    });

    return newUser;
  }

  async verifyEmail({ code }: VerifyEmailRequest): Promise<void> {
    const verification = await this.prisma.verification.findFirst({
      where: { code },
      include: { user: true },
    });

    if (!verification) {
      throw new VerifyCodeInvalidException();
    }

    await this.prisma.user.update({
      data: { verified: true },
      where: { id: verification.userId },
    });

    await this.prisma.verification.delete({ where: { id: verification.id } });
  }
}
