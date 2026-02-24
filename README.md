# MiDespacho - Backend

Sistema de gestión de despachos (oficinas) construido con **NestJS 11** y **TypeScript**.

## 📋 Descripción

MiDespacho Backend es una API REST desarrollada con NestJS que proporciona funcionalidades de gestión de expedientes, documentos y organización de archivos para sistemas de despachos legales y administrativos.

**Stack Tecnológico:**
- **Framework:** NestJS 11.0.1
- **Lenguaje:** TypeScript 5.x (ES2023)
- **Runtime:** Node.js 22.10.7+
- **BD:** Configurable (PostgreSQL/MySQL a través de TypeORM)
- **Testing:** Jest
- **Linting:** ESLint + Prettier

## 🚀 Configuración Rápida

### Requisitos Previos
- Node.js 22.10.7 o superior
- npm 10.x o superior

### Instalación

```bash
npm install
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (opcional):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/mi_despacho
```

## 🏃 Comandos Principales

```bash
# Desarrollo con hot-reload
npm run start:dev

# Iniciar en modo debug (puerto 9229)
npm run start:debug

# Compilar para producción
npm run build

# Ejecutar producción
npm run start:prod
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Modo watch
npm run test:watch

# Cobertura de tests
npm run test:cov

# Tests E2E
npm run test:e2e

# Debug de tests
npm run test:debug
```

## 📝 Código y Estilo

```bash
# Linting (ESLint + auto-fix)
npm run lint

# Formateo con Prettier
npm run format
```

> **Nota:** Lint y format se ejecutan automáticamente como pre-commit hooks. Ejecuta ambos antes de hacer push.

## 🏗️ Arquitectura

### Estructura de Módulos

```
src/
├── app.controller.ts       # Controlador raíz
├── app.service.ts          # Lógica de negocio raíz
├── app.module.ts           # Módulo root - importa todos los módulos
├── main.ts                 # Bootstrap de la aplicación
├── config/                 # Configuraciones (BD, etc.)
├── entities/               # Entidades TypeORM
│   ├── expediente.entity.ts
│   ├── document-set.entity.ts
│   └── file.entity.ts
├── expediente/             # Módulo de Expedientes
│   ├── expediente.controller.ts
│   ├── expediente.service.ts
│   ├── expediente.module.ts
│   └── dto/
├── file/                   # Módulo de Archivos
│   ├── file.controller.ts
│   ├── file.service.ts
│   ├── file.module.ts
│   └── dto/
└── common/                 # Utilerías compartidas
```

### Patrones Clave

1. **Inyección de Dependencias:** Todos los servicios se inyectan en constructores
2. **DTOs (Data Transfer Objects):** Validación de entrada en `dto/` folders
3. **Controladores:** Delegación de lógica a servicios
4. **Módulos:** Agrupación de features por dominio de negocio

Ejemplo:

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

## 📡 API Endpoints Principales

- `GET /` - Health check
- `GET /expedientes` - Listar expedientes
- `GET /expedientes/:id` - Obtener expediente
- `POST /expedientes` - Crear expediente
- `POST /files/upload` - Subir archivo
- `GET /files/:id` - Descargar archivo

## 🗄️ Base de Datos

La configuración de BD se define en `src/config/database.config.ts`. Por defecto usa TypeORM con soporte para PostgreSQL/MySQL.

### Entidades Principales
- **Expediente:** Caso/expediente legal
- **DocumentSet:** Conjunto de documentos
- **File:** Archivos subidos

> Para más detalles sobre schema, ver `src/entities/`

## 🐳 Docker & Compose

El proyecto incluye `docker-compose.yml` para levantar dependencias (BD, etc.):

```bash
docker-compose up -d
```

## 📖 Documentación Adicional

- Desarrollo detallado: [`README-DEV.md`](README-DEV.md)
- [NestJS Docs](https://docs.nestjs.com)

## 📄 Licencia

MIT

---

**Última actualización:** Febrero 2026
