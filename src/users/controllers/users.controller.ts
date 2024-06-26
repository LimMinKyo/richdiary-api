import { Controller, Post, Body, Get, Req, Patch } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  CreateAccountRequest,
  EmailAlreadyExistResponseDto,
} from '../dto/create-account.dto';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@/auth/decorators/public.decorator';
import {
  VerifyCodeInvalidResponseDto,
  VerifyEmailRequest,
} from '../dto/verify-email.dto';
import { User } from '@prisma/client';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';
import { ResponseDto } from '@/common/dtos/response.dto';
import { UserEntity } from '../entities/user.entity';
import { ApiOkResponseWithData } from '@/common/decorators/api-ok-response-with-data.decorator';
import { OkResponseDto } from '@/common/dtos/ok/ok.dto';
import { OkWithDataResponseDto } from '@/common/dtos/ok/ok-with-data.dto';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Public()
  @Post()
  @ApiCreatedResponse({ type: OkResponseDto })
  @ApiBadRequestResponse({ type: EmailAlreadyExistResponseDto })
  async createAccount(
    @Body() body: CreateAccountRequest,
  ): Promise<OkResponseDto> {
    await this.usersService.createAccount(body);
    return ResponseDto.OK();
  }

  @ApiOperation({ summary: '내정보 조회' })
  @ApiAuthRequired()
  @ApiOkResponseWithData(UserEntity)
  @Get('profile')
  getMyProfile(
    @Req() req: Request & { user: User },
  ): OkWithDataResponseDto<UserEntity> {
    const data = this.usersService.getMyProfile(req.user);
    return ResponseDto.OK_WITH(data);
  }

  @ApiOperation({ summary: '이메일 인증' })
  @Public()
  @Patch('verify')
  @ApiOkResponse({ type: OkResponseDto })
  @ApiBadRequestResponse({ type: VerifyCodeInvalidResponseDto })
  async verifyEmail(
    @Body() verifyEmailRequest: VerifyEmailRequest,
  ): Promise<OkResponseDto> {
    await this.usersService.verifyEmail(verifyEmailRequest);
    return ResponseDto.OK();
  }
}
