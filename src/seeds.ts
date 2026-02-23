import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Expediente } from './entities/expediente.entity';
import { DocumentSet } from './entities/document-set.entity';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.create(AppModule);

  const expedienteRepository = app.get<Repository<Expediente>>(
    getRepositoryToken(Expediente),
  );
  const documentSetRepository = app.get<Repository<DocumentSet>>(
    getRepositoryToken(DocumentSet),
  );
  const fileRepository = app.get<Repository<File>>(getRepositoryToken(File));

  // Limpiar BD existente
  console.log('Limpiando base de datos...');
  await fileRepository.query('TRUNCATE TABLE "files" CASCADE');
  await documentSetRepository.query('TRUNCATE TABLE "document_sets" CASCADE');
  await expedienteRepository.query('TRUNCATE TABLE "expedientes" CASCADE');

  // Crear expediente de prueba
  console.log('Creando expediente de prueba...');
  const expediente = new Expediente();
  expediente.numero_expediente = 'EXP-2026-0001';
  expediente.cliente_nombre = 'Juan Pérez García';
  expediente.abogado_asignado = 'Dra. María López Rodríguez';
  expediente.estado = 'Activo';
  expediente.descripcion =
    'Caso de reclamo laboral contra la empresa ABC S.A. por despido injustificado.';
  expediente.fecha_apertura = new Date('2025-06-15');

  const savedExpediente = await expedienteRepository.save(expediente);

  // Crear conjuntos de documentos
  console.log('Creando conjuntos de documentos...');
  const docSet1 = new DocumentSet();
  docSet1.titulo = 'Demanda Inicial';
  docSet1.descripcion =
    'Demanda de despido injustificado presentada ante la corte';
  docSet1.expediente_id = savedExpediente.id;

  const savedDocSet1 = await documentSetRepository.save(docSet1);

  const docSet2 = new DocumentSet();
  docSet2.titulo = 'Pruebas Documentales';
  docSet2.descripcion =
    'Documentación de apoyo (contrato, correos, evidencias)';
  docSet2.expediente_id = savedExpediente.id;

  const savedDocSet2 = await documentSetRepository.save(docSet2);

  // Crear archivos simulados
  console.log('Creando archivos de ejemplo...');
  const file1 = new File();
  file1.nombre_original = 'demanda-inicial.pdf';
  file1.nombre_archivo = 'demanda-inicial-1739017200000.pdf';
  file1.path_archivo = './uploads/demanda-inicial-1739017200000.pdf';
  file1.mimetype = 'application/pdf';
  file1.tamanio_bytes = 245762;
  file1.document_set_id = savedDocSet1.id;

  await fileRepository.save(file1);

  const file2 = new File();
  file2.nombre_original = 'contrato-laboral.pdf';
  file2.nombre_archivo = 'contrato-laboral-1739017200001.pdf';
  file2.path_archivo = './uploads/contrato-laboral-1739017200001.pdf';
  file2.mimetype = 'application/pdf';
  file2.tamanio_bytes = 134562;
  file2.document_set_id = savedDocSet2.id;

  await fileRepository.save(file2);

  const file3 = new File();
  file3.nombre_original = 'correos-corporativos.pdf';
  file3.nombre_archivo = 'correos-corporativos-1739017200002.pdf';
  file3.path_archivo = './uploads/correos-corporativos-1739017200002.pdf';
  file3.mimetype = 'application/pdf';
  file3.tamanio_bytes = 567234;
  file3.document_set_id = savedDocSet2.id;

  await fileRepository.save(file3);

  console.log('\n✓ Seed completado exitosamente');
  console.log('\nDatos de prueba creados:');
  console.log(`- Expediente: ${savedExpediente.numero_expediente}`);
  console.log(`- Cliente: ${savedExpediente.cliente_nombre}`);
  console.log('- Conjuntos de documentos: 2');
  console.log('- Total de archivos: 3');
  console.log('\nPara acceder a los datos, visita:');
  console.log('http://localhost:4200/expediente/' + savedExpediente.id);

  await app.close();
}

seed().catch((error) => {
  console.error('Error durante seed:', error);
  process.exit(1);
});
