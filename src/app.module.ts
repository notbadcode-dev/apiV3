/* eslint-disable @typescript-eslint/naming-convention */
import { AuthApiModule } from '@auth-api/auth-api.module';
import { CommonModule } from '@common/common.module';
import { LinkApiModule } from '@link-api/link-api.module';
import { Module } from '@nestjs/common';
import { UserApplicationApiModule } from '@user-application-api/user-application-api.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CommonModule, AuthApiModule, UserApplicationApiModule, LinkApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
