import { Controller, Post, Body, Get, Req, Patch } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  CreateAccountRequest,
  CreateAccountResponse,
} from '../dto/create-account.dto';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth/decorators/public.decorator';
import {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../dto/verify-email.dto';
import { User } from '@prisma/client';
import { GetMyProfileResponse } from '../dto/get-my-profile.dto';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Public()
  @Post()
  createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return this.usersService.createAccount(createAccountRequest);
  }

  @ApiOperation({ summary: '내정보 조회' })
  @ApiAuthRequired()
  @Get('profile')
  getMyProfile(@Req() req: Request & { user: User }): GetMyProfileResponse {
    return this.usersService.getMyProfile(req.user);
  }

  @Public()
  @Patch('verify')
  verifyEmail(
    @Body() verifyEmailRequest: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> {
    return this.usersService.verifyEmail(verifyEmailRequest);
  }
}
