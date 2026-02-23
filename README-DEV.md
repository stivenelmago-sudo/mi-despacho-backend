# MiDespacho Backend

Backend NestJS + TypeORM + PostgreSQL para la gestión de expedientes jurídicos.

## Requisitos previos

- Node.js 22.10.7+
- npm 10.9.3+
- Docker y Docker Compose (para base de datos)

## Instalación

```bash
# Instalar dependencias
npm install
```

## Configuración

### Base de datos

La aplicación usa PostgreSQL. Para iniciar la BD con Docker Compose:

```bash
# Iniciar contenedores PostgreSQL y pgAdmin
docker-compose up -d

# Verificar que PostgreSQL está corriendo
docker ps
```

La BD se configura automáticamente con las credenciales en `.env.local`:

- **Host**: localhost
- **Puerto**: 5432
- **Usuario**: midespacho_user
- **Contraseña**: midespacho_pass_2026
- **Base de datos**: midespacho_db

Para acceder a pgAdmin:

- URL: http://localhost:5050
- Email: admin@midespacho.local
- Contraseña: admin

### Cargar datos iniciales

Una vez que la BD está corriendo, cargar datos de prueba:

```bash
npm run seed
```

Esto creará:

- Un expediente de prueba (EXP-2026-0001)
- Dos conjuntos de documentos
- Tres archivos de ejemplo

## Desarrollo

```bash
# Iniciar servidor en modo watch (puerto 3000)
npm run start:dev

# En otra terminal, ejecutar seed para datos iniciales
npm run seed
```

El servidor estará disponible en: http://localhost:3000

### Endpoints principales

- `GET /expediente` - Listar expedientes
- `GET /expediente/:id` - Obtener expediente con documentos
- `POST /expediente` - Crear expediente
- `PUT /expediente/:id` - Actualizar expediente
- `DELETE /expediente/:id` - Eliminar expediente
- `POST /file/upload/:expedienteId` - Cargar documentos (multipart/form-data)
- `GET /file/document-set/:documentSetId` - Obtener conjunto de documentos
- `DELETE /file/:fileId` - Eliminar archivo
- `DELETE /file/document-set/:documentSetId` - Eliminar conjunto de documentos

## Testing

```bash
# Ejecutar tests unitarios
npm run test

# Modo watch
npm run test:watch

# Cobertura
npm run test:cov

# Tests E2E
npm run test:e2e
```

## Linting y formato

```bash
# Lint con ESLint (auto-fix)
npm run lint

# Formato con Prettier
npm run format
```

## Build para producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar la aplicación compilada
npm run start:prod
```

## Estructura del proyecto

```
src/
├── config/
│   └── database.config.ts      # Configuración TypeORM
├── entities/
│   ├── expediente.entity.ts    # Entidad: Caso jurídico
│   ├── document-set.entity.ts  # Entidad: Conjunto de documentos
│   └── file.entity.ts          # Entidad: Archivo individual
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
├── app.module.ts               # Módulo raíz
├── app.controller.ts           # Controlador demo
├── app.service.ts              # Servicio demo
├── main.ts                     # Bootstrap
└── seeds.ts                    # Script de datos iniciales
```

## Notas importantes

- Los archivos cargados se guardan en `/uploads` (ignorado en git)
- La BD se sincroniza automáticamente en desarrollo (TypeORM synchronize: true)
- CORS habilitado para desarrollo local
- ValidationPipe activo para validación de DTOs
