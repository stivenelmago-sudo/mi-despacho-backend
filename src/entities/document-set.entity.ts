import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Expediente } from './expediente.entity';
import { File } from './file.entity';

@Entity('document_sets')
export class DocumentSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Expediente, (expediente) => expediente.document_sets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expediente_id' })
  expediente: Expediente;

  @Column({ type: 'uuid' })
  expediente_id: string;

  @OneToMany(() => File, (file) => file.document_set, {
    cascade: true,
    eager: true,
  })
  files: File[];
}
