import { User } from '@user-application-api/modules/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LinkGroupAssignment } from './link-group-assignment.entity';
import { LinkTag } from '../../tag/entities/link-tag.entity';

@Entity('Links')
@Index(['userId', 'isFavorite'])
@Index(['domain'])
@Index(['userId'])
export class Link {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id!: number;

  @Column('text')
  public url!: string;

  @Column({ nullable: true })
  public faviconUrl?: string;

  @Column({ length: 255, nullable: true })
  public title?: string;

  @Column('text', { nullable: true })
  public description?: string;

  @Column('text', { nullable: true })
  public note?: string;

  @Column({ length: 255, nullable: true })
  public domain?: string;

  @Column({ default: true })
  public isActive!: boolean;

  @Column({ default: false })
  public isFavorite!: boolean;

  @CreateDateColumn()
  public savedAt!: Date;

  @Column({ nullable: true })
  public lastClickAt?: Date;

  @Column({ type: 'int', unsigned: true, default: 0 })
  public clickCount!: number;

  @Column({ type: 'int', unsigned: true })
  public userId!: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  public parentLinkId?: number;

  @ManyToOne(() => User)
  public user!: User;

  @ManyToOne(() => Link, { nullable: true })
  public parentLink?: Link;

  @OneToMany(() => LinkTag, (lt) => lt.link)
  public tags!: LinkTag[];

  @OneToMany(() => LinkGroupAssignment, (ga) => ga.link)
  public groupAssignments!: LinkGroupAssignment[];
}
