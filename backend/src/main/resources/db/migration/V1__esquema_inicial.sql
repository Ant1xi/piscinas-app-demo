/* =========================================================
   V1 - Esquema inicial
   Proyecto: Control de acceso a piscinas
   Motor: InnoDB (MariaDB/MySQL)
   ========================================================= */

-- =========================================================
-- 1) Catálogos geográficos
-- =========================================================

CREATE TABLE provincia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE municipio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provincia_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT fk_municipio_provincia
        FOREIGN KEY (provincia_id) REFERENCES provincia(id),
    CONSTRAINT uq_municipio_provincia_nombre
        UNIQUE (provincia_id, nombre)
) ENGINE=InnoDB;

-- =========================================================
-- 2) Urbanización / Comunidad
-- =========================================================

CREATE TABLE urbanizacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    municipio_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NULL,
    google_maps_url VARCHAR(500) NULL,
    tipo_urbanizacion ENUM('CALLES', 'BLOQUES') NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_urbanizacion_municipio
        FOREIGN KEY (municipio_id) REFERENCES municipio(id),
    INDEX idx_urbanizacion_municipio (municipio_id),
    INDEX idx_urbanizacion_nombre (nombre)
) ENGINE=InnoDB;

-- =========================================================
-- 3) Piscina
-- =========================================================

CREATE TABLE piscina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    urbanizacion_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    hora_apertura TIME NULL,
    hora_cierre TIME NULL,
    ruta_imagen VARCHAR(255) NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_piscina_urbanizacion
        FOREIGN KEY (urbanizacion_id) REFERENCES urbanizacion(id) ON DELETE CASCADE,
    INDEX idx_piscina_urbanizacion (urbanizacion_id),
    INDEX idx_piscina_nombre (nombre)
) ENGINE=InnoDB;

-- =========================================================
-- 4) Estructura interna: Calles / Bloques
-- =========================================================

CREATE TABLE calle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    urbanizacion_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    CONSTRAINT fk_calle_urbanizacion
        FOREIGN KEY (urbanizacion_id) REFERENCES urbanizacion(id) ON DELETE CASCADE,
    CONSTRAINT uq_calle_urbanizacion_nombre
        UNIQUE (urbanizacion_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE bloque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    urbanizacion_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    CONSTRAINT fk_bloque_urbanizacion
        FOREIGN KEY (urbanizacion_id) REFERENCES urbanizacion(id) ON DELETE CASCADE,
    CONSTRAINT uq_bloque_urbanizacion_codigo
        UNIQUE (urbanizacion_id, codigo)
) ENGINE=InnoDB;

-- =========================================================
-- 5) Vivienda
-- =========================================================

CREATE TABLE vivienda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    urbanizacion_id INT NOT NULL,
    calle_id INT NULL,
    bloque_id INT NULL,
    identificador VARCHAR(50) NOT NULL,
    planta VARCHAR(10) NULL,
    observaciones TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vivienda_urbanizacion
        FOREIGN KEY (urbanizacion_id) REFERENCES urbanizacion(id) ON DELETE CASCADE,
    CONSTRAINT fk_vivienda_calle
        FOREIGN KEY (calle_id) REFERENCES calle(id) ON DELETE CASCADE,
    CONSTRAINT fk_vivienda_bloque
        FOREIGN KEY (bloque_id) REFERENCES bloque(id) ON DELETE CASCADE,
    CONSTRAINT uq_vivienda_calle_identificador
        UNIQUE (calle_id, identificador),
    CONSTRAINT uq_vivienda_bloque_planta_identificador
        UNIQUE (bloque_id, planta, identificador),
    INDEX idx_vivienda_urbanizacion (urbanizacion_id),
    INDEX idx_vivienda_calle (calle_id),
    INDEX idx_vivienda_bloque (bloque_id)
) ENGINE=InnoDB;

-- =========================================================
-- 6) Persona
-- =========================================================

