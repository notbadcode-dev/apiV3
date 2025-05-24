import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../../../common/modules/database/entities/base.entity';
import { APPLICATION_CONSTANTS } from '../constants/application.constants';

@Entity('applications')
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: APPLICATION_CONSTANTS.validators.maxLengthName })
  public name!: string;

  @Column({ type: 'varchar', length: APPLICATION_CONSTANTS.validators.maxLengthDescription, nullable: true })
  public description?: string;
}
