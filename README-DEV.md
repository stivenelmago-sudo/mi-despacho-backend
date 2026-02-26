# MiDespacho Backend

NestJS + TypeORM + PostgreSQL backend for legal case file management.

## Prerequisites

- Node.js 22.10.7+
- npm 10.9.3+
- Docker and Docker Compose (for database)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

### Database

The application uses PostgreSQL. To start the database with Docker Compose:

```bash
# Start PostgreSQL and pgAdmin containers
docker-compose up -d

# Verify that PostgreSQL is running
docker ps
```

The database is automatically configured with credentials in `.env.local`:

- **Host**: localhost
- **Port**: 5432
- **User**: midespacho_user
- **Password**: midespacho_pass_2026
- **Database**: midespacho_db

To access pgAdmin:

- URL: http://localhost:5050
- Email: admin@midespacho.local
- Password: admin

### Load initial data

Once the database is running, load test data:

```bash
npm run seed
```

This will create:

- One test case file (EXP-2026-0001)
- Two document sets
- Three example files

## Development

```bash
# Start server in watch mode (port 3000)
npm run start:dev

# In another terminal, run seed for initial data
npm run seed
```

The server will be available at: http://localhost:3000

### Main endpoints

- `GET /expediente` - List case files
- `GET /expediente/:id` - Get case file with documents
- `POST /expediente` - Create case file
- `PUT /expediente/:id` - Update case file
- `DELETE /expediente/:id` - Delete case file
- `POST /file/upload/:expedienteId` - Upload documents (multipart/form-data)
- `GET /file/document-set/:documentSetId` - Get document set
- `DELETE /file/:fileId` - Delete file
- `DELETE /file/document-set/:documentSetId` - Delete document set

## Testing

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Linting and formatting

```bash
# Lint with ESLint (auto-fix)
npm run lint

# Format with Prettier
npm run format
```

## Production build

```bash
# Compile TypeScript
npm run build

# Run the compiled application
npm run start:prod
```

## Project structure

```
src/
├── config/
│   └── database.config.ts      # TypeORM configuration
├── entities/
│   ├── expediente.entity.ts    # Entity: Legal case
│   ├── document-set.entity.ts  # Entity: Document set
│   └── file.entity.ts          # Entity: Individual file
├── expediente/
│   ├── expediente.controller.ts
│   ├── expediente.service.ts
│   └── expediente.module.ts
├── file/
│   ├── dto/
│   │   └── document-set.dto.ts
│   ├── file.controller.ts
│   ├── file.service.ts
│   └── file.module.ts
├── app.module.ts               # Root module
├── app.controller.ts           # Demo controller
├── app.service.ts              # Demo service
├── main.ts                     # Bootstrap
└── seeds.ts                    # Initial data script
```

## Important notes

- Uploaded files are saved in `/uploads` (ignored in git)
- Database syncs automatically in development (TypeORM synchronize: true)
- CORS enabled for local development
- ValidationPipe active for DTO validation
