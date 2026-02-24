import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Expedient } from './expedient.entity';
import { File } from './file.entity';

@Entity('document_sets')
export class DocumentSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Expedient, (expedient) => expedient.document_sets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expedient_id' })
  expedient: Expedient;

  @Column({ type: 'uuid' })
  expedient_id: string;

  @OneToMany(() => File, (file) => file.document_set, {
    cascade: true,
    eager: true,
  })
  files: File[];
}
