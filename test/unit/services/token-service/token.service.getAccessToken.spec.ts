import { RedisService } from '@common/modules/redis/services/redis.service';
import { AccessTokenPayloadDto } from '@common/modules/token/dtos/access-token-payload.dto';
import { TokenService } from '@common/modules/token/services/token.service';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenServiceTestData } from './data/token-service-test.data';

let tokenService: TokenService;
let jwtService: jest.Mocked<JwtService>;
let redisService: jest.Mocked<RedisService>;

beforeEach(async () => {
  const MODULE_REF: TestingModule = await Test.createTestingModule({
    providers: [
      TokenService,
      {
        provide: JwtService,
        useValue: {
          signAsync: jest.fn(),
          verifyAsync: jest.fn(),
        },
      },
      {
        provide: RedisService,
        useValue: {
          getAccessToken: jest.fn(),
          setAccessToken: jest.fn(),
        },
      },
    ],
  }).compile();

  tokenService = MODULE_REF.get(TokenService);
  jwtService = MODULE_REF.get(JwtService) as jest.Mocked<JwtService>;
  redisService = MODULE_REF.get(RedisService) as jest.Mocked<RedisService>;
});

it('should throw BadRequestException if email is empty and not call sign method', async () => {
  const REQUEST: AccessTokenPayloadDto = TokenServiceTestData.getAccessTokenPayloadWithEmptyEmail();

  await expect(tokenService.getAccessToken(REQUEST)).rejects.toThrowErrorMatchingInlineSnapshot(USER_CONSTANTS.messages.emailIsRequired());
});

it('should throw BadRequestException if userId is invalid and not call sign method', async () => {
  const REQUEST: AccessTokenPayloadDto = TokenServiceTestData.getAccessTokenPayloadWithInvalidUserId();

  await expect(tokenService.getAccessToken(REQUEST)).rejects.toThrowErrorMatchingInlineSnapshot(USER_CONSTANTS.messages.userIdIsRequired());
});

it('should generate a new token and store it in Redis if tryGetIfExists is false', async () => {
  const PAYLOAD = TokenServiceTestData.getAccessTokenPayloadWithInvalidUserIdWithNotTryGetIfExists();
  const TOKEN = TokenServiceTestData.getJwTokenMock();

  jwtService.signAsync.mockResolvedValue(TOKEN);
  redisService.setAccessToken.mockResolvedValue();

  const RESULT = await tokenService.getAccessToken(PAYLOAD);

  expect(jwtService.signAsync).toHaveBeenCalledWith(PAYLOAD);
  expect(redisService.setAccessToken).toHaveBeenCalledWith(PAYLOAD.userId, TOKEN);
  expect(RESULT).toBe(TOKEN);
});

it('should return empty string if no existing token found in Redis', async () => {
  const PAYLOAD = { ...TokenServiceTestData.getValidAccessTokenPayload(), tryGetIfExists: true };

  redisService.getAccessToken.mockResolvedValue(null);

  const RESULT = await tokenService.getAccessToken(PAYLOAD);

  expect(redisService.getAccessToken).toHaveBeenCalledWith(PAYLOAD.userId);
  expect(RESULT).toBe('');
});

it('should return existing token if it is still valid', async () => {
  const PAYLOAD = { ...TokenServiceTestData.getValidAccessTokenPayload(), tryGetIfExists: true };
  const TOKEN = TokenServiceTestData.getJwTokenMock();

  redisService.getAccessToken.mockResolvedValue(TOKEN);
  jwtService.verifyAsync.mockResolvedValue(PAYLOAD);

  const RESULT = await tokenService.getAccessToken(PAYLOAD);

  expect(jwtService.verifyAsync).toHaveBeenCalledWith(TOKEN);
  expect(RESULT).toBe(TOKEN);
});

it('should revoke token and return null if token is expired', async () => {
  const PAYLOAD = { ...TokenServiceTestData.getValidAccessTokenPayload(), tryGetIfExists: true };
  const TOKEN = TokenServiceTestData.getJwTokenMock();

  redisService.getAccessToken.mockResolvedValue(TOKEN);
  jwtService.verifyAsync.mockRejectedValue({ name: 'TokenExpiredError' });

  const REVOKE_SPY = jest.spyOn(tokenService, 'revokeToken').mockResolvedValue(true);

  const RESULT = await tokenService.getAccessToken(PAYLOAD);

  expect(jwtService.verifyAsync).toHaveBeenCalledWith(TOKEN);
  expect(REVOKE_SPY).toHaveBeenCalledWith(PAYLOAD.userId);
  expect(RESULT).toBe('');
});

it('should throw if verifyToken throws unexpected error', async () => {
  const PAYLOAD = { ...TokenServiceTestData.getValidAccessTokenPayload(), tryGetIfExists: true };
  const TOKEN = TokenServiceTestData.getJwTokenMock();

  redisService.getAccessToken.mockResolvedValue(TOKEN);
  jwtService.verifyAsync.mockRejectedValue(new Error('Unexpected'));

  await expect(tokenService.getAccessToken(PAYLOAD)).rejects.toThrow('Unexpected');
});
