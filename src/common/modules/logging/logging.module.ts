import { Module } from '@nestjs/common';

import { LoggingService } from './services/logging.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
