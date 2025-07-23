import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('report_users')
export class ReportUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  report_id: number;

  @Column()
  user_id: number;
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
