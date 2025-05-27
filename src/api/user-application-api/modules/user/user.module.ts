import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@user-application-api/modules/user/services/user/user.service';
import { UsersController } from '@user-application-api/modules/user/user.controller';

import { LoginHistory } from './entities/login-history.entity';
import { User } from './entities/user.entity';
import { LoginHistoryService } from './services/login-history/login-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LoginHistory])],
  providers: [UserService, LoginHistoryService],
  controllers: [UsersController],
  exports: [UserService, LoginHistoryService],
})
export class UserModule {}
