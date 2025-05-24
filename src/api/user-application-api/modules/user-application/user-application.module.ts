import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserApplication } from './entities/user-application.entity';
import { UserApplicationService } from './services/user-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserApplication])],
  providers: [UserApplicationService],
  exports: [UserApplicationService],
})
export class UserApplicationModule {}