CREATE TABLE persona (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    dni VARCHAR(20) NULL,
    telefono VARCHAR(30) NULL,
    email VARCHAR(120) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_persona_dni UNIQUE (dni),
    INDEX idx_persona_apellidos (apellidos),
    INDEX idx_persona_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE vivienda_persona (
    id INT PRIMARY KEY AUTO_INCREMENT,
    persona_id INT NOT NULL,
    vivienda_id INT NOT NULL,
    rol_en_vivienda ENUM('PROPIETARIO', 'HABITANTE') NOT NULL,
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_alta DATE NULL,
    fecha_baja DATE NULL,
    CONSTRAINT fk_vp_persona
        FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE,
    CONSTRAINT fk_vp_vivienda
        FOREIGN KEY (vivienda_id) REFERENCES vivienda(id) ON DELETE CASCADE,
    CONSTRAINT uq_vp_persona_vivienda_rol
        UNIQUE (persona_id, vivienda_id, rol_en_vivienda),
    INDEX idx_vp_vivienda (vivienda_id),
    INDEX idx_vp_persona (persona_id)
) ENGINE=InnoDB;

-- =========================================================
-- 7) Usuarios, roles, turnos, accesos, incidencias, estado diario
-- =========================================================

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE usuario_rol (
    usuario_id INT NOT NULL,
    rol ENUM('ADMIN', 'SOCORRISTA') NOT NULL,
    PRIMARY KEY (usuario_id, rol),
    CONSTRAINT fk_usuario_rol_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE turno_piscina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    piscina_id INT NOT NULL,
    socorrista_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NULL,
    hora_fin TIME NULL,
    estado ENUM('PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'AUSENTE') NULL DEFAULT 'PROGRAMADO',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_turno_piscina_piscina
        FOREIGN KEY (piscina_id) REFERENCES piscina(id) ON DELETE CASCADE,
    CONSTRAINT fk_turno_piscina_socorrista
        FOREIGN KEY (socorrista_id) REFERENCES usuario(id) ON DELETE RESTRICT,
    CONSTRAINT uq_turno_piscina
        UNIQUE (piscina_id, fecha, hora_inicio, hora_fin, socorrista_id),
    INDEX idx_turno_piscina_fecha (piscina_id, fecha),
    INDEX idx_turno_socorrista_fecha (socorrista_id, fecha)
) ENGINE=InnoDB;

CREATE TABLE acceso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    piscina_id INT NOT NULL,
    vivienda_id INT NOT NULL,
    persona_id INT NOT NULL,
    hora_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hora_salida DATETIME NULL,
    registrado_por INT NOT NULL,
    comentario TEXT NULL,
    CONSTRAINT fk_acceso_piscina
        FOREIGN KEY (piscina_id) REFERENCES piscina(id) ON DELETE CASCADE,
    CONSTRAINT fk_acceso_vivienda
        FOREIGN KEY (vivienda_id) REFERENCES vivienda(id) ON DELETE RESTRICT,
    CONSTRAINT fk_acceso_persona
        FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE RESTRICT,
    CONSTRAINT fk_acceso_registrado_por
        FOREIGN KEY (registrado_por) REFERENCES usuario(id) ON DELETE RESTRICT,
    INDEX idx_acceso_piscina_entrada (piscina_id, hora_entrada),
    INDEX idx_acceso_persona_entrada (persona_id, hora_entrada),
    INDEX idx_acceso_vivienda_entrada (vivienda_id, hora_entrada),
    INDEX idx_acceso_abiertos (piscina_id, hora_salida)
) ENGINE=InnoDB;

CREATE TABLE incidencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    piscina_id INT NOT NULL,
    vivienda_id INT NULL,
    persona_id INT NULL,
    acceso_id INT NULL,
    tipo ENUM('ACCESO_INDEBIDO', 'CONFLICTO', 'MATERIAL', 'MEDICA', 'OTRO') NOT NULL,
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA') NOT NULL DEFAULT 'MEDIA',
    descripcion TEXT NOT NULL,
    estado ENUM('ABIERTA', 'EN_REVISION', 'CERRADA') NOT NULL DEFAULT 'ABIERTA',
    creada_por INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cerrada_por INT NULL,
    cerrada_at DATETIME NULL,
    CONSTRAINT fk_incidencia_piscina
        FOREIGN KEY (piscina_id) REFERENCES piscina(id) ON DELETE CASCADE,
    CONSTRAINT fk_incidencia_vivienda
        FOREIGN KEY (vivienda_id) REFERENCES vivienda(id) ON DELETE SET NULL,
    CONSTRAINT fk_incidencia_persona
        FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE SET NULL,
    CONSTRAINT fk_incidencia_acceso
        FOREIGN KEY (acceso_id) REFERENCES acceso(id) ON DELETE SET NULL,
    CONSTRAINT fk_incidencia_creada_por
        FOREIGN KEY (creada_por) REFERENCES usuario(id) ON DELETE RESTRICT,
    CONSTRAINT fk_incidencia_cerrada_por
        FOREIGN KEY (cerrada_por) REFERENCES usuario(id) ON DELETE RESTRICT,
    INDEX idx_incidencia_piscina_estado (piscina_id, estado),
    INDEX idx_incidencia_prioridad (prioridad),
    INDEX idx_incidencia_fecha (created_at)
) ENGINE=InnoDB;

CREATE TABLE estado_piscina_dia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    piscina_id INT NOT NULL,
    fecha DATE NOT NULL,
    abierta BOOLEAN NOT NULL DEFAULT FALSE,
    confirmacion_ok BOOLEAN NOT NULL DEFAULT FALSE,
    nota TEXT NULL,
    actualizado_por INT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_estado_piscina_dia_piscina
        FOREIGN KEY (piscina_id) REFERENCES piscina(id) ON DELETE CASCADE,
    CONSTRAINT fk_estado_piscina_dia_usuario
        FOREIGN KEY (actualizado_por) REFERENCES usuario(id) ON DELETE RESTRICT,
    CONSTRAINT uq_estado_piscina_dia
        UNIQUE (piscina_id, fecha),
    INDEX idx_estado_piscina_fecha (piscina_id, fecha)
) ENGINE=InnoDB;