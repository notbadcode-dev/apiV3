import { AccessTokenPayloadDto } from '@common/modules/database/dtos/access-token-payload.dto';
import { RedisService } from '@common/modules/redis/services/redis.service';
import { JwtService } from '@nestjs/jwt';

export class TokenServiceTestData {
  public static getValidAccessTokenPayload(): AccessTokenPayloadDto {
    return {
      email: 'user@example.com',
      userId: 1,
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

  public static getJwTokenSignMethodName(): keyof JwtService {
    return 'sign';
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
