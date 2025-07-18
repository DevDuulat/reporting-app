import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../users/user.entity';
import { ReportInstance } from '../report_instances/report-instance.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  folder: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notif_rules: string;

  @OneToMany(() => ReportInstance, (instance) => instance.report)
  instances: ReportInstance[];

  @ManyToMany(() => User, (user) => user.reports)
  @JoinTable({
    name: 'report_users',
    joinColumn: { name: 'report_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
