# PiscinasApp

Aplicación web full-stack para la gestión interna de piscinas comunitarias: control de acceso de vecinos, gestión de la estructura de urbanizaciones, organización de turnos de socorristas, registro de incidencias y trazabilidad de toda la actividad.

**Proyecto Integrado del CFGS Desarrollo de Aplicaciones Web (DAW)** — IES Sotero Hernández, curso 2025/2026.

**Aplicación desplegada:** https://dinamicapiscinas.com

---

## Stack

- **Backend:** Java 25 + Spring Boot 4 + Spring Security (JWT) + MariaDB + Flyway
- **Frontend:** React 19 + Vite + Axios + React Router

Arquitectura desacoplada: API REST + cliente SPA.

---

## Requisitos previos

- **JDK 25** (Eclipse Adoptium recomendado)
- **MariaDB 11** corriendo en `localhost:3306`
- **Node.js 22** y **npm**
- **Git**

---

## Cómo arrancar en local

### 1. Crear la base de datos

```sql
CREATE DATABASE piscinas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> Por defecto, el backend espera usuario `root` y contraseña `1234`. Si tu MariaDB tiene otra contraseña, edita `backend/src/main/resources/application.properties` y ajusta la línea `spring.datasource.password`.

### 2. Arrancar el backend

```bash
cd backend
./mvnw spring-boot:run
```

API disponible en **http://localhost:8080**.
Flyway aplica automáticamente todas las migraciones al arrancar.

### 3. Arrancar el frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicación disponible en **http://localhost:5173**.

---

## Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| `admin@piscinas.com` | `admin123` | Administrador |
| `socorrista@piscinas.com` | `admin123` | Socorrista |

---

## Documentación detallada

- **Backend:** [backend/README.md](backend/README.md) — arquitectura, endpoints, seguridad JWT, migraciones Flyway
- **Frontend:** [frontend/README.md](frontend/README.md) — estructura de componentes, patrones, flujos principales

---

## Autor

Antonio Castro Guerrero — Proyecto Integrado CFGS DAW
