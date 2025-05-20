import { COLUMN_CONSTANTS } from '@common/modules/database/constants/column.constants';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'timestamp', default: () => COLUMN_CONSTANTS.currentTimeStamp })
  public createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => COLUMN_CONSTANTS.currentTimeStamp,
    onUpdate: COLUMN_CONSTANTS.currentTimeStamp,
  })
  public modifiedAt?: Date;
}
