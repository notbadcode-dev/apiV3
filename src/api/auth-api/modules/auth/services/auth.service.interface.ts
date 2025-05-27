import { UserLoginRequestDto, UserLoginResponseDto } from '@auth-api/modules/auth/dtos/userLogin.dto';
import { UserLogoutRequestDto, UserLogoutResponseDto } from '@auth-api/modules/auth/dtos/userLogout.dto';
import { UserRefreshRequestDto, UserRefreshResponseDto } from '@auth-api/modules/auth/dtos/userRefresh.dto';
import { UserRegisterRequestDto, UserRegisterResponseDto } from '@auth-api/modules/auth/dtos/userRegister.dto';
import { RequestMetadataDto } from '@common/dtos/request-metadata.dto';

export interface IAuthService {
  register(request: UserRegisterRequestDto): Promise<UserRegisterResponseDto>;

  login(metadata: RequestMetadataDto, request: UserLoginRequestDto): Promise<UserLoginResponseDto>;

  logout(request: UserLogoutRequestDto): Promise<UserLogoutResponseDto>;

  refreshToken(request: UserRefreshRequestDto): Promise<UserRefreshResponseDto>;
}
