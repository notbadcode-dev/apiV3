import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from './link.entity';
import { Group } from '../../link-group/entities/group.entity';

@Entity('LinkGroupAssignments')
@Index(['linkId', 'groupId'])
@Index(['linkId'])
@Index(['groupId'])
export class LinkGroupAssignment {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id!: number;

  @Column({ type: 'int', unsigned: true })
  public linkId!: number;

  @Column({ type: 'int', unsigned: true })
  public groupId!: number;

  @Column({ type: 'int', nullable: true })
  public groupOrder?: number;

  @ManyToOne(() => Link, (link) => link.groupAssignments)
  public link!: Link;

  @ManyToOne(() => Group, (group) => group.linkAssignments)
  public group!: Group;
}
