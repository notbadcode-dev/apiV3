import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LoginHistory')
export class LoginHistory {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  public id?: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  public userId!: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  public applicationId!: number;

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  public loginAt!: Date;

  @Column({ type: 'boolean', default: true })
  public success?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  public failureReason?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  public ipAddress?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public userAgent?: string;
}
