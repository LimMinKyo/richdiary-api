import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountRequest } from './dtos/create-account.dto';
import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@prisma/client';
import { UpdateAccountRequest } from './dtos/update-account.dto';

@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  createAccount(
    @AuthUser() user: User,
    @Body() createAccountRequest: CreateAccountRequest,
  ) {
    return this.accountsService.createAccount(user, createAccountRequest);
  }

  @Get()
  getAccounts(@AuthUser() user: User) {
    return this.accountsService.getAccounts(user);
  }

  @Put()
  updateAccount(@Body() updateAccountRequest: UpdateAccountRequest) {
    return this.accountsService.updateAccounts(updateAccountRequest);
  }
}
