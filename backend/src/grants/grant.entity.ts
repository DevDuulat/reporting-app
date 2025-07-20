import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('grants')
export class Grant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  report_instance_id: number;

  @Column()
  user_id: number;

  @Column()
  token_limit: number;

  @Column({ unique: true })
  access_token: string;
}
