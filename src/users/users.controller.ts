import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createAccount(@Body() createAccountRequest: CreateAccountRequest) {
    return this.usersService.createAccount(createAccountRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
