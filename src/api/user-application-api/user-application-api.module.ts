import { Module } from '@nestjs/common';

import { ApplicationModule } from './modules/application/application.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, ApplicationModule],
  providers: [],
  exports: [],
})
export class UserApplicationApiModule {}
