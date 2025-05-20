import { EMessageType } from '@common/enums/message-type.enum';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { ApplicationService } from '@modules/application/services/application.service';
import { AUTH_CONSTANTS } from '@modules/auth/constants/auth.constants';
import { UserLogoutRequestDto, UserLogoutResponseDto } from '@modules/auth/dtos/userLogout.dto';
import { AuthService } from '@modules/auth/services/auth.service';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { UserDto } from '@modules/user/dtos/user.dto';
import { UserService } from '@modules/user/services/user.service';
import { UserApplicationService } from '@modules/user-application/services/user-application.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { AuthServiceTestData } from './data/auth-service-test.data';

jest.mock('@common/utils/global-response.service');

let authService: AuthService;
let userServiceMock: jest.Mocked<UserService>;
let tokenServiceMock: jest.Mocked<TokenService>;

beforeEach(() => {
  userServiceMock = {
    getById: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  tokenServiceMock = {
    revokeToken: jest.fn(),
  } as unknown as jest.Mocked<TokenService>;

  authService = new AuthService(
    tokenServiceMock,
    userServiceMock,
    {} as unknown as ApplicationService,
    {} as unknown as UserApplicationService,
    {} as unknown as TransactionService,
  );

  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockClear();
});

it('should throw BadRequestException if token is missing', async () => {
  const REQUEST: UserLogoutRequestDto = AuthServiceTestData.getLogoutRequestWithEmptyToken();

  await expect(authService.logout(REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.tokenIsRequired()));
});

it('should throw BadRequestException if userId is invalid', async () => {
  const REQUEST: UserLogoutRequestDto = AuthServiceTestData.getLogoutRequestWithInvalidUserId();

  await expect(authService.logout(REQUEST)).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.userIdIsRequired()));
});

it('should throw UnauthorizedException if revokeToken fails', async () => {
  const REQUEST: UserLogoutRequestDto = AuthServiceTestData.getValidLogoutRequest();
  const USER: UserDto = AuthServiceTestData.getValidUserDto();

  userServiceMock.getById.mockResolvedValue(USER);
  tokenServiceMock.revokeToken.mockResolvedValue(false);

  await expect(authService.logout(REQUEST)).rejects.toThrow(new UnauthorizedException(AUTH_CONSTANTS.messages.logoutAlreadyDone()));
});

it('should return response if revokeToken succeeds', async () => {
  const REQUEST: UserLogoutRequestDto = AuthServiceTestData.getValidLogoutRequest();
  const USER: UserDto = AuthServiceTestData.getValidUserDto();
  const EXPECTED_RESPONSE: UserLogoutResponseDto = {
    data: true,
    messageList: [{ type: EMessageType.SUCCESSFULLY, message: AUTH_CONSTANTS.messages.logoutSuccessfully() }],
  };

  userServiceMock.getById.mockResolvedValue(USER);
  tokenServiceMock.revokeToken.mockResolvedValue(true);
  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockReturnValue(EXPECTED_RESPONSE);

  const RESULT = await authService.logout(REQUEST);

  expect(tokenServiceMock.revokeToken).toHaveBeenCalledWith(USER.id);
  expect(RESULT).toEqual(EXPECTED_RESPONSE);
});
