import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Expedient } from './entities/expedient.entity';
import { DocumentSet } from './entities/document-set.entity';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.create(AppModule);

  const expedientRepository = app.get<Repository<Expedient>>(
    getRepositoryToken(Expedient),
  );
  const documentSetRepository = app.get<Repository<DocumentSet>>(
    getRepositoryToken(DocumentSet),
  );
  const fileRepository = app.get<Repository<File>>(getRepositoryToken(File));

  // Clear existing database
  console.log('Clearing database...');
  await fileRepository.query('TRUNCATE TABLE "files" CASCADE');
  await documentSetRepository.query('TRUNCATE TABLE "document_sets" CASCADE');
  await expedientRepository.query('TRUNCATE TABLE "expedients" CASCADE');

  // Create test expedient
  console.log('Creating test expedient...');
  const expedient = new Expedient();
  expedient.case_number = 'EXP-2026-0001';
  expedient.client_name = 'John Smith';
  expedient.assigned_lawyer = 'Dr. Sarah Johnson';
  expedient.status = 'Active';
  expedient.description =
    'Labor dispute claim against ABC Inc. for wrongful termination.';
  expedient.opening_date = new Date('2025-06-15');

  const savedExpedient = await expedientRepository.save(expedient);

  // Create document sets
  console.log('Creating document sets...');
  const docSet1 = new DocumentSet();
  docSet1.title = 'Initial Complaint';
  docSet1.description =
    'Wrongful termination complaint filed with the court';
  docSet1.expedient_id = savedExpedient.id;

  const savedDocSet1 = await documentSetRepository.save(docSet1);

  const docSet2 = new DocumentSet();
  docSet2.title = 'Supporting Documents';
  docSet2.description =
    'Supporting documentation (contract, emails, evidence)';
  docSet2.expedient_id = savedExpedient.id;

  const savedDocSet2 = await documentSetRepository.save(docSet2);

  // Create sample files
  console.log('Creating sample files...');
  const file1 = new File();
  file1.original_name = 'complaint.pdf';
  file1.file_name = 'complaint-1739017200000.pdf';
  file1.file_path = './uploads/complaint-1739017200000.pdf';
  file1.mimetype = 'application/pdf';
  file1.size_bytes = 245762;
  file1.document_set_id = savedDocSet1.id;

  await fileRepository.save(file1);

  const file2 = new File();
  file2.original_name = 'employment-contract.pdf';
  file2.file_name = 'contract-1739017200001.pdf';
  file2.file_path = './uploads/contract-1739017200001.pdf';
  file2.mimetype = 'application/pdf';
  file2.size_bytes = 134562;
  file2.document_set_id = savedDocSet2.id;

  await fileRepository.save(file2);

  const file3 = new File();
  file3.original_name = 'company-emails.pdf';
  file3.file_name = 'emails-1739017200002.pdf';
  file3.file_path = './uploads/emails-1739017200002.pdf';
  file3.mimetype = 'application/pdf';
  file3.size_bytes = 567234;
  file3.document_set_id = savedDocSet2.id;

  await fileRepository.save(file3);

  console.log('\n✓ Seed completed successfully');
  console.log('\nTest data created:');
  console.log(`- Case: ${savedExpedient.case_number}`);
  console.log(`- Client: ${savedExpedient.client_name}`);
  console.log('- Document sets: 2');
  console.log('- Total files: 3');
  console.log('\nAccess the data at:');
  console.log('http://localhost:4200/expedient/' + savedExpedient.id);

  await app.close();
}

seed().catch((error) => {
  console.error('Error during seed:', error);
  process.exit(1);
});
