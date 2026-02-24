import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { DocumentSet } from './document-set.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  original_name: string;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 255 })
  file_path: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimetype: string;

  @Column({ type: 'bigint' })
  size_bytes: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => DocumentSet, (documentSet) => documentSet.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_set_id' })
  document_set: DocumentSet;

  @Column({ type: 'uuid' })
  document_set_id: string;
}
