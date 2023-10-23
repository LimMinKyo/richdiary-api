import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from './dtos/login.dto';
import { KakaoAuthGuard } from './kakao-auth.guard';
import { RequestWithUser } from './auth.interfaces';

@Controller('api/auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    return await this.authService.login(req.user);
  }

  @Public()
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginKakao(@Req() req: RequestWithUser, @Res() res: Response) {
    return this.authService.oauthLogin(req, res);
  }
}
