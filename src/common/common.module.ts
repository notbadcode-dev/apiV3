import { DatabaseModule } from '@common/modules/database/database.module';
import { LoggingModule } from '@common/modules/logging/logging.module';
import { RedisModule } from '@common/modules/redis/redis.module';
import { Module } from '@nestjs/common';

import { ConfigurationModule } from './modules/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, LoggingModule, RedisModule, DatabaseModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
