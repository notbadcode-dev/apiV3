import { RedisService } from '@common/modules/redis/services/redis.service';
import { AccessTokenPayloadDto } from '@common/modules/token/dtos/access-token-payload.dto';
import { JwtService } from '@nestjs/jwt';

export class TokenServiceTestData {
  public static getValidAccessTokenPayload(): AccessTokenPayloadDto {
    return {
      email: 'user@example.com',
      userId: 1,
      tryGetIfExists: true,
    };
  }

  public static getAccessTokenPayloadWithEmptyEmail(): AccessTokenPayloadDto {
    return {
      ...this.getValidAccessTokenPayload(),
      email: '',
    };
  }

  public static getAccessTokenPayloadWithInvalidUserId(): AccessTokenPayloadDto {
    return {
      ...this.getValidAccessTokenPayload(),
      userId: 0,
    };
  }

  public static getAccessTokenPayloadWithInvalidUserIdWithNotTryGetIfExists(): AccessTokenPayloadDto {
    return {
      email: 'user@example.com',
      userId: 1,
      tryGetIfExists: false,
    };
  }

  public static getJwTokenSignMethodName(): keyof JwtService {
    return 'signAsync';
  }

  public static getRedisGetAccessTokenMethodName(): keyof RedisService {
    return 'getAccessToken';
  }

  public static getRedisSetAccessTokenMethodName(): keyof RedisService {
    return 'setAccessToken';
  }

  public static getRedisExpireAccessTokenMethodName(): keyof RedisService {
    return 'expireAccessToken';
  }

  public static getJwTokenMock(): string {
    return 'JwtTokenMock';
  }
}
