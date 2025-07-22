import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ReportInstance } from '../report_instances/report-instance.entity';

@Entity('grants')
export class Grant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ReportInstance, { eager: false })
  @JoinColumn({ name: 'report_instance_id' })
  reportInstance: ReportInstance;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'token_limit' })
  tokenLimit: number;

  @Column({ name: 'access_token' })
  accessToken: string;
}
