import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LoginRequest, LoginResponse } from '../dtos/login.dto';
import { KakaoAuthGuard } from '../guards/kakao-auth.guard';
import { RequestWithUser } from '../auth.interfaces';

@Controller('api/auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: '일반 로그인' })
  @ApiOkResponse({
    schema: {
      example: {
        ok: true,
        data: {
          access_token: 'ACCESS_TOKEN',
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<LoginResponse> {
    return await this.authService.login(req.user);
  }

  @Public()
  @ApiOperation({ summary: '카카오 SSO 로그인' })
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginKakao(@Req() req: RequestWithUser, @Res() res: Response) {
    return this.authService.oauthLogin(req, res);
  }
}
