import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequest, LoginResponseData } from '../dtos/login.dto';
import { KakaoAuthGuard } from '../guards/kakao-auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { REFRESH_TOKEN_KEY } from '../auth.constants';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { ResponseDto } from '@/common/dtos/response.dto';
import { ApiCreatedResponseWithData } from '@/common/decorators/api-created-response-with-data.decorator';

@Controller('api/auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: '일반 로그인' })
  @ApiCreatedResponseWithData(LoginResponseData)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  @Post('login')
  async login(@AuthUser() user: User, @Res() res: Response): Promise<void> {
    const { refreshToken, cookieOptions, data } =
      await this.authService.login(user);

    res
      .cookie(REFRESH_TOKEN_KEY, refreshToken, cookieOptions)
      .send(ResponseDto.OK_WITH(data));
  }

  @Public()
  @ApiOperation({ summary: '카카오 SSO 로그인' })
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginKakao(
    @AuthUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const { redirectUrl, cookieOptions, refreshToken } =
      await this.authService.oauthLogin(user);

    res
      .cookie(REFRESH_TOKEN_KEY, refreshToken, cookieOptions)
      .redirect(redirectUrl);
  }

  @Public()
  @ApiOperation({ summary: '토큰 리프레쉬' })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: User, @Res() res: Response) {
    const { refreshToken, cookieOptions, data } =
      await this.authService.login(user);

    res
      .cookie(REFRESH_TOKEN_KEY, refreshToken, cookieOptions)
      .send(ResponseDto.OK_WITH(data));
  }

  @Public()
  @ApiOperation({ summary: '로그아웃(리프레쉬 토큰 쿠키 삭제)' })
  @Post('logout')
  async logout(@Res() res: Response) {
    const { cookieOptions } = await this.authService.logout();

    res.clearCookie(REFRESH_TOKEN_KEY, cookieOptions).send(ResponseDto.OK());
  }
}
