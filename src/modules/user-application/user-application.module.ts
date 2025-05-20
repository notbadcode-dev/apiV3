import { UserApplication } from '@modules/user-application/entities/user-application.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserApplicationService } from './services/user-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserApplication])],
  providers: [UserApplicationService],
  exports: [UserApplicationService],
})
export class UserApplicationModule {}
