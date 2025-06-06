import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Tag } from './tag.entity';
import { Link } from '../../link/entities/link.entity';

@Entity('LinkTags')
@Index(['linkId', 'tagId'])
@Index(['linkId'])
@Index(['tagId'])
export class LinkTag {
  @PrimaryGeneratedColumn({ unsigned: true })
  public id!: number;

  @Column({ type: 'int', unsigned: true })
  public linkId!: number;

  @Column({ type: 'int', unsigned: true })
  public tagId!: number;

  @ManyToOne(() => Link, (link) => link.tags)
  public link!: Link;

  @ManyToOne(() => Tag, (tag) => tag.linkTags)
  public tag!: Tag;
}
