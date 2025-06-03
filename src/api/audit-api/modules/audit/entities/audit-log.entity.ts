import { COLUMN_CONSTANTS } from '@common/modules/database/constants/column.constants';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { EAuditActionType } from '../enums/audit-action-type.enum';

@Entity('AuditLogs')
export class AuditLog {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id!: number;

  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  public entityId?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public entityReference?: string;

  @Column({ type: 'varchar', length: 100 })
  public entityTableName!: string;

  @Column({ type: 'enum', enum: EAuditActionType })
  public actionType!: EAuditActionType;

  @Column({ type: 'varchar', length: 250, nullable: true })
  public actionDetail?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => COLUMN_CONSTANTS.currentTimeStamp })
  public createdAt!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public userCode?: string;
}
