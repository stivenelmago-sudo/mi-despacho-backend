import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentSet } from './document-set.entity';

@Entity('expedientes')
export class Expediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  numero_expediente: string;

  @Column({ type: 'varchar', length: 255 })
  cliente_nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  abogado_asignado: string;

  @Column({
    type: 'enum',
    enum: ['Activo', 'Cerrado', 'En Revisión', 'Suspendido'],
    default: 'Activo',
  })
  estado: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', nullable: true })
  fecha_apertura?: Date;

  @Column({ type: 'date', nullable: true })
  fecha_cierre?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DocumentSet, (documentSet) => documentSet.expediente, {
    cascade: true,
    eager: true,
  })
  document_sets: DocumentSet[];
}
