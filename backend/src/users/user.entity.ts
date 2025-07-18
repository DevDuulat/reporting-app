import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  role: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Report, (report) => report.users)
  reports: Report[];
}
