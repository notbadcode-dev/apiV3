import { BaseEntity } from '@common/modules/database/entities/base.entity';
import { Application } from '@modules/application/entities/application.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity('userApplications')
export class UserApplication extends BaseEntity {
  @PrimaryColumn()
  public userId!: number;

  @PrimaryColumn()
  public applicationId!: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  public user!: User;

  @ManyToOne(() => Application, (application) => application.id)
  @JoinColumn({ name: 'applicationId' })
  public application!: Application;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastAccessAt!: Date | null;
}
