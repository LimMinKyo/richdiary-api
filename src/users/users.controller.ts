import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth/public.decorator';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Public()
  @Post()
  createAccount(@Body() createAccountRequest: CreateAccountRequest) {
    return this.usersService.createAccount(createAccountRequest);
  }

  @ApiOperation({ summary: '내정보 조회' })
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
