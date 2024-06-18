import { UsersService } from '@/users/services/users.service';
import { comparePassword } from '@/utils/password';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Provider, User } from '@prisma/client';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginResponseData } from '../dtos/login.dto';
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

  async login(user: User): Promise<{
    refreshToken: string;
    cookieOptions: CookieOptions;
    data: LoginResponseData;
  }> {
    const accessToken = this.generateAccessToken(user);
    const { refreshToken, cookieOptions } = this.generateRefreshToken(user);

    return {
      refreshToken,
      cookieOptions,
      data: {
        accessToken,
      },
    };
  }

  async oauthLogin(user: User): Promise<{
    redirectUrl: string;
    refreshToken: string;
    cookieOptions: CookieOptions;
  }> {
    const accessToken = this.generateAccessToken(user);
    const { refreshToken, cookieOptions } = this.generateRefreshToken(user);
    const frontUrl = this.configService.get('FRONT_URL');
    const redirectUrl = `${frontUrl}/login/oauth?access-token=${accessToken}`;
    return { redirectUrl, refreshToken, cookieOptions };
  }

  async logout(): Promise<{
    cookieOptions: CookieOptions;
  }> {
    return {
      cookieOptions: this.getRefreshTokenCookieOptions({ maxAge: 0 }),
    };
  }

  private generateAccessToken(user: User) {
    const payload: JwtPayload = { id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  private generateRefreshToken(user: User): {
    refreshToken: string;
    cookieOptions: CookieOptions;
  } {
    const payload: JwtPayload = { id: user.id };
    const DAYS = 7;
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${DAYS}d`,
    });

    // 쿠키 만료 기간 설정 (7일)
    const maxAge = DAYS * 24 * 60 * 60 * 1000; // 604800초

    return {
      refreshToken,
      cookieOptions: { ...this.getRefreshTokenCookieOptions({ maxAge }) },
    };
  }

  private getRefreshTokenCookieOptions(
    cookieOptions?: CookieOptions,
  ): CookieOptions {
    return {
      domain: '.' + this.configService.get('DOMAIN'),
      httpOnly: true,
      sameSite: 'strict',
      ...cookieOptions,
    };
  }
}
