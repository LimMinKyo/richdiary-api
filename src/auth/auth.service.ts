import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (user && user.password === password) {
      return user;
    }

    return null;
  }
}
