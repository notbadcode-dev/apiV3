import { AUTH_CONSTANTS } from '@auth-api/modules/auth/constants/auth.constants';
import { UserRegisterRequestDto, UserRegisterResponseDto } from '@auth-api/modules/auth/dtos/userRegister.dto';
import { AuthService } from '@auth-api/modules/auth/services/auth.service';
import { EMessageType } from '@common/enums/message-type.enum';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '@user-application-api/modules/application/services/application.service';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { UserService } from '@user-application-api/modules/user/services/user.service';
import { UserApplicationService } from '@user-application-api/modules/user-application/services/user-application.service';

import { AuthServiceTestData } from './data/auth-service-test.data';

jest.mock('@common/utils/global-response.service');
jest.mock('@user-application-api/modules/user/services/user.service');
jest.mock('@user-application-api/modules/user-application/services/user-application.service');
jest.mock('@user-application-api/modules/application/services/application.service');
jest.mock('@common/modules/token/services/token.service');

let authService: AuthService;
let userServiceMock: Partial<jest.Mocked<UserService>>;
let tokenServiceMock: Partial<jest.Mocked<TokenService>>;
let userApplicationServiceMock: Partial<jest.Mocked<UserApplicationService>>;
let transactionServiceMock: Partial<jest.Mocked<TransactionService>>;
let applicationServiceMock: Partial<jest.Mocked<ApplicationService>>;

beforeEach(async () => {
  userServiceMock = {
    validateIsAlreadyUserByEmail: jest.fn(),
    getUserByEmail: jest.fn(),
    getById: jest.fn(),
  };

  tokenServiceMock = {
    getAccessToken: jest.fn(),
  };

  userApplicationServiceMock = {
    validateAccessUserOnApplication: jest.fn(),
  };

  applicationServiceMock = {
    validateIsApplicationNotFoundById: jest.fn(),
  };

  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock) = jest.fn();

  const ENTITY_MANAGER_MOCK = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const QUERY_RUNNER_MOCK = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: ENTITY_MANAGER_MOCK,
  };

  transactionServiceMock = {
    runTransaction: jest.fn(),
    queryRunner: QUERY_RUNNER_MOCK,
  } as Partial<jest.Mocked<TransactionService>>;

  const MODULE: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      {
        provide: UserService,
        useValue: userServiceMock,
      },
      {
        provide: TokenService,
        useValue: tokenServiceMock,
      },
      {
        provide: UserApplicationService,
        useValue: userApplicationServiceMock,
      },
      {
        provide: ApplicationService,
        useValue: applicationServiceMock,
      },
      {
        provide: TransactionService,
        useValue: transactionServiceMock,
      },
    ],
  }).compile();

  authService = MODULE.get<AuthService>(AuthService);
});

it('should throw UnauthorizedException if user already exists during registration', async () => {
  // Arrange
  const REGISTER_REQUEST: UserRegisterRequestDto = AuthServiceTestData.getValidUserRegisterRequest();

  userServiceMock?.validateIsAlreadyUserByEmail?.mockRejectedValue(new UnauthorizedException(USER_CONSTANTS.messages.itemAlreadyExists()));

  // Act
  await expect(authService.register(REGISTER_REQUEST)).rejects.toThrow(new UnauthorizedException(USER_CONSTANTS.messages.itemAlreadyExists()));

  // Assert
  expect(userServiceMock?.validateIsAlreadyUserByEmail).toHaveBeenCalledWith(REGISTER_REQUEST.email);
});

it('should throw BadRequestException if email is not provided', async () => {
  // Arrange
  const REGISTER_REQUEST: UserRegisterRequestDto = AuthServiceTestData.getUserRegisterRequestWithEmptyEmail();

  // Act & Assert
  await expect(authService.register(REGISTER_REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.emailIsRequired()));
});

it('should throw BadRequestException if passwordHash is not provided', async () => {
  // Arrange
  const REGISTER_REQUEST: UserRegisterRequestDto = AuthServiceTestData.getUserRegisterRequestWithEmptyPasswordHash();

  // Act & Assert
  await expect(authService.register(REGISTER_REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.passwordHashIsRequired()));
});

it('should throw BadRequestException if applicationId is not provided during registration', async () => {
  // Arrange
  const REGISTER_REQUEST: UserRegisterRequestDto = AuthServiceTestData.getUserRegisterRequestWithEmptyApplicationId();

  // Act & Assert
  await expect(authService.register(REGISTER_REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.applicationIdIsRequired()));
});

it('should register a user successfully', async () => {
  // Arrange
  const REGISTER_REQUEST: UserRegisterRequestDto = AuthServiceTestData.getValidUserRegisterRequest();
  const EXPECTED_RESPONSE: UserRegisterResponseDto = {
    data: AuthServiceTestData.getValidUserId(),
    messageList: [{ type: EMessageType.SUCCESSFULLY, message: AUTH_CONSTANTS.messages.registrationSuccessfully() }],
  };

  userServiceMock?.validateIsAlreadyUserByEmail?.mockResolvedValue(undefined);
  transactionServiceMock?.runTransaction?.mockResolvedValue(REGISTER_REQUEST);

  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockReturnValue(EXPECTED_RESPONSE);

  // Act
  const RESPONSE = await authService.register(REGISTER_REQUEST);

  // Assert
  expect(RESPONSE).toEqual(EXPECTED_RESPONSE);
  expect(transactionServiceMock?.runTransaction).toHaveBeenCalled();
  expect(userServiceMock?.validateIsAlreadyUserByEmail).toHaveBeenCalledWith(REGISTER_REQUEST.email);
});

it('should handle error if transaction fails during user registration', async () => {
  // Arrange
  const REGISTER_REQUEST: UserRegisterRequestDto = AuthServiceTestData.getValidUserRegisterRequest();

  userServiceMock?.validateIsAlreadyUserByEmail?.mockResolvedValue(undefined);
  transactionServiceMock?.runTransaction?.mockRejectedValue(new Error('Transaction failed'));

  // Act & Assert
  await expect(authService.register(REGISTER_REQUEST)).rejects.toThrow(new Error('Transaction failed'));
  expect(transactionServiceMock?.runTransaction).toHaveBeenCalled();
});
