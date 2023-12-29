import { Controller, Post, Body, Get, Req, Patch } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  CreateAccountRequest,
  CreateAccountResponse,
} from '../dto/create-account.dto';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Public } from '@/auth/decorators/public.decorator';
import {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../dto/verify-email.dto';
import { User } from '@prisma/client';
import { GetMyProfileResponse } from '../dto/get-my-profile.dto';
import { ApiAuthRequired } from '@/common/decorators/api-auth-required.decorator';
import { UserEntity } from '../entities/user.entity';

@Controller('api/users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Public()
  @Post()
  @ApiCreatedResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(CreateAccountResponse) }],
      example: {
        ok: true,
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(CreateAccountResponse) }],
      example: {
        ok: false,
        message: '해당 이메일은 이미 존재합니다.',
      },
    },
  })
  createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return this.usersService.createAccount(createAccountRequest);
  }

  @ApiOperation({ summary: '내정보 조회' })
  @ApiAuthRequired()
  @ApiExtraModels(GetMyProfileResponse, UserEntity)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(GetMyProfileResponse) },
        {
          properties: {
            ok: {
              type: 'boolean',
              example: true,
            },
            data: {
              $ref: getSchemaPath(UserEntity),
            },
          },
        },
      ],
    },
  })
  @Get('profile')
  getMyProfile(@Req() req: Request & { user: User }): GetMyProfileResponse {
    return this.usersService.getMyProfile(req.user);
  }

  @ApiOperation({ summary: '이메일 인증' })
  @Public()
  @Patch('verify')
  @ApiOkResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(VerifyEmailResponse) }],
      example: {
        ok: true,
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(VerifyEmailResponse) }],
      example: {
        ok: false,
        message: '인증코드가 유효하지 않습니다.',
      },
    },
  })
  verifyEmail(
    @Body() verifyEmailRequest: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> {
    return this.usersService.verifyEmail(verifyEmailRequest);
  }
}
