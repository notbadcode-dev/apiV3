import { DeleteBaseEntity } from '@common/modules/database/entities/delete-base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { USER_CONSTANTS } from '../constants/user.constants';

@Entity('users')
export class User extends DeleteBaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: USER_CONSTANTS.validators.maxLengthEmail, unique: true })
  public email!: string;

  @Column({ type: 'varchar', length: USER_CONSTANTS.validators.maxLengthPasswordHash })
  public passwordHash!: string;
}
