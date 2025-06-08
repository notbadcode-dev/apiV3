import { ConfigurationModule } from '@common/modules/configuration/configuration.module';
import { DatabaseModule } from '@common/modules/database/database.module';
import { LoggingModule } from '@common/modules/logging/logging.module';
import { RedisModule } from '@common/modules/redis/redis.module';
import { TranslateModule } from '@common/modules/translate/traslate.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigurationModule, LoggingModule, RedisModule, DatabaseModule, TranslateModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
