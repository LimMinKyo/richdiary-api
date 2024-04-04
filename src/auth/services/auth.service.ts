import { UsersService } from '@/users/services/users.service';
import { comparePassword } from '@/utils/password';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Provider, User } from '@prisma/client';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from '../dtos/login.dto';
import { JwtPayload } from '../auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.password) {
      throw new UnauthorizedException(
        `${Provider.LOCAL} provider 유저가 아닙니다.`,
      );
    }

    const isEqualPassword = await comparePassword(password, user.password);

    if (!isEqualPassword) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: User): Promise<LoginResponse> {
    const accessToken = this.generateAccessToken(user);

    return {
      ok: true,
      data: {
        accessToken,
      },
    };
  }

  async oauthLogin(user: User, res: Response) {
    const accessToken = this.generateAccessToken(user);
    const frontUrl = this.configService.get('FRONT_URL');
    return res.redirect(`${frontUrl}/login/oauth?access-token=${accessToken}`);
  }

  private generateAccessToken(user: User) {
    const payload: JwtPayload = { id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
