import { Module } from '@nestjs/common';

import { LinkModule } from './modules/link/link.module';
import { LinkGroupModule } from './modules/link-group/link-group.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [LinkModule, TagModule, LinkGroupModule],
  providers: [],
  exports: [],
})
export class LinkApiModule {}
