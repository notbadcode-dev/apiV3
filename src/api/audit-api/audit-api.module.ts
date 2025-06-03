import { Module } from '@nestjs/common';

import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [],
  exports: [],
})
export class AuditApiModule {}
