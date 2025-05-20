import { AccessTokenPayloadDto } from '@common/modules/database/dtos/access-token-payload.dto';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { ApplicationService } from '@modules/application/services/application.service';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { GetUserRequestDto } from '@modules/user/dtos/getUser.dto';
import { UserDto } from '@modules/user/dtos/user.dto';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { ValidateUserAccessOnApplicationDto } from '@modules/user-application/dtos/validate-user-access-on-application.dto';
import { UserApplication } from '@modules/user-application/entities/user-application.entity';
import { UserApplicationService } from '@modules/user-application/services/user-application.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { IAuthService } from './auth.service.interface';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { UserAuthenticatorDto } from '../dtos/userAuthenticator.dto';
import { UserLoginRequestDto, UserLoginResponseDto } from '../dtos/userLogin.dto';
import { UserLogoutRequestDto, UserLogoutResponseDto } from '../dtos/userLogout.dto';
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
  ) {}

  //#endregion

  //#region Public methods

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

  public async login(request: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    await this.validateArgumentsForLogin(request);

    const USER: UserDto | null = await this._userService.getUserByEmail(request.email);

    const VALIDATE_USER_ACCESS_ON_APPLICATION: ValidateUserAccessOnApplicationDto = {
      userId: USER?.id ?? 0,
      applicationId: request.applicationId,
    };
    await this._userApplicationService.validateAccessUserOnApplication(VALIDATE_USER_ACCESS_ON_APPLICATION);

    const IS_PASSWORD_VALID = await bcrypt.compare(request.passwordHash, USER?.passwordHash ?? '');
    if (!IS_PASSWORD_VALID) {
      throw new UnauthorizedException(AUTH_CONSTANTS.messages.invalidCredentials());
    }

    const ACCESS_TOKEN_PAYLOAD: AccessTokenPayloadDto = { email: USER?.email ?? '', userId: USER?.id ?? 0 };
    const ACCESS_TOKEN = await this._tokenService.getAccessToken(ACCESS_TOKEN_PAYLOAD);

    return GlobalResponseService.getSuccessfullyGlobalResponse(ACCESS_TOKEN, AUTH_CONSTANTS.messages.loginSuccessfully());
  }

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

  //#endregion

  //#region Private methods

  private async saveNewUser(request: UserRegisterRequestDto): Promise<User> {
    const NEW_USER_ENTITY: User = new User();

    NEW_USER_ENTITY.email = request.email.trim().toLowerCase();
    NEW_USER_ENTITY.passwordHash = await this.getPasswordHash(request.passwordHash);
    NEW_USER_ENTITY.isActive = USER_CONSTANTS.defaults.isActive;

    await this._transactionService.manager?.save(User, NEW_USER_ENTITY);

    return NEW_USER_ENTITY;
  }

  private async getPasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, AUTH_CONSTANTS.configuration.bcrypt.salt);
  }

  private async saveNewUserApplication(request: UserRegisterRequestDto, userId: number): Promise<UserApplication> {
    const NEW_USER_APPLICATION: UserApplication = new UserApplication();

    NEW_USER_APPLICATION.applicationId = request.applicationId;
    NEW_USER_APPLICATION.userId = userId;

    await this._transactionService.manager?.save(UserApplication, NEW_USER_APPLICATION);

    return NEW_USER_APPLICATION;
  }

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

  private async validateArgumentsForLogout(request: UserLogoutRequestDto): Promise<void> {
    if (!request.token.trim()?.length) {
      throw new BadRequestException(USER_CONSTANTS.messages.tokenIsRequired());
    }

    if (!request.userId || request.userId <= 0) {
      throw new BadRequestException(USER_CONSTANTS.messages.userIdIsRequired());
    }
  }

  //#endregion
}
