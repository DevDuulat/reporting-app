import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity('report_instances')
export class ReportInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  report_id: number;

  @ManyToOne(() => Report, (report) => report.instances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'date' })
  day: string;

  @Column('varchar', { array: true, nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  minio_id?: string;
}
