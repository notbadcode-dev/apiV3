import { AuditLogService } from '@audit-api/modules/audit/services/audit.service';
import { AUTH_CONSTANTS } from '@auth-api/modules/auth/constants/auth.constants';
import { UserLogoutRequestDto, UserLogoutResponseDto } from '@auth-api/modules/auth/dtos/userLogout.dto';
import { AuthService } from '@auth-api/modules/auth/services/auth.service';
import { EMessageType } from '@common/enums/message-type.enum';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from '@user-application-api/modules/application/services/application.service';
import { LoginHistoryService } from '@user-application-api/modules/login-history/services/login-history.service';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { UserService } from '@user-application-api/modules/user/services/user.service';
import { UserApplicationService } from '@user-application-api/modules/user-application/services/user-application.service';

import { AuthServiceTestData } from './data/auth-service-test.data';

jest.mock('@common/utils/global-response.service');

let authService: AuthService;
let userServiceMock: jest.Mocked<UserService>;
let tokenServiceMock: jest.Mocked<TokenService>;
let auditLogServiceMock: jest.Mocked<AuditLogService>;

beforeEach(() => {
  userServiceMock = {
    getById: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  tokenServiceMock = {
    revokeToken: jest.fn(),
  } as unknown as jest.Mocked<TokenService>;

  auditLogServiceMock = {
    addCreateLog: jest.fn(),
    addUpdateLog: jest.fn(),
    addDeleteLog: jest.fn(),
    addActionLog: jest.fn(),
  } as unknown as jest.Mocked<AuditLogService>;

  authService = new AuthService(
    tokenServiceMock,
    userServiceMock,
    {} as unknown as ApplicationService,
    {} as unknown as UserApplicationService,
    {} as unknown as TransactionService,
    {} as unknown as LoginHistoryService,
    auditLogServiceMock,
  );

  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockClear();
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
