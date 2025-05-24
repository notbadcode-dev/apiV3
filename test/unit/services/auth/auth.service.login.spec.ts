import { AUTH_CONSTANTS } from '@auth-api/modules/auth/constants/auth.constants';
import { UserLoginResponseDto } from '@auth-api/modules/auth/dtos/userLogin.dto';
import { AuthService } from '@auth-api/modules/auth/services/auth.service';
import { EMessageType } from '@common/enums/message-type.enum';
// eslint-disable-next-line import/order
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line import/order
import { ApplicationService } from '@user-application-api/modules/application/services/application.service';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { UserService } from '@user-application-api/modules/user/services/user.service';
import { UserApplicationService } from '@user-application-api/modules/user-application/services/user-application.service';
import * as bcrypt from 'bcryptjs';

import { AuthServiceTestData } from './data/auth-service-test.data';

jest.mock('@common/utils/global-response.service');
jest.mock('@user-application-api/modules/user/services/user.service');
jest.mock('@user-application-api/modules/user-application/services/user-application.service');
jest.mock('@user-application-api/modules/application/services/application.service');
jest.mock('@common/modules/token/services/token.service');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

let authService: AuthService;
let userServiceMock: jest.Mocked<UserService>;
let applicationServiceMock: jest.Mocked<ApplicationService>;
let userApplicationServiceMock: jest.Mocked<UserApplicationService>;
let tokenServiceMock: jest.Mocked<TokenService>;
let transactionServiceMock: jest.Mocked<TransactionService>;

beforeEach(async () => {
  userServiceMock = {
    getUserByEmail: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  applicationServiceMock = {
    validateIsApplicationNotFoundById: jest.fn(),
  } as unknown as jest.Mocked<ApplicationService>;

  userApplicationServiceMock = {
    validateAccessUserOnApplication: jest.fn(),
  } as unknown as jest.Mocked<UserApplicationService>;

  tokenServiceMock = {
    getAccessToken: jest.fn(),
  } as unknown as jest.Mocked<TokenService>;

  transactionServiceMock = {
    runTransaction: jest.fn(),
  } as unknown as jest.Mocked<TransactionService>;

  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockClear();

  authService = new AuthService(tokenServiceMock, userServiceMock, applicationServiceMock, userApplicationServiceMock, transactionServiceMock);
});

it('should throw BadRequestException if email is missing', async () => {
  const LOGIN_REQUEST = AuthServiceTestData.getUserLoginRequestWithEmptyEmail();

  await expect(authService.login(LOGIN_REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.emailIsRequired()));
});

it('should throw BadRequestException if password is missing', async () => {
  const LOGIN_REQUEST = AuthServiceTestData.getUserLoginRequestWithEmptyPasswordHash();

  await expect(authService.login(LOGIN_REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.passwordHashIsRequired()));
});

it('should throw UnauthorizedException if password is incorrect', async () => {
  const LOGIN_REQUEST = AuthServiceTestData.getValidUserLoginRequest();
  const USER: UserDto = AuthServiceTestData.getValidUserDto();

  userServiceMock.getUserByEmail.mockResolvedValue(USER);
  (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  applicationServiceMock.validateIsApplicationNotFoundById.mockResolvedValue();
  userApplicationServiceMock.validateAccessUserOnApplication.mockResolvedValue();

  await expect(authService.login(LOGIN_REQUEST)).rejects.toThrow(new UnauthorizedException(AUTH_CONSTANTS.messages.invalidCredentials()));
});

it('should return token response if credentials are valid', async () => {
  const LOGIN_REQUEST = AuthServiceTestData.getValidUserLoginRequest();
  const USER: UserDto = AuthServiceTestData.getValidUserDto();
  const ACCESS_TOKEN = 'mocked-token';
  const RESPONSE: UserLoginResponseDto = {
    data: ACCESS_TOKEN,
    messageList: [{ type: EMessageType.SUCCESSFULLY, message: AUTH_CONSTANTS.messages.loginSuccessfully() }],
  };

  userServiceMock.getUserByEmail.mockResolvedValue(USER);
  (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  applicationServiceMock.validateIsApplicationNotFoundById.mockResolvedValue();
  userApplicationServiceMock.validateAccessUserOnApplication.mockResolvedValue();
  tokenServiceMock.getAccessToken.mockResolvedValue(ACCESS_TOKEN);
  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockReturnValue(RESPONSE);

  const RESULT = await authService.login(LOGIN_REQUEST);

  expect(userServiceMock.getUserByEmail).toHaveBeenCalledWith(LOGIN_REQUEST.email);
  expect(tokenServiceMock.getAccessToken).toHaveBeenCalled();
  expect(RESULT).toEqual(RESPONSE);
});
