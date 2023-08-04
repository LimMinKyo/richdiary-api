import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return null;
    }

    const isEqualPassword = await bcrypt.compare(password, user.password);

    if (user && isEqualPassword) {
      return { id: user.id, email: user.email };
    }
  }
}
