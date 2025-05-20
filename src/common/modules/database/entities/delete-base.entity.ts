import { COLUMN_CONSTANTS } from '@common/modules/database/constants/column.constants';
import { Column } from 'typeorm';

import { BaseEntity } from './base.entity';

export class DeleteBaseEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: true, default: null })
  public deletedAt?: Date | null;

  @Column({ default: COLUMN_CONSTANTS.isActiveDefaultValue })
  public isActive?: boolean;
}
