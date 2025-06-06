import { User } from '@user-application-api/modules/user/entities/user.entity';
import { Check, Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { LinkGroupAssignment } from '../../link/entities/link-group-assignment.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity('Groups')
@Index(['userId', 'name'])
@Index(['userId'])
@Index(['depth'])
@Check(`(isAuto = TRUE AND parentGroupId IS NULL AND autoTagId IS NOT NULL) OR (isAuto = FALSE AND autoTagId IS NULL)`)
export class Group {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id!: number;

  @Column({ length: 10, nullable: true })
  public emoji?: string;

  @Column({ length: 100 })
  public name!: string;

  @Column('text', { nullable: true })
  public description?: string;

  @Column({ type: 'int', unsigned: true })
  public colorRgb!: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public parentGroupId?: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  public depth!: number;

  @Column({ default: false })
  public isAuto!: boolean;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public autoTagId?: number;

  @Column({ type: 'int', unsigned: true })
  public userId!: number;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @ManyToOne(() => Group, { nullable: true })
  public parentGroup?: Group;

  @ManyToOne(() => Tag, { nullable: true })
  public autoTag?: Tag;

  @ManyToOne(() => User)
  public user!: User;

  @OneToMany(() => Group, (group) => group.parentGroup)
  public subGroups!: Group[];

  @OneToMany(() => LinkGroupAssignment, (ga) => ga.group)
  public linkAssignments!: LinkGroupAssignment[];
}
