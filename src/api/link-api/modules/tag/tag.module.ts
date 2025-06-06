import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinkTag } from './entities/link-tag.entity';
import { Tag } from './entities/tag.entity';
import { TagService } from './services/tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, LinkTag])],
  providers: [TagService],
  controllers: [TagController],
  exports: [],
})
export class TagModule {}
