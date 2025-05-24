import { DatabaseModule } from '@common/modules/database/database.module';
import { TokenModule } from '@common/modules/token/token.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '@user-application-api/modules/application/application.module';
import { UserModule } from '@user-application-api/modules/user/user.module';
import { UserApplication } from '@user-application-api/modules/user-application/entities/user-application.entity';
import { UserApplicationModule } from '@user-application-api/modules/user-application/user-application.module';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserApplication]), UserModule, ApplicationModule, UserApplicationModule, TokenModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
