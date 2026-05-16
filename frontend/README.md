# PiscinasApp — Frontend

Aplicación web React para la gestión de piscinas comunitarias. Desarrollada como **TFG del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**.

---

## ¿Qué es PiscinasApp?

PiscinasApp digitaliza la operativa de piscinas comunitarias. Sustituye:
- Las listas en papel de vecinos y accesos
- Los turnos de socorristas gestionados por WhatsApp
- El control de acceso sin trazabilidad

El frontend ofrece **dos paneles diferenciados**:

| Panel | Ruta | Rol | Descripción |
|---|---|---|---|
| Administrador | `/admin` | ADMIN | Gestión completa: piscinas, urbanizaciones, socorristas, turnos, incidencias y auditoría |
| Socorrista | `/socorrista` | SOCORRISTA | Interfaz mobile-first para el trabajo diario |

---

## Stack tecnológico

| Tecnología | Versión | Justificación |
|---|---|---|
| **React** | 19 | Librería de componentes más extendida del sector. Hooks permiten separar lógica de UI de forma limpia. |
| **Vite** | 8 | Bundler moderno con HMR casi instantáneo frente a Create React App o Webpack. |
| **React Router DOM** | 7 | Enrutado declarativo con rutas protegidas por rol y navegación SPA. |
| **Axios** | 1.x | Cliente HTTP con interceptores: añade el JWT automáticamente en cada petición y gestiona el 401. |
| **CSS puro** | — | Sin librerías externas de UI: máximo control del diseño, código más fácil de defender en la presentación. |

---

## Cómo arrancar

```bash
cd frontend
npm install
npm run dev
```

Disponible en **http://localhost:5173**

> El backend debe estar corriendo en `http://localhost:8080`

**Credenciales de prueba:**

| Email | Contraseña | Rol |
|---|---|---|
| `admin@piscinas.com` | `admin123` | ADMIN |
| `socorrista@piscinas.com` | `admin123` | SOCORRISTA |

---

## Estructura de carpetas

```
frontend/src/
├── api/                            ← Capa de acceso a datos (una función por endpoint)
│   ├── axiosConfig.js              ← Instancia Axios con interceptor JWT automático
│   ├── authApi.js                  ← Login
│   ├── piscinaApi.js               ← CRUD piscinas + subida de imagen
│   ├── turnoApi.js                 ← Turnos por piscina y turnos propios
│   ├── accesoApi.js                ← Entradas/salidas de vecinos e invitados
│   ├── incidenciaApi.js            ← CRUD incidencias + cambio de estado
│   ├── usuarioApi.js               ← CRUD socorristas + asignaciones piscina
│   └── estructuraApi.js            ← Calles, bloques, viviendas, personas, audit log
│
├── hooks/                          ← Custom hooks: encapsulan estado + lógica de carga
│   ├── usePiscinas.js              ← Lista de piscinas con función recargar()
│   ├── useTurnos.js                ← Turnos por piscina y rango de fechas
│   └── useAccesos.js               ← Personas dentro, contadores, invitados (carga en paralelo)
│
├── components/
│   ├── ProtectedRoute.jsx          ← Protege rutas por rol (lee JWT de localStorage)
│   ├── ui/                         ← Componentes reutilizables agnósticos del dominio
│   │   ├── Badge.jsx               ← Badge con variante semántica (success/warning/danger)
│   │   ├── Modal.jsx               ← Wrapper modal con backdrop y animación de entrada
│   │   ├── Spinner.jsx             ← Indicador de carga
│   │   ├── EmptyState.jsx          ← Estado vacío con icono y descripción
│   │   └── ConfirmDialog.jsx       ← Diálogo de confirmación genérico
│   ├── admin/                      ← Componentes del panel administrador
│   │   ├── AdminSidebar.jsx        ← Menú lateral con iconos SVG inline
│   │   ├── DashboardHeader.jsx     ← Cabecera con título, búsqueda y botones de acción
│   │   ├── AppMessage.jsx          ← Toast de notificación (éxito/error)
│   │   ├── PiscinasSection.jsx     ← Grid de tarjetas de piscinas
│   │   ├── UrbanizacionesSection.jsx
│   │   ├── SocorristasGlobalSection.jsx
│   │   ├── IncidenciasGlobalSection.jsx
│   │   ├── AuditoriaSection.jsx
│   │   ├── PerfilSection.jsx
│   │   ├── CalendarioTurnosTab.jsx ← Calendario mensual con chips de turno coloreados
│   │   ├── IncidenciasPiscinaTab.jsx ← Tab incidencias (prop puedeGestionarEstado)
│   │   ├── SocorristasPiscinaTab.jsx ← Asignación de socorristas a una piscina
│   │   ├── OperativaTab.jsx        ← Tab principal: búsqueda vecinos, entradas/salidas, invitados
│   │   ├── SelectorEstructura.jsx  ← Selector calle/bloque → vivienda → persona
│   │   ├── EditarPiscinaModal.jsx
│   │   ├── PiscinaModal.jsx
│   │   └── UrbanizacionModal.jsx
│   └── socorrista/
│       └── MiAreaSection.jsx       ← Calendario personal + métricas + histórico 6 meses
│
├── pages/
│   ├── LoginPage.jsx               ← Login con fondos animados, shake, ojo contraseña
│   ├── admin/
│   │   ├── AdminDashboard.jsx      ← Panel principal del administrador (6 secciones)
│   │   └── AdminPiscinaDetalle.jsx ← Detalle de piscina con 5 tabs
│   └── socorrista/
│       ├── SocorristaDashboard.jsx  ← Mis Piscinas + Mi Área (bottom nav)
│       └── SocorristaPiscinaDetalle.jsx ← Piscina: Operativa, Incidencias, Turno hoy
│
├── styles/
│   ├── variables.css               ← Variables CSS (colores, radios, sombras, transiciones)
│   └── global.css                  ← Estilos base globales: modales, badges, spinner, tablas
│
├── App.jsx                         ← Definición de todas las rutas con ProtectedRoute
└── main.jsx                        ← Punto de entrada, importa global.css
```

