import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  folder: string;

  @Column({ type: 'date' })
  day: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({ nullable: true })
  minio_id: string;
}
