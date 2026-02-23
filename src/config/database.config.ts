import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Expediente } from '../entities/expediente.entity';
import { DocumentSet } from '../entities/document-set.entity';
import { File } from '../entities/file.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'midespacho_user',
    password: process.env.DB_PASSWORD || 'midespacho_pass_2026',
    database: process.env.DB_NAME || 'midespacho_db',
    entities: [Expediente, DocumentSet, File],
    synchronize: process.env.NODE_ENV === 'development', // Auto-sync en dev, desactivar en prod
    logging: process.env.NODE_ENV === 'development',
    dropSchema: false,
  };
};
