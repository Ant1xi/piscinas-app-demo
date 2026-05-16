/* =========================================================
   V6 - Tabla de auditoría
   Registra acciones relevantes del sistema de forma asíncrona
   ========================================================= */

CREATE TABLE audit_log (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id   INT         NULL,
    usuario_email VARCHAR(120) NULL,
    accion       VARCHAR(50) NOT NULL,
    entidad      VARCHAR(50) NOT NULL,
    entidad_id   VARCHAR(50) NULL,
    detalle      TEXT        NULL,
    ip           VARCHAR(45) NULL,
    created_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_usuario (usuario_id),
    INDEX idx_audit_accion  (accion),
    INDEX idx_audit_entidad (entidad, entidad_id),
    INDEX idx_audit_fecha   (created_at)
) ENGINE=InnoDB;
