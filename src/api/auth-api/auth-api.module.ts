import { AuthModule } from '@auth-api/modules/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule],
  providers: [],
  exports: [],
})
export class AuthApiModule {}
