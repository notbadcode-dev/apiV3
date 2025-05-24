import { AUTH_CONSTANTS } from '@auth-api/modules/auth/constants/auth.constants';
import { UserRefreshResponseDto } from '@auth-api/modules/auth/dtos/userRefresh.dto';
import { AuthService } from '@auth-api/modules/auth/services/auth.service';
import { EMessageType } from '@common/enums/message-type.enum';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from '@user-application-api/modules/application/services/application.service';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { UserService } from '@user-application-api/modules/user/services/user.service';
import { UserApplicationService } from '@user-application-api/modules/user-application/services/user-application.service';

// Test Data
import { AuthServiceTestData } from './data/auth-service-test.data';

jest.mock('@common/utils/global-response.service');
jest.mock('@user-application-api/modules/user/services/user.service');
jest.mock('@user-application-api/modules/user-application/services/user-application.service');
jest.mock('@user-application-api/modules/application/services/application.service');
jest.mock('@common/modules/token/services/token.service');

// eslint-disable-next-line import/order
import { TransactionService } from '@common/modules/database/services/transaction.service';

let authService: AuthService;
let userServiceMock: jest.Mocked<UserService>;
let applicationServiceMock: jest.Mocked<ApplicationService>;
let userApplicationServiceMock: jest.Mocked<UserApplicationService>;
let tokenServiceMock: jest.Mocked<TokenService>;
let transactionServiceMock: jest.Mocked<TransactionService>;

beforeEach(() => {
  userServiceMock = {
    getById: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  applicationServiceMock = {} as unknown as jest.Mocked<ApplicationService>;
  userApplicationServiceMock = {} as unknown as jest.Mocked<UserApplicationService>;

  tokenServiceMock = {
    getAccessToken: jest.fn(),
    refreshToken: jest.fn(),
  } as unknown as jest.Mocked<TokenService>;

  transactionServiceMock = {} as unknown as jest.Mocked<TransactionService>;

  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockClear();

  authService = new AuthService(tokenServiceMock, userServiceMock, applicationServiceMock, userApplicationServiceMock, transactionServiceMock);
});

it('should throw UnauthorizedException if user does not exist', async () => {
  const REFRESH_REQUEST = AuthServiceTestData.getValidRefreshRequest();

  userServiceMock.getById.mockResolvedValue(null);

  await expect(authService.refreshToken(REFRESH_REQUEST)).rejects.toThrow(new UnauthorizedException(AUTH_CONSTANTS.messages.invalidCredentials()));

  expect(userServiceMock.getById).toHaveBeenCalledWith({ id: REFRESH_REQUEST.userId });
});

it('should return token response if refresh is valid', async () => {
  const REFRESH_REQUEST = AuthServiceTestData.getValidRefreshRequest();
  const USER: UserDto = AuthServiceTestData.getValidUserDto();
  const NEW_TOKEN = 'new.token.jwt';
  const EXPECTED_RESPONSE: UserRefreshResponseDto = {
    data: NEW_TOKEN,
    messageList: [{ type: EMessageType.SUCCESSFULLY, message: AUTH_CONSTANTS.messages.tokenRefreshed() }],
  };

  userServiceMock.getById.mockResolvedValue(USER);
  tokenServiceMock.getAccessToken.mockResolvedValue(NEW_TOKEN);
  tokenServiceMock.refreshToken.mockResolvedValue(NEW_TOKEN);
  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockReturnValue(EXPECTED_RESPONSE);

  const RESULT = await authService.refreshToken(REFRESH_REQUEST);

  expect(userServiceMock.getById).toHaveBeenCalledWith({ id: REFRESH_REQUEST.userId });
  expect(tokenServiceMock.getAccessToken).toHaveBeenCalledWith({
    email: USER.email,
    userId: USER.id,
    tryGetIfExists: false,
  });
  expect(tokenServiceMock.refreshToken).toHaveBeenCalledWith(USER.id);
  expect(RESULT).toEqual(EXPECTED_RESPONSE);
});
