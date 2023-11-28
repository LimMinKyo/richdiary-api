import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/utils/password';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload, RequestWithUser } from '../auth.interfaces';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    let isEqualPassword = false;
    if (user.password) {
      isEqualPassword = await comparePassword(password, user.password);
    }

    if (user && isEqualPassword) {
      return { id: user.id, email: user.email };
    }
  }

  async login(user: User) {
    const payload: JwtPayload = { id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async oauthLogin(req: RequestWithUser, res: Response) {
    if (req.user) {
      const payload: JwtPayload = { id: req.user.id };
      const accessToken = this.jwtService.sign(payload);
      const frontUrl = this.configService.get('FRONT_URL');
      return res.redirect(
        `${frontUrl}/login/kakao?access-token=${accessToken}`,
      );
    }
  }
}
