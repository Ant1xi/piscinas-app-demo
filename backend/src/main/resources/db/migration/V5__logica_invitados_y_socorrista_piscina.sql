/* =========================================================
   V5 - Corrección lógica invitados + tabla socorrista_piscina
   Proyecto: Control de acceso a piscinas
   Cambios:
   - Elimina max_invitados_diarios de vivienda (no era el lugar correcto)
   - Añade max_invitados_por_vivienda a piscina (límite simultáneo, aplica igual a todas las viviendas de esa piscina)
   - Rediseña registro_invitados: ahora funciona como acceso (hora_entrada / hora_salida)
     para poder validar simultáneos en lugar de totales diarios
   - Añade tabla socorrista_piscina para controlar visibilidad del panel del socorrista
   ========================================================= */

-- =========================================================
-- 1) Eliminar max_invitados_diarios de vivienda
--    El límite no es por vivienda individual, sino definido
--    en la piscina y aplicado a todas sus viviendas por igual
-- =========================================================
ALTER TABLE vivienda
DROP COLUMN max_invitados_diarios;

-- =========================================================
-- 2) Añadir max_invitados_por_vivienda en piscina
--    Representa el máximo de invitados SIMULTÁNEOS permitidos
--    por vivienda en esa piscina en cualquier momento del día
--    0 = sin límite (por defecto)
-- =========================================================
ALTER TABLE piscina
    ADD COLUMN max_invitados_por_vivienda INT NOT NULL DEFAULT 0
    AFTER hora_cierre;

-- =========================================================
-- 3) Rediseñar registro_invitados
--    Ahora funciona igual que acceso:
--    - hora_entrada cuando el socorrista registra la entrada de invitados
--    - hora_salida cuando salen (NULL = siguen dentro)
--    - La validación suma cantidad_invitados WHERE hora_salida IS NULL
--      para esa piscina+vivienda y compara con piscina.max_invitados_por_vivienda
--    - supera_limite se marca si en el momento del registro ya supera el límite
--    - No se bloquea, se registra y se marca para auditoría/incidencia
-- =========================================================
DROP TABLE IF EXISTS registro_invitados;

CREATE TABLE registro_invitados (
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    piscina_id        INT      NOT NULL,
                                    vivienda_id       INT      NOT NULL,
                                    cantidad_invitados INT     NOT NULL DEFAULT 1,
                                    hora_entrada      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    hora_salida       DATETIME NULL,
                                    registrado_por    INT      NOT NULL,
                                    comentario        TEXT     NULL,
                                    supera_limite     BOOLEAN  NOT NULL DEFAULT FALSE,
                                    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_registro_inv_piscina
                                        FOREIGN KEY (piscina_id)  REFERENCES piscina(id)  ON DELETE CASCADE,
                                    CONSTRAINT fk_registro_inv_vivienda
                                        FOREIGN KEY (vivienda_id) REFERENCES vivienda(id) ON DELETE CASCADE,
                                    CONSTRAINT fk_registro_inv_usuario
                                        FOREIGN KEY (registrado_por) REFERENCES usuario(id) ON DELETE RESTRICT,

    -- Ya NO hay unique por (piscina, vivienda, fecha):
    -- una vivienda puede registrar invitados, que salgan, y volver a entrar
                                    INDEX idx_registro_inv_piscina_entrada  (piscina_id, hora_entrada),
                                    INDEX idx_registro_inv_vivienda_entrada (vivienda_id, hora_entrada),
                                    INDEX idx_registro_inv_abiertos         (piscina_id, hora_salida),
                                    INDEX idx_registro_inv_supera_limite    (supera_limite)
) ENGINE=InnoDB;

-- =========================================================
-- 4) Tabla socorrista_piscina
--    Controla qué piscinas aparecen en el panel de cada socorrista.
--    Es independiente de los turnos:
--    - turno_piscina = calendario con fechas y horas (con validación de solapes)
--    - socorrista_piscina = visibilidad permanente en el panel
--    El admin puede añadir/quitar piscinas del panel del socorrista
--    de forma rápida (ej: cubrir a un compañero de urgencia)
-- =========================================================
CREATE TABLE socorrista_piscina (
                                    id              INT PRIMARY KEY AUTO_INCREMENT,
                                    socorrista_id   INT  NOT NULL,
                                    piscina_id      INT  NOT NULL,
                                    activo          BOOLEAN NOT NULL DEFAULT TRUE,
                                    asignado_por    INT  NOT NULL,
                                    fecha_asignacion DATE NOT NULL DEFAULT (CURRENT_DATE),
                                    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_sp_socorrista
                                        FOREIGN KEY (socorrista_id) REFERENCES usuario(id)  ON DELETE CASCADE,
                                    CONSTRAINT fk_sp_piscina
                                        FOREIGN KEY (piscina_id)    REFERENCES piscina(id)  ON DELETE CASCADE,
                                    CONSTRAINT fk_sp_asignado_por
                                        FOREIGN KEY (asignado_por)  REFERENCES usuario(id)  ON DELETE RESTRICT,

    -- Un socorrista solo puede estar asignado una vez a cada piscina
                                    CONSTRAINT uq_socorrista_piscina
                                        UNIQUE (socorrista_id, piscina_id),

                                    INDEX idx_sp_socorrista (socorrista_id),
                                    INDEX idx_sp_piscina    (piscina_id),
                                    INDEX idx_sp_activo     (socorrista_id, activo)
) ENGINE=InnoDB;

-- =========================================================
-- 5) Actualizar datos de prueba existentes
--    Piscina Valdomina: máx 4 invitados simultáneos por vivienda
--    Piscina Jardines:  máx 2 invitados simultáneos por vivienda
-- =========================================================
UPDATE piscina SET max_invitados_por_vivienda = 4 WHERE id = 1;
UPDATE piscina SET max_invitados_por_vivienda = 2 WHERE id = 2;

-- =========================================================
-- 6) Datos de prueba para socorrista_piscina
--    Laura (id=2) puede ver ambas piscinas en su panel
-- =========================================================
INSERT INTO socorrista_piscina (socorrista_id, piscina_id, activo, asignado_por, fecha_asignacion)
VALUES
    (2, 1, TRUE, 1, CURDATE()),
    (2, 2, TRUE, 1, CURDATE());

-- =========================================================
-- 7) Datos de prueba para registro_invitados (nuevo formato)
--    Ejemplos con hora_entrada/hora_salida para demostrar
--    la validación de simultáneos
-- =========================================================
INSERT INTO registro_invitados
(piscina_id, vivienda_id, cantidad_invitados, hora_entrada, hora_salida, registrado_por, comentario, supera_limite)
VALUES
    -- Valdomina, Londres 46: entró con 3 invitados, ya salieron
    (1, 4, 3, CONCAT(CURDATE(), ' 12:30:00'), CONCAT(CURDATE(), ' 14:00:00'), 2, 'Tres invitados por la mañana', FALSE),
    -- Valdomina, Madrid 14: entró con 2 invitados, siguen dentro
    (1, 6, 2, CONCAT(CURDATE(), ' 13:00:00'), NULL, 2, 'Dos invitados actualmente dentro', FALSE),
    -- Jardines, Bloque A piso 1A: entró con 2 invitados (justo en el límite), siguen dentro
    (2, 9, 2, CONCAT(CURDATE(), ' 13:15:00'), NULL, 2, 'En el límite permitido', FALSE);