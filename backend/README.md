# PiscinasApp — Backend

API REST para la gestión de piscinas comunitarias. Desarrollada como **TFG del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**.

---

## ¿Qué es PiscinasApp?

PiscinasApp digitaliza el control de acceso y la operativa diaria de piscinas comunitarias. Sustituye listas en papel, grupos de WhatsApp y cualquier sistema sin trazabilidad por una plataforma centralizada con:

- **Control de accesos** en tiempo real (quién entra y sale, cuándo).
- **Gestión de turnos** de socorristas con calendario mensual.
- **Incidencias** categorizadas con ciclo de vida completo.
- **Auditoría** completa de todas las acciones del sistema.

---

## Stack tecnológico

| Tecnología | Versión | Justificación |
|---|---|---|
| **Java** | 25 | Última versión LTS de OpenJDK. Soporte para Records y patrones modernos. |
| **Spring Boot** | 4.x | Framework estándar para APIs REST en Java. Autoconfiguración, inyección de dependencias, Spring Security integrado. |
| **Spring Security + JWT** | — | Autenticación stateless: sin sesiones en servidor, escalable horizontalmente. El token viaja en cada petición. |
| **MariaDB** | 10.x | Base de datos relacional open-source, compatible con MySQL. Robusta para datos relacionales complejos. |
| **Flyway** | — | Migraciones versionadas: el esquema de BD es reproducible en cualquier entorno. Historial completo de cambios. |
| **Lombok** | — | Elimina boilerplate (getters, setters, constructores, builders) mediante anotaciones, mejorando la legibilidad. |
| **Maven Wrapper** | — | Permite construir sin necesidad de Maven instalado globalmente. |

---

## Cómo arrancar

### Requisitos previos

- JDK 25 (Eclipse Adoptium recomendado)
- MariaDB corriendo en `localhost:3306`
- Base de datos `piscinas_db` creada

```sql
CREATE DATABASE piscinas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Arranque del servidor

```bash
# Windows (PowerShell)
cd backend
$env:JAVA_HOME = "C:/Program Files/Eclipse Adoptium/jdk-25.0.2.10-hotspot"
$env:PATH = "$env:JAVA_HOME/bin;$env:PATH"
./mvnw spring-boot:run

# Linux / macOS
cd backend
JAVA_HOME="/path/to/jdk25" ./mvnw spring-boot:run
```

La API queda disponible en **http://localhost:8080**

Flyway aplica automáticamente las migraciones V1–V7 al arrancar.

### Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| `admin@piscinas.com` | `admin123` | ADMIN |
| `socorrista@piscinas.com` | `admin123` | SOCORRISTA |

---

## Configuración

Las variables se definen en `src/main/resources/application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mariadb://localhost:3306/piscinas_db
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD:1234}

# JWT
app.jwt.secret=tu_secreto_jwt_de_al_menos_256_bits
app.jwt.expiration=86400000

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# Subida de imágenes de piscinas
app.upload.dir=uploads/

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```

---

## Arquitectura en capas

```
HTTP Request
     │
     ▼
 Controller  (@RestController)
     │  Valida parámetros de entrada, delega en Service, devuelve DTO
     ▼
  Service    (@Service, @Transactional)
     │  Lógica de negocio, validaciones de dominio, orquesta repositorios
     ▼
Repository  (@Repository, JpaRepository<Entity, Long>)
     │  Consultas JPA / JPQL / Query Methods
     ▼
  Entity    (@Entity, @Table)
     │  Mapeo JPA de tablas de base de datos
     ▼
 MariaDB / Flyway
```

**Separación DTO ↔ Entity:**

Los controladores nunca devuelven entidades directamente. Los `DTO` desacoplan la API del modelo interno y evitan exposición de datos sensibles. Los `Mapper` convierten entre capas.

---

## Seguridad: JWT Stateless

### Flujo de autenticación

```
Cliente                        Servidor
  │                               │
  │── POST /api/auth/login ──────►│
  │   { email, password }         │  Valida credenciales en BD
  │                               │  Genera JWT firmado con HMAC-SHA256
  │◄── 200 { token, rol, ... } ───│
  │                               │
  │── GET /api/piscinas ─────────►│
  │   Authorization: Bearer <jwt> │  JwtAuthenticationFilter valida firma
  │                               │  Extrae userId + rol sin consultar BD
  │◄── 200 [ ... ] ───────────────│
```

### Control de acceso por rol

- `@PreAuthorize("hasRole('ADMIN')")` en endpoints de administración.
- `@PreAuthorize("hasAnyRole('ADMIN','SOCORRISTA')")` en endpoints operativos.
- El endpoint `/api/auth/login` es el único público (`permitAll`).

---

## Migraciones Flyway

Ubicadas en `src/main/resources/db/migration/`:

| Versión | Descripción |
|---|---|
| **V1** | Tablas de localización: `comunidad_autonoma`, `provincia`, `municipio`. Datos iniciales de España. |
| **V2** | Tablas de estructura: `urbanizacion`, `piscina` (con campos de horario, imagen, estado). |
| **V3** | Usuarios y roles: tabla `usuario` con hash de contraseña BCrypt. Inserción de admin y socorrista de prueba. |
| **V4** | Estructura interna de piscina: `calle`, `bloque`, `vivienda`, `persona`. Relaciones con piscina. |
| **V5** | Operativa de accesos: `acceso` (entradas/salidas de vecinos), `registro_invitados`. |
| **V6** | Gestión de turnos: `turno`, `socorrista_piscina` (tabla de asignación M:N entre socorrista y piscina). |
| **V7** | `incidencia` con ciclo de vida (ABIERTA → EN_REVISION → CERRADA). `audit_log` para trazabilidad. |

---

## Endpoints de la API

Todos requieren `Authorization: Bearer <token>` **excepto** `/api/auth/login`.

### Autenticación

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login. Devuelve `{ token, rol, nombre, apellidos, usuarioId }` | Público |

### Piscinas

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/piscinas` | Listar todas | ADMIN |
| `GET` | `/api/piscinas/{id}` | Detalle de una piscina | ADMIN, SOCORRISTA |
| `POST` | `/api/piscinas` | Crear piscina | ADMIN |
| `PUT` | `/api/piscinas/{id}` | Actualizar (incluido activar/desactivar mediante `activa: bool`) | ADMIN |
| `DELETE` | `/api/piscinas/{id}` | Eliminar piscina | ADMIN |
| `POST` | `/api/piscinas/{id}/imagen` | Subir imagen (`multipart/form-data`, campo `file`) | ADMIN |

### Urbanizaciones y localización

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/urbanizaciones` | Listar urbanizaciones | ADMIN |
| `POST` | `/api/urbanizaciones` | Crear urbanización | ADMIN |
| `GET` | `/api/comunidades-autonomas` | Listado de CCAA | ADMIN |
| `GET` | `/api/provincias?comunidadId={id}` | Provincias de una CCAA | ADMIN |
| `GET` | `/api/municipios/provincia/{id}` | Municipios de una provincia | ADMIN |

### Usuarios

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/usuarios` | Listar usuarios | ADMIN |
| `POST` | `/api/usuarios` | Crear usuario | ADMIN |
| `PUT` | `/api/usuarios/{id}` | Actualizar datos | ADMIN |
| `PATCH` | `/api/usuarios/{id}/activar` | Activar cuenta | ADMIN |
| `PATCH` | `/api/usuarios/{id}/desactivar` | Desactivar cuenta | ADMIN |

### Asignaciones socorrista-piscina

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/socorrista-piscina/mis-piscinas` | Piscinas del socorrista autenticado | SOCORRISTA |
| `GET` | `/api/socorrista-piscina/piscina/{id}/socorristas` | Socorristas asignados | ADMIN |
| `POST` | `/api/socorrista-piscina/asignar` | Asignar `{ socorristaId, piscinaId }` | ADMIN |
| `PATCH` | `/api/socorrista-piscina/desactivar/{id}` | Quitar socorrista de piscina | ADMIN |

### Turnos

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/turnos/piscina/{id}?desde=&hasta=` | Turnos de una piscina en rango de fechas | ADMIN, SOCORRISTA |
| `GET` | `/api/turnos/mis-turnos?desde=&hasta=` | Turnos del socorrista autenticado | SOCORRISTA |
| `GET` | `/api/turnos/socorrista/{id}?desde=&hasta=` | Turnos de un socorrista concreto | ADMIN |
| `POST` | `/api/turnos` | Crear turno `{ piscinaId, socorristaId, fecha, horaInicio, horaFin }` | ADMIN |
| `DELETE` | `/api/turnos/{id}` | Eliminar turno | ADMIN |

### Accesos

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `POST` | `/api/accesos/entrada` | Registrar entrada `{ piscinaId, viviendaId, personaId }` | ADMIN, SOCORRISTA |
| `PATCH` | `/api/accesos/salida` | Registrar salida `{ accesoId }` | ADMIN, SOCORRISTA |
| `GET` | `/api/accesos/piscina/{id}/dentro` | Lista de personas dentro ahora | ADMIN, SOCORRISTA |
| `GET` | `/api/accesos/piscina/{id}/dentro/count` | Número de personas dentro | ADMIN, SOCORRISTA |
| `GET` | `/api/accesos/piscina/{id}/hoy/count` | Total entradas del día | ADMIN, SOCORRISTA |
| `GET` | `/api/accesos/piscina/{id}/ultimos?limit=` | Últimos N accesos | ADMIN |

### Invitados

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/registro-invitados/piscina/{id}/activos` | Grupos de invitados activos | ADMIN, SOCORRISTA |
| `POST` | `/api/registro-invitados/entrada` | Registrar entrada `{ piscinaId, viviendaId, cantidadInvitados }` | ADMIN, SOCORRISTA |
| `PATCH` | `/api/registro-invitados/salida` | Registrar salida `{ registroId }` | ADMIN, SOCORRISTA |

### Estructura de piscina

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/calles/piscina/{id}` | Calles de la piscina | ADMIN, SOCORRISTA |
| `GET` | `/api/bloques/piscina/{id}` | Bloques de la piscina | ADMIN, SOCORRISTA |
| `GET` | `/api/viviendas/calle/{id}` | Viviendas de una calle | ADMIN, SOCORRISTA |
| `GET` | `/api/viviendas/bloque/{id}` | Viviendas de un bloque | ADMIN, SOCORRISTA |
| `GET` | `/api/personas/vivienda/{id}` | Personas de una vivienda | ADMIN, SOCORRISTA |
| `GET` | `/api/personas/buscar?piscinaId=&texto=` | Búsqueda por nombre, apellidos o DNI | ADMIN, SOCORRISTA |

### Incidencias

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/incidencias` | Todas las incidencias | ADMIN |
| `GET` | `/api/incidencias/piscina/{id}` | Incidencias de una piscina | ADMIN, SOCORRISTA |
| `POST` | `/api/incidencias` | Crear `{ piscinaId, tipo, categoria, prioridad, descripcion }` | ADMIN, SOCORRISTA |
| `PATCH` | `/api/incidencias/{id}/revision` | Pasar a estado EN_REVISION | ADMIN |
| `PATCH` | `/api/incidencias/{id}/cerrar` | Cerrar con `{ notaCierre }` | ADMIN |

### Auditoría

| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| `GET` | `/api/audit-log?page=0&size=50` | Registro de auditoría paginado | ADMIN |

---

## Modelo de datos simplificado

```
comunidad_autonoma ──< provincia ──< municipio ──< urbanizacion ──< piscina
                                                                        │
                   ┌────────────────────────────────────────────────────┘
                   │
               piscina ──< calle  ──< vivienda ──< persona
                   │  └──< bloque ──< vivienda
                   │
                   ├──< turno ──────────────────────► usuario (socorrista)
                   ├──< socorrista_piscina ──────────► usuario
                   ├──< acceso ──► persona, vivienda
                   ├──< registro_invitados ──► vivienda
                   └──< incidencia
```

**Campos destacados del modelo `piscina`:**
```
id, nombre, descripcion
horaApertura (HH:mm), horaCierre (HH:mm)
horaApertura2, horaCierre2           -- turno de tarde opcional
maxInvitadosPorVivienda
rutaImagen
activa (boolean)
urbanizacionId
tipoUrbanizacion (enum: CALLES | BLOQUES)
```

**Campos destacados del modelo `acceso`:**
```
id
personaId ──► persona
viviendaId ──► vivienda
piscinaId ──► piscina
horaEntrada (LocalTime)
horaSalida  (LocalTime, null si la persona sigue dentro)
registradoPorId ──► usuario (socorrista que anotó la entrada)
```

---

## Autor

Proyecto TFG — Ciclo Superior DAW
