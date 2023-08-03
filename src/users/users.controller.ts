import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountRequest } from './dto/create-account.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createAccount(@Body() createAccountRequest: CreateAccountRequest) {
    return this.usersService.createAccount(createAccountRequest);
  }
}
