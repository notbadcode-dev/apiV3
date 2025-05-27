import { Module } from '@nestjs/common';

import { ApplicationModule } from './modules/application/application.module';
import { LoginHistoryModule } from './modules/login-history/login-history.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [LoginHistoryModule, UserModule, ApplicationModule],
  providers: [],
  exports: [],
})
export class UserApplicationApiModule {}
