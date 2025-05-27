import { LogMethod } from '@common/decorators/logged-method.decorator';
import { RequestMetadataDto } from '@common/dtos/request-metadata.dto';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { AccessTokenPayloadDto } from '@common/modules/token/dtos/access-token-payload.dto';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from '@user-application-api/modules/application/services/application.service';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { GetUserRequestDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { User } from '@user-application-api/modules/user/entities/user.entity';
import { LoginHistoryService } from '@user-application-api/modules/user/services/login-history/login-history.service';
import { UserService } from '@user-application-api/modules/user/services/user/user.service';
import { ValidateUserAccessOnApplicationDto } from '@user-application-api/modules/user-application/dtos/validate-user-access-on-application.dto';
import { UserApplication } from '@user-application-api/modules/user-application/entities/user-application.entity';
import { UserApplicationService } from '@user-application-api/modules/user-application/services/user-application.service';
import * as bcrypt from 'bcryptjs';

import { IAuthService } from './auth.service.interface';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { UserAuthenticatorDto } from '../dtos/userAuthenticator.dto';
import { UserLoginRequestDto, UserLoginResponseDto } from '../dtos/userLogin.dto';
import { UserLogoutRequestDto, UserLogoutResponseDto } from '../dtos/userLogout.dto';
import { UserRefreshRequestDto, UserRefreshResponseDto } from '../dtos/userRefresh.dto';
import { UserRegisterRequestDto, UserRegisterResponseDto } from '../dtos/userRegister.dto';
import { EAuthenticationType } from '../enums/authentication-type.enum';

@Injectable()
export class AuthService implements IAuthService {
  //#region constructor and attributes

  constructor(
    private readonly _tokenService: TokenService,
    private readonly _userService: UserService,
    private readonly _applicationService: ApplicationService,
    private readonly _userApplicationService: UserApplicationService,
    private readonly _transactionService: TransactionService,
    private readonly _logHistoryService: LoginHistoryService,
  ) {}

  //#endregion

  //#region Public methods

  @LogMethod
  public async register(request: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    await this.validateArgumentsForLogin(request);

    await this._userService.validateIsAlreadyUserByEmail(request.email);

    const NEW_USER_ENTITY_ID: number = await this._transactionService.runTransaction(async () => {
      const NEW_USER_ENTITY = await this.saveNewUser(request);

      await this.saveNewUserApplication(request, NEW_USER_ENTITY.id);

      return NEW_USER_ENTITY.id;
    });

    const RESPONSE: UserRegisterResponseDto = GlobalResponseService.getSuccessfullyGlobalResponse(NEW_USER_ENTITY_ID, AUTH_CONSTANTS.messages.registrationSuccessfully());
    return RESPONSE;
  }

  @LogMethod
  public async login(metadata: RequestMetadataDto, request: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    await this.validateArgumentsForLogin(request);

    const USER: UserDto | null = await this._userService.getUserByEmail(request.email);

    const VALIDATE_USER_ACCESS_ON_APPLICATION: ValidateUserAccessOnApplicationDto = {
      userId: USER?.id ?? 0,
      applicationId: request.applicationId,
    };
    await this._userApplicationService.validateAccessUserOnApplication(VALIDATE_USER_ACCESS_ON_APPLICATION);

    const IS_PASSWORD_VALID = await bcrypt.compare(request.passwordHash, USER?.passwordHash ?? '');
    if (!IS_PASSWORD_VALID) {
      await this.manageFailureLogin(USER, request, metadata);
      throw new UnauthorizedException(AUTH_CONSTANTS.messages.invalidCredentials());
    }

    const ACCESS_TOKEN_PAYLOAD: AccessTokenPayloadDto = { email: USER?.email ?? '', userId: USER?.id ?? 0, tryGetIfExists: true };
    const ACCESS_TOKEN = await this._tokenService.getAccessToken(ACCESS_TOKEN_PAYLOAD);

    await this.manageSuccessfullyLogin(USER, request, metadata);
    return GlobalResponseService.getSuccessfullyGlobalResponse(ACCESS_TOKEN, AUTH_CONSTANTS.messages.loginSuccessfully());
  }

  @LogMethod
  public async logout(request: UserLogoutRequestDto): Promise<UserLogoutResponseDto> {
    await this.validateArgumentsForLogout(request);

    const REQUEST: GetUserRequestDto = { id: request.userId };
    const USER: UserDto | null = await this._userService.getById(REQUEST);

    const IS_SUCCESSFULLY_REVOKED = await this._tokenService.revokeToken(USER?.id ?? 0);

    if (!IS_SUCCESSFULLY_REVOKED) {
      throw new UnauthorizedException(AUTH_CONSTANTS.messages.logoutAlreadyDone());
    }

    return GlobalResponseService.getSuccessfullyGlobalResponse(IS_SUCCESSFULLY_REVOKED, AUTH_CONSTANTS.messages.logoutSuccessfully());
  }

  @LogMethod
  public async refreshToken(request: UserRefreshRequestDto): Promise<UserRefreshResponseDto> {
    await this.validateArgumentsForLogout(request);

    const REQUEST: GetUserRequestDto = { id: request.userId };
    const USER: UserDto | null = await this._userService.getById(REQUEST);

    if (!USER || USER.id !== request.userId) {
      throw new UnauthorizedException(AUTH_CONSTANTS.messages.invalidCredentials());
    }

    const ACCESS_TOKEN_PAYLOAD: AccessTokenPayloadDto = { email: USER?.email ?? '', userId: USER?.id ?? 0, tryGetIfExists: false };
    const NEW_TOKEN = await this._tokenService.getAccessToken(ACCESS_TOKEN_PAYLOAD);

    await this._tokenService.refreshToken(request.userId);

    return GlobalResponseService.getSuccessfullyGlobalResponse(NEW_TOKEN, AUTH_CONSTANTS.messages.tokenRefreshed());
  }

  //#endregion

  //#region Private methods

  @LogMethod
  private async saveNewUser(request: UserRegisterRequestDto): Promise<User> {
    const NEW_USER_ENTITY: User = new User();

    NEW_USER_ENTITY.email = request.email.trim().toLowerCase();
    NEW_USER_ENTITY.passwordHash = await this.getPasswordHash(request.passwordHash);
    NEW_USER_ENTITY.isActive = USER_CONSTANTS.defaults.isActive;

    await this._transactionService.manager?.save(User, NEW_USER_ENTITY);

    return NEW_USER_ENTITY;
  }

  @LogMethod
  private async getPasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, AUTH_CONSTANTS.configuration.bcrypt.salt);
  }

  @LogMethod
  private async saveNewUserApplication(request: UserRegisterRequestDto, userId: number): Promise<UserApplication> {
    const NEW_USER_APPLICATION: UserApplication = new UserApplication();

    NEW_USER_APPLICATION.applicationId = request.applicationId;
    NEW_USER_APPLICATION.userId = userId;

    await this._transactionService.manager?.save(UserApplication, NEW_USER_APPLICATION);

    return NEW_USER_APPLICATION;
  }

  @LogMethod
  private async validateArgumentsForLogin(request: UserAuthenticatorDto): Promise<void> {
    if (!request.email.trim()?.length) {
      throw new BadRequestException(USER_CONSTANTS.messages.emailIsRequired());
    }

    if (!request.passwordHash.trim()?.length) {
      throw new BadRequestException(USER_CONSTANTS.messages.passwordHashIsRequired());
    }

    const APPLICATION_ID: number = request.applicationId;

    if (request.authenticationType === EAuthenticationType.REGISTRATION && (!APPLICATION_ID || APPLICATION_ID <= 0)) {
      throw new BadRequestException(USER_CONSTANTS.messages.applicationIdIsRequired());
    }

    await this._applicationService.validateIsApplicationNotFoundById(APPLICATION_ID);
  }

  @LogMethod
  private async validateArgumentsForLogout(request: UserLogoutRequestDto): Promise<void> {
    if (!request.userId || request.userId <= 0) {
      throw new BadRequestException(USER_CONSTANTS.messages.userIdIsRequired());
    }
  }

  @LogMethod
  private async manageFailureLogin(user: UserDto | null, request: UserLoginRequestDto, metadata: RequestMetadataDto): Promise<void> {
    await this._logHistoryService.setLoginHistoryFailed({
      userId: user?.id ?? 0,
      applicationId: request.applicationId,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      failureReason: AUTH_CONSTANTS.messages.invalidCredentials(),
    });
  }

  @LogMethod
  private async manageSuccessfullyLogin(user: UserDto | null, request: UserLoginRequestDto, metadata: RequestMetadataDto): Promise<void> {
    await this._logHistoryService.setLoginHistorySuccessfully({
      userId: user?.id ?? 0,
      applicationId: request.applicationId,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
  }

  //#endregion
}
