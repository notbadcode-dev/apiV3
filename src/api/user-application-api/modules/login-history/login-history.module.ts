import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginHistory } from './entities/login-history.entity';
import { LoginHistoryService } from './services/login-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory])],
  providers: [LoginHistoryService],
  controllers: [],
  exports: [LoginHistoryService],
})
export class LoginHistoryModule {}
