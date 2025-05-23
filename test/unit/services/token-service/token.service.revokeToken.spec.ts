import { RedisService } from '@common/modules/redis/services/redis.service';
import { TokenService } from '@common/modules/token/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenServiceTestData } from './data/token-service-test.data';

let tokenService: TokenService;
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
          expireAccessToken: jest.fn(),
        },
      },
    ],
  }).compile();

  tokenService = MODULE_REF.get<TokenService>(TokenService);
  redisService = MODULE_REF.get<RedisService>(RedisService);
});

it('should call RedisService.expireAccessToken and return true', async () => {
  // Arrange
  const USER_ID = TokenServiceTestData.getValidAccessTokenPayload().userId;
  const EXPIRE_SPY = jest.spyOn(redisService, TokenServiceTestData.getRedisExpireAccessTokenMethodName()).mockResolvedValue(true);

  // Act
  const RESULT = await tokenService.revokeToken(USER_ID);

  // Assert
  expect(EXPIRE_SPY).toHaveBeenCalledWith(USER_ID);
  expect(RESULT).toBe(true);
});

it('should call RedisService.expireAccessToken and return false if it fails', async () => {
  // Arrange
  const USER_ID = TokenServiceTestData.getValidAccessTokenPayload().userId;
  const EXPIRE_SPY = jest.spyOn(redisService, TokenServiceTestData.getRedisExpireAccessTokenMethodName()).mockResolvedValue(false);

  // Act
  const RESULT = await tokenService.revokeToken(USER_ID);

  // Assert
  expect(EXPIRE_SPY).toHaveBeenCalledWith(USER_ID);
  expect(RESULT).toBe(false);
});
