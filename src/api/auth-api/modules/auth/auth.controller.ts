import { RequestMetadata } from '@common/decorators/request-metadata.decorator';
import { RequestMetadataDto } from '@common/dtos/request-metadata.dto';
import { JwtAuthGuard } from '@common/modules/token/guards/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { UserAuthenticatorDto } from './dtos/user-authenticator.dto';
import { UserLoginResponseDto } from './dtos/user-login.dto';
import { UserLogoutRequestDto, UserLogoutResponseDto } from './dtos/user-logout.dto';
import { UserRefreshRequestDto, UserRefreshResponseDto } from './dtos/user-refresh.dto';
import { UserRegisterResponseDto } from './dtos/user-register.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  public async register(@Body() request: UserAuthenticatorDto): Promise<UserRegisterResponseDto> {
    return await this._authService.register(request);
  }

  @Post('login')
  public async login(@RequestMetadata() metadata: RequestMetadataDto, @Body() request: UserAuthenticatorDto): Promise<UserLoginResponseDto> {
    return await this._authService.login(metadata, request);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Body() request: UserLogoutRequestDto): Promise<UserLogoutResponseDto> {
    return await this._authService.logout(request);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  public async refresh(@Body() request: UserRefreshRequestDto): Promise<UserRefreshResponseDto> {
    return await this._authService.refreshToken(request);
  }
}
