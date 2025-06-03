import { UserLoginRequestDto } from '@auth-api/modules/auth/dtos/user-login.dto';
import { UserLogoutRequestDto } from '@auth-api/modules/auth/dtos/user-logout.dto';
import { UserRefreshRequestDto } from '@auth-api/modules/auth/dtos/user-refresh.dto';
import { UserRegisterRequestDto } from '@auth-api/modules/auth/dtos/user-register.dto';
import { EAuthenticationType } from '@auth-api/modules/auth/enums/authentication-type.enum';
import { RequestMetadataDto } from '@common/dtos/request-metadata.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';

export class AuthServiceTestData {
  public static getValidUserRegisterRequest(): UserRegisterRequestDto {
    return {
      email: 'test@example.com',
      passwordHash: 'password123',
      applicationId: 1,
      authenticationType: EAuthenticationType.REGISTRATION,
    };
  }

  public static getUserRegisterRequestWithEmptyEmail(): UserRegisterRequestDto {
    return {
      ...this.getValidUserRegisterRequest(),
      email: '',
    };
  }

  public static getUserRegisterRequestWithEmptyPasswordHash(): UserRegisterRequestDto {
    return {
      ...this.getValidUserRegisterRequest(),
      passwordHash: '',
    };
  }

  public static getUserRegisterRequestWithEmptyApplicationId(): UserRegisterRequestDto {
    return {
      ...this.getValidUserRegisterRequest(),
      applicationId: 0,
    };
  }

  public static getValidUserId(): number {
    return 1;
  }

  public static getValidUserLoginRequest(): UserLoginRequestDto {
    return {
      email: 'test@example.com',
      passwordHash: 'password123',
      applicationId: 1,
      authenticationType: EAuthenticationType.LOGIN,
    };
  }

  public static getUserLoginRequestWithEmptyEmail(): UserLoginRequestDto {
    return {
      ...this.getValidUserLoginRequest(),
      email: '',
    };
  }

  public static getUserLoginRequestWithEmptyPasswordHash(): UserLoginRequestDto {
    return {
      ...this.getValidUserLoginRequest(),
      passwordHash: '',
    };
  }

  public static getUserLoginRequestWithInvalidApplicationId(): UserLoginRequestDto {
    return {
      ...this.getValidUserLoginRequest(),
      applicationId: 0,
    };
  }

  public static getValidUserDto(): UserDto {
    return {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    };
  }

  public static getValidAccessToken(): string {
    return 'mocked-access-token';
  }

  public static getValidLogoutRequest(): UserLogoutRequestDto {
    return {
      userId: 1,
    };
  }

  public static getLogoutRequestWithInvalidUserId(): UserLogoutRequestDto {
    return {
      ...this.getValidLogoutRequest(),
      userId: 0,
    };
  }

  public static getValidRefreshRequest(): UserRefreshRequestDto {
    return {
      userId: 1,
    };
  }

  public static getRefreshRequestWithInvalidUserId(): UserRefreshRequestDto {
    return {
      userId: 0,
    };
  }

  public static getValidRequestMetadataDto(): RequestMetadataDto {
    return {
      applicationId: 1,
      userAgent: 'Mozilla/5.0',
      ipAddress: '',
    };
  }
}
