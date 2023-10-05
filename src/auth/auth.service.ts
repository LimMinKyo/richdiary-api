import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/utils/password';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isEqualPassword = await comparePassword(password, user.password);

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
}
