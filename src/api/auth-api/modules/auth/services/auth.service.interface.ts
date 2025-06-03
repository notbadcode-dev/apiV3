import { UserLoginRequestDto, UserLoginResponseDto } from '@auth-api/modules/auth/dtos/user-login.dto';
import { UserLogoutRequestDto, UserLogoutResponseDto } from '@auth-api/modules/auth/dtos/user-logout.dto';
import { UserRefreshRequestDto, UserRefreshResponseDto } from '@auth-api/modules/auth/dtos/user-refresh.dto';
import { UserRegisterRequestDto, UserRegisterResponseDto } from '@auth-api/modules/auth/dtos/user-register.dto';
import { RequestMetadataDto } from '@common/dtos/request-metadata.dto';

export interface IAuthService {
  register(request: UserRegisterRequestDto): Promise<UserRegisterResponseDto>;

  login(metadata: RequestMetadataDto, request: UserLoginRequestDto): Promise<UserLoginResponseDto>;

  logout(request: UserLogoutRequestDto): Promise<UserLogoutResponseDto>;

  refreshToken(request: UserRefreshRequestDto): Promise<UserRefreshResponseDto>;
}
