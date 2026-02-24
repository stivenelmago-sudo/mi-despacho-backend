import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentSet } from './document-set.entity';

@Entity('expedients')
export class Expedient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  case_number: string;

  @Column({ type: 'varchar', length: 255 })
  client_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assigned_lawyer: string;

  @Column({
    type: 'enum',
    enum: ['Active', 'Closed', 'In Review', 'Suspended'],
    default: 'Active',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  opening_date?: Date;

  @Column({ type: 'date', nullable: true })
  closing_date?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DocumentSet, (documentSet) => documentSet.expedient, {
    cascade: true,
    eager: true,
  })
  document_sets: DocumentSet[];
}
