import { UsersService } from '@/users/services/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { REFRESH_TOKEN_KEY, jwtConstants } from '../auth.constants';
import { JwtPayload } from '../auth.interfaces';
import { User } from '@prisma/client';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.[REFRESH_TOKEN_KEY];
        },
      ]),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
