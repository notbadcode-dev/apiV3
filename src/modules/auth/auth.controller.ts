import { JwtAuthGuard } from '@common/modules/token/guards/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { UserAuthenticatorDto } from './dtos/userAuthenticator.dto';
import { UserLoginResponseDto } from './dtos/userLogin.dto';
import { UserLogoutRequestDto, UserLogoutResponseDto } from './dtos/userLogout.dto';
import { UserRegisterResponseDto } from './dtos/userRegister.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  public async register(@Body() request: UserAuthenticatorDto): Promise<UserRegisterResponseDto> {
    return await this._authService.register(request);
  }

  @Post('login')
  public async login(@Body() request: UserAuthenticatorDto): Promise<UserLoginResponseDto> {
    return await this._authService.login(request);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Body() request: UserLogoutRequestDto): Promise<UserLogoutResponseDto> {
    return await this._authService.logout(request);
  }
}
