// src/common/modules/redis/redis.module.ts
import { APP_CONSTANTS } from '@common/constants/app.constants';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Redis from 'ioredis';

import { REDIS_CONSTANTS } from './constants/redis.constants';
import { RedisService } from './services/redis.service';
import { LoggingService } from '../logging/services/logging.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CONSTANTS.client,
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useFactory: (_configService: ConfigService): Redis => {
        const HOST = _configService.get<string>(APP_CONSTANTS.environment.redisHost);
        const PORT = _configService.get<number>(APP_CONSTANTS.environment.redisPort);

        const CLIENT = new Redis({ host: HOST, port: PORT });

        CLIENT.on(REDIS_CONSTANTS.onError, (err) => {
          LoggingService.logErrorMessage(REDIS_CONSTANTS.message.redisConnectionError(err.message));
        });

        CLIENT.on(REDIS_CONSTANTS.onConnect, () => {
          LoggingService.logInfoMessage(REDIS_CONSTANTS.message.redisConnectionSuccess());
        });

        return CLIENT;
      },
    },
    RedisService,
  ],
  exports: [REDIS_CONSTANTS.client, RedisService],
})
export class RedisModule {}
