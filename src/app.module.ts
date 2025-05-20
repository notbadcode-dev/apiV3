/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@common/common.module';
import { ApplicationModule } from '@modules/application/application.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CommonModule, AuthModule, UserModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
