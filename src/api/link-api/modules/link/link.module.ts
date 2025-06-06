import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinkGroupAssignment } from './entities/link-group-assignment.entity';
import { Link } from './entities/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkGroupAssignment])],
  providers: [],
  controllers: [],
  exports: [],
})
export class LinkModule {}
