import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { Public } from './public.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginRequest } from './dtos/login.dto';

@Controller('api/auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  @Post('login')
  async login(@Req() req: Request & { user: User }) {
    return await this.authService.login(req.user);
  }
}
