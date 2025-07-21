import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';

@Entity('views')
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  report_id: number;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Report, (report) => report.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;
}
