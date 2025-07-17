import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
}
