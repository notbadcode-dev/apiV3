import { LogMethod } from '@common/decorators/logged-method.decorator';
import { Inject, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Redis from 'ioredis';

import { IRedisService } from './redis.service.interface';
import { REDIS_CONSTANTS } from '../constants/redis.constants';
import { SetRedisValueDto } from '../dto/set-redis-value.dto';

@Injectable()
export class RedisService implements IRedisService {
  //#region constructor and attributes

  constructor(@Inject(REDIS_CONSTANTS.client) private readonly _redis: Redis) {}

  //#endregion

  //#region Public methods

  @LogMethod
  public async setAccessToken(userId: number, value: string | number | Buffer<ArrayBufferLike>): Promise<void> {
    const SET_REDIS_VALUE_DTO: SetRedisValueDto = {
      key: REDIS_CONSTANTS.keys.accessToken.key(userId),
      value,
      expirationInSeconds: REDIS_CONSTANTS.keys.accessToken.expirationIn,
    };

    await this.setByKey(SET_REDIS_VALUE_DTO);
  }

  @LogMethod
  public async getAccessToken(userId: number): Promise<string | null> {
    return await this.getByKey(REDIS_CONSTANTS.keys.accessToken.key(userId));
  }

  @LogMethod
  public async expireAccessToken(userId: number): Promise<boolean> {
    const IS_SUCCESSFULLY_EXPIRED = await this._redis.expire(REDIS_CONSTANTS.keys.accessToken.key(userId), REDIS_CONSTANTS.defaultExpiredInSeconds);
    return IS_SUCCESSFULLY_EXPIRED > 0;
  }

  //#endregion

  //#region Private methods

  @LogMethod
  private async setByKey(setRedisValueDto: SetRedisValueDto): Promise<void> {
    await this._redis.set(setRedisValueDto.key, setRedisValueDto.value, REDIS_CONSTANTS.expirationMeasurementWithSeconds, setRedisValueDto.expirationInSeconds);
  }

  @LogMethod
  private async getByKey(key: string): Promise<string | null> {
    return await this._redis.get(key);
  }

  //#endregion
}