---

## Patrones utilizados

### 1. Capa API separada
Cada módulo en `api/` centraliza todas las llamadas HTTP de su dominio. Los componentes solo importan funciones con nombres descriptivos, nunca interactúan con Axios directamente.

```js
// Ejemplo: registrar entrada de un vecino
import { registrarEntrada } from "../../api/accesoApi";
await registrarEntrada({ piscinaId, viviendaId, personaId });
```

### 2. Custom Hooks
Los hooks encapsulan el estado y la lógica de carga. El componente solo consume el resultado:

```js
const { personasDentro, countDentro, entradasHoy, recargar } = useAccesos(piscina.id);
```

### 3. Rutas protegidas por rol
`ProtectedRoute` verifica que exista token en `localStorage` y que el rol coincida. Si no, redirige a `/`.

```jsx
<Route path="/admin" element={
  <ProtectedRoute requiredRole="ADMIN">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### 4. Interceptor JWT automático
`axiosConfig.js` añade `Authorization: Bearer <token>` a cada petición. Si el servidor devuelve `401`, limpia `localStorage` y redirige al login automáticamente.

### 5. Componentes UI reutilizables
`Badge`, `Modal`, `Spinner`, `EmptyState` y `ConfirmDialog` son componentes atómicos que aplican los mismos estilos y comportamiento en toda la app, eliminando duplicaciones.

### 6. Props para control de comportamiento
`IncidenciasPiscinaTab` acepta `puedeGestionarEstado` (boolean) para reutilizarse tanto en el panel del admin (puede revisar/cerrar) como en el del socorrista (solo ve y crea).

---

## Flujos principales

### Login
1. Usuario introduce email y contraseña.
2. `POST /api/auth/login` devuelve `{ token, rol, nombre, apellidos, usuarioId }`.
3. Todo se guarda en `localStorage`.
4. Se redirige a `/admin` (ADMIN) o `/socorrista` (SOCORRISTA).

### Panel Admin — Tab Operativa
La pestaña más importante del sistema:
- **Métricas**: personas dentro ahora, entradas hoy, invitados activos.
- **Buscador**: `GET /personas/buscar` → botón "Registrar entrada" → `POST /accesos/entrada`.
- **Personas dentro**: lista con botón "Salida" → `PATCH /accesos/salida`.
- **Invitados**: botón → modal con `SelectorEstructura` → `POST /registro-invitados/entrada`.

### Panel Socorrista
Mobile-first con barra de navegación inferior:
- **Mis Piscinas**: `GET /socorrista-piscina/mis-piscinas` → grid de tarjetas → detalle.
- **Mi Área**: selector de mes → 3 métricas → calendario (color por piscina) → tabla histórica 6 meses (carga con `Promise.all`).

---

## Variables de entorno

La URL base de la API se configura en `src/api/axiosConfig.js`:

```js
baseURL: "http://localhost:8080/api"
```

Para producción, modifica ese valor o introduce soporte para `import.meta.env.VITE_API_URL`.

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Compilación para producción (genera dist/)
npm run preview  # Previsualización del build de producción
npm run lint     # Análisis estático con ESLint
```

---

## Autor

Proyecto TFG — Ciclo Superior DAW
