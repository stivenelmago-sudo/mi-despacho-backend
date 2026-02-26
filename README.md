# MiDespacho - Backend

Case law management system (law offices) built with **NestJS 11** and **TypeScript**.

## 📋 Description

MiDespacho Backend is a REST API developed with NestJS that provides case files, documents and file organization management features for legal and administrative law office systems.

**Tech Stack:**
- **Framework:** NestJS 11.0.1
- **Language:** TypeScript 5.x (ES2023)
- **Runtime:** Node.js 22.10.7+
- **Database:** Configurable (PostgreSQL/MySQL via TypeORM)
- **Testing:** Jest
- **Linting:** ESLint + Prettier

## 🚀 Quick Setup

### Prerequisites
- Node.js 22.10.7 or higher
- npm 10.x or higher

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root (optional):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/mi_despacho
```

## 🏃 Main Commands

```bash
# Development with hot-reload
npm run start:dev

# Start in debug mode (port 9229)
npm run start:debug

# Compile for production
npm run build

# Run production
npm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Debug tests
npm run test:debug
```

## 📝 Code and Style

```bash
# Linting (ESLint + auto-fix)
npm run lint

# Formatting with Prettier
npm run format
```

> **Note:** Lint and format run automatically as pre-commit hooks. Run both before pushing.

## 🏗️ Architecture

### Module Structure

```
src/
├── app.controller.ts       # Root controller
├── app.service.ts          # Root business logic
├── app.module.ts           # Root module - imports all modules
├── main.ts                 # Application bootstrap
├── config/                 # Configurations (Database, etc.)
├── entities/               # TypeORM entities
│   ├── expediente.entity.ts
│   ├── document-set.entity.ts
│   └── file.entity.ts
├── expediente/             # Case files module
│   ├── expediente.controller.ts
│   ├── expediente.service.ts
│   ├── expediente.module.ts
│   └── dto/
├── file/                   # Files module
│   ├── file.controller.ts
│   ├── file.service.ts
│   ├── file.module.ts
│   └── dto/
└── common/                 # Shared utilities
```

### Key Patterns

1. **Dependency Injection:** All services are injected in constructors
2. **DTOs (Data Transfer Objects):** Input validation in `dto/` folders
3. **Controllers:** Delegate logic to services
4. **Modules:** Group features by business domain

Example:

```typescript
@Controller('expedientes')
export class ExpedienteController {
  constructor(private readonly expedienteService: ExpedienteService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expedienteService.findOne(id);
  }
}
```

## 📡 Main API Endpoints

- `GET /` - Health check
- `GET /expedientes` - List case files
- `GET /expedientes/:id` - Get case file
- `POST /expedientes` - Create case file
- `POST /files/upload` - Upload file
- `GET /files/:id` - Download file

## 🗄️ Database

Database configuration is defined in `src/config/database.config.ts`. By default uses TypeORM with PostgreSQL/MySQL support.

### Main Entities
- **Expediente:** Legal case/file
- **DocumentSet:** Set of documents
- **File:** Uploaded files

> For more details on schema, see `src/entities/`

## 🐳 Docker & Compose

The project includes `docker-compose.yml` to start dependencies (Database, etc.):

```bash
docker-compose up -d
```

## 📖 Additional Documentation

- Detailed development: [`README-DEV.md`](README-DEV.md)
- [NestJS Docs](https://docs.nestjs.com)

## 📄 License

MIT

---

**Last updated:** February 2026
