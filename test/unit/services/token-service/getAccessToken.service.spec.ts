import { AccessTokenPayloadDto } from '@common/modules/database/dtos/access-token-payload.dto';
import { RedisService } from '@common/modules/redis/services/redis.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenServiceTestData } from './data/token-service-test.data';

let tokenService: TokenService;
let jwtService: JwtService;
let redisService: RedisService;

beforeEach(async () => {
  const MODULE_REF: TestingModule = await Test.createTestingModule({
    providers: [
      TokenService,
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn(),
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

  tokenService = MODULE_REF.get<TokenService>(TokenService);
  jwtService = MODULE_REF.get<JwtService>(JwtService);
  redisService = MODULE_REF.get<RedisService>(RedisService);
});

it('should throw BadRequestException if email is empty and not call sign method', async () => {
  // Arrange
  const PAYLOAD: AccessTokenPayloadDto = TokenServiceTestData.getAccessTokenPayloadWithEmptyEmail();
  const SIGN_SPY = jest.spyOn(jwtService, TokenServiceTestData.getJwTokenSignMethodName());

  // Act & Assert
  await expect(tokenService.getAccessToken(PAYLOAD)).rejects.toThrow(USER_CONSTANTS.messages.emailIsRequired());
  expect(SIGN_SPY).not.toHaveBeenCalled();
});

it('should throw BadRequestException if userId is invalid and not call sign method', async () => {
  // Arrange
  const PAYLOAD: AccessTokenPayloadDto = TokenServiceTestData.getAccessTokenPayloadWithInvalidUserId();
  const SIGN_SPY = jest.spyOn(jwtService, TokenServiceTestData.getJwTokenSignMethodName());
  const REDIS_GET_SPY = jest.spyOn(redisService, TokenServiceTestData.getRedisGetAccessTokenMethodName());

  // Act & Assert
  await expect(tokenService.getAccessToken(PAYLOAD)).rejects.toThrow(USER_CONSTANTS.messages.userIdIsRequired());

  expect(SIGN_SPY).not.toHaveBeenCalled();
  expect(REDIS_GET_SPY).not.toHaveBeenCalled();
});

it('should call JwtService.sign and return a token', async () => {
  // Arrange
  const PAYLOAD: AccessTokenPayloadDto = TokenServiceTestData.getValidAccessTokenPayload();

  jest.spyOn(redisService, TokenServiceTestData.getRedisGetAccessTokenMethodName()).mockResolvedValue(null);
  const SIGN_SPY = jest.spyOn(jwtService, TokenServiceTestData.getJwTokenSignMethodName()).mockReturnValue(TokenServiceTestData.getJwTokenMock());
  const REDIS_SET_SPY = jest.spyOn(redisService, TokenServiceTestData.getRedisGetAccessTokenMethodName()).mockResolvedValue();

  // Act
  const RESULT = await tokenService.getAccessToken(PAYLOAD);

  // Assert
  expect(SIGN_SPY).toHaveBeenCalledWith(PAYLOAD);
  expect(REDIS_SET_SPY).toHaveBeenCalledWith(PAYLOAD.userId, TokenServiceTestData.getJwTokenMock());
  expect(RESULT).toBe(TokenServiceTestData.getJwTokenMock());
});
