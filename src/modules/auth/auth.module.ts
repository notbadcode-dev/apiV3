import { DatabaseModule } from '@common/modules/database/database.module';
import { TokenModule } from '@common/modules/token/token.module';
import { ApplicationModule } from '@modules/application/application.module';
import { UserModule } from '@modules/user/user.module';
import { UserApplication } from '@modules/user-application/entities/user-application.entity';
import { UserApplicationModule } from '@modules/user-application/user-application.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserApplication]), UserModule, ApplicationModule, UserApplicationModule, TokenModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
