import { User } from '@user-application-api/modules/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { LinkTag } from './link-tag.entity';
import { Group } from '../../link-group/entities/group.entity';

@Entity('Tags')
@Unique(['name', 'userId'])
@Index(['userId', 'name'])
@Index(['userId'])
export class Tag {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id!: number;

  @Column({ length: 100 })
  public name!: string;

  @Column({ length: 10, nullable: true })
  public emoji?: string;

  @Column({ type: 'int', unsigned: true })
  public colorRgb!: number;

  @Column({ type: 'int', unsigned: true })
  public userId!: number;

  @ManyToOne(() => User)
  public user!: User;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @OneToMany(() => LinkTag, (lt) => lt.tag)
  public linkTags!: LinkTag[];

  @OneToMany(() => Group, (g) => g.autoTag)
  public autoGroups!: Group[];
}
