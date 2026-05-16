/* =========================================================
 V2 - Observaciones e invitados por vivienda
 Proyecto: Control de acceso a piscinas
 Objetivo:
 - Permitir observaciones e incidencias sobre piscina, vivienda o persona.
 - Añadir límite máximo de invitados por vivienda.
 - Registrar cuántos invitados lleva cada vivienda por día, sin guardar datos personales
 de los invitados.
 ========================================================= */
-- =========================================================
-- 1) Vivienda: límite de invitados
-- =========================================================
ALTER TABLE vivienda
ADD COLUMN max_invitados_diarios INT NOT NULL DEFAULT 0
AFTER observaciones;
-- =========================================================
-- 2) Incidencia: distinguir entre incidencia y observación
-- =========================================================
ALTER TABLE incidencia
ADD COLUMN categoria ENUM('INCIDENCIA', 'OBSERVACION') NOT NULL DEFAULT 'INCIDENCIA'
AFTER acceso_id;
-- Ampliamos tipos para cubrir mejor casos reales del proyecto
ALTER TABLE incidencia
MODIFY COLUMN tipo ENUM(
        'ACCESO_INDEBIDO',
        'CONFLICTO',
        'COMPORTAMIENTO',
        'INVITADOS',
        'MATERIAL',
        'MEDICA',
        'OTRO'
    ) NOT NULL;
-- Índices extra para explotar históricos por vivienda/persona
ALTER TABLE incidencia
ADD INDEX idx_incidencia_categoria (categoria),
    ADD INDEX idx_incidencia_vivienda_fecha (vivienda_id, created_at),
    ADD INDEX idx_incidencia_persona_fecha (persona_id, created_at);
-- =========================================================
-- 3) Registro de invitados por vivienda
--    No se guardan invitados individuales, solo cantidad por día
--    para poder sacar históricos y detectar abusos.
-- =========================================================
CREATE TABLE registro_invitados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    piscina_id INT NOT NULL,
    vivienda_id INT NOT NULL,
    -- Día en el que esa vivienda llevó invitados
    fecha DATE NOT NULL,
    -- Número total de invitados llevados por la vivienda ese día
    cantidad_invitados INT NOT NULL DEFAULT 0,
    -- Marcado por el socorrista/usuario que registra el dato
    registrado_por INT NOT NULL,
    -- Se puede dejar una nota si hace falta
    observacion TEXT NULL,
    -- Se guarda si ese día superó el máximo configurado para esa vivienda
    supera_limite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_registro_invitados_piscina FOREIGN KEY (piscina_id) REFERENCES piscina(id) ON DELETE CASCADE,
    CONSTRAINT fk_registro_invitados_vivienda FOREIGN KEY (vivienda_id) REFERENCES vivienda(id) ON DELETE CASCADE,
    CONSTRAINT fk_registro_invitados_usuario FOREIGN KEY (registrado_por) REFERENCES usuario(id) ON DELETE RESTRICT,
    -- Una vivienda solo puede tener un registro de invitados por piscina y día
    CONSTRAINT uq_registro_invitados_piscina_vivienda_fecha UNIQUE (piscina_id, vivienda_id, fecha),
    INDEX idx_registro_invitados_piscina_fecha (piscina_id, fecha),
    INDEX idx_registro_invitados_vivienda_fecha (vivienda_id, fecha),
    INDEX idx_registro_invitados_supera_limite (supera_limite)
) ENGINE = InnoDB;