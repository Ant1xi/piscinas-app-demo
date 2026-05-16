/* =========================================================
   V4 - Datos de prueba reales + demo
   ========================================================= */

-- =========================
-- USUARIOS
-- =========================

INSERT INTO usuario (id, nombre, apellidos, email, password_hash, telefono, activo, created_at, updated_at)
VALUES
    (1, 'Antonio', 'Castro Guerrero', 'admin@piscinas.com', '$2a$10$KmNBcigCkeyakbHMjy71yO6mVJKa007XcJuVNLBx3jxGi8HtUjqs.', '600000001', 1, NOW(), NOW()),
    (2, 'Laura', 'Socorrista Prueba', 'socorrista@piscinas.com', '$2a$10$KmNBcigCkeyakbHMjy71yO6mVJKa007XcJuVNLBx3jxGi8HtUjqs.', '600000002', 1, NOW(), NOW());

INSERT INTO usuario_rol (usuario_id, rol)
VALUES
    (1, 'ADMIN'),
    (2, 'SOCORRISTA');

-- =========================
-- URBANIZACIÓN REAL
-- =========================

INSERT INTO urbanizacion
(id, municipio_id, nombre, direccion, google_maps_url, tipo_urbanizacion, activa, created_at, updated_at)
VALUES
    (1, 18, 'REAL DE VALDOMINA', 'Bormujos, Sevilla',
     'https://www.google.com/maps/@37.349766,-6.0299284,3a,75y,206.78h,66.79t/data=!3m7!1e1!3m5!1skrP36_xPHPFpXwvtH8S4hw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D23.206285127692084%26panoid%3DkrP36_xPHPFpXwvtH8S4hw%26yaw%3D206.7761829194312!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D',
     'CALLES', 1, '2026-04-22 13:30:44', '2026-04-22 15:11:43');

INSERT INTO piscina
(id, urbanizacion_id, nombre, descripcion, hora_apertura, hora_cierre, ruta_imagen, activa, created_at, updated_at)
VALUES
    (1, 1, 'Piscina Real de Valdomina',
     'Piscina tranquila con buenos vecinos ubicada en San Juan Bajo',
     '12:00:00', '22:00:00', 'uploads/piscinas/real-valdomina.jpg',
     1, '2026-04-28 12:32:00', '2026-04-28 12:35:14');

INSERT INTO calle (id, urbanizacion_id, nombre)
VALUES
    (3, 1, 'Londres'),
    (2, 1, 'Madrid'),
    (4, 1, 'París');

-- Viviendas Real de Valdomina

INSERT INTO vivienda
(id, urbanizacion_id, calle_id, bloque_id, identificador, planta, observaciones, max_invitados_diarios, created_at, updated_at)
VALUES
    (4, 1, 3, NULL, '46', NULL, 'Casa de Blanca', 4, '2026-04-22 15:56:17', '2026-04-22 15:56:17'),
    (5, 1, 2, NULL, '12', NULL, 'Casa familiar en calle Madrid', 3, NOW(), NOW()),
    (6, 1, 2, NULL, '14', NULL, 'Vivienda con varios habitantes', 2, NOW(), NOW()),
    (7, 1, 4, NULL, '21', NULL, 'Casa de uso habitual en verano', 4, NOW(), NOW()),
    (8, 1, 4, NULL, '23', NULL, 'Propietarios mayores, suelen venir por la tarde', 2, NOW(), NOW());

-- Persona real

INSERT INTO persona
(id, nombre, apellidos, dni, telefono, email, activo, created_at, updated_at)
VALUES
    (1, 'Blanca', 'Godoy López', '12345678Z', '600111222', 'blanca@email.com', 1, '2026-04-26 11:53:15', '2026-04-26 11:53:15');

-- Personas inventadas

INSERT INTO persona
(id, nombre, apellidos, dni, telefono, email, activo, created_at, updated_at)
VALUES
    (2, 'Manuel', 'García López', '11111111A', '611111111', 'manuel.garcia@test.com', 1, NOW(), NOW()),
    (3, 'Carmen', 'Ruiz Martín', '22222222B', '622222222', 'carmen.ruiz@test.com', 1, NOW(), NOW()),
    (4, 'Lucía', 'Fernández Soto', '33333333C', '633333333', 'lucia.fernandez@test.com', 1, NOW(), NOW()),
    (5, 'Javier', 'Moreno Díaz', '44444444D', '644444444', 'javier.moreno@test.com', 1, NOW(), NOW()),
    (6, 'Marta', 'Sánchez Vega', '55555555E', '655555555', 'marta.sanchez@test.com', 1, NOW(), NOW());

INSERT INTO vivienda_persona
(id, persona_id, vivienda_id, rol_en_vivienda, principal, fecha_alta, fecha_baja)
VALUES
    (1, 1, 4, 'HABITANTE', 1, '2026-04-22', NULL),
    (2, 2, 5, 'PROPIETARIO', 1, CURDATE(), NULL),
    (3, 3, 5, 'HABITANTE', 0, CURDATE(), NULL),
    (4, 4, 6, 'PROPIETARIO', 1, CURDATE(), NULL),
    (5, 5, 7, 'PROPIETARIO', 1, CURDATE(), NULL),
    (6, 6, 8, 'PROPIETARIO', 1, CURDATE(), NULL);

-- =========================
-- OTRA URBANIZACIÓN DEMO
-- =========================

INSERT INTO urbanizacion
(id, municipio_id, nombre, direccion, google_maps_url, tipo_urbanizacion, activa, created_at, updated_at)
VALUES
    (2, (SELECT id FROM municipio WHERE nombre = 'Bormujos'), 'JARDINES DEL ALJARAFE',
     'Calle Camino de Gines 25, Bormujos', 'https://maps.google.com/?q=Bormujos+Sevilla',
     'BLOQUES', 1, NOW(), NOW());

INSERT INTO piscina
(id, urbanizacion_id, nombre, descripcion, hora_apertura, hora_cierre, ruta_imagen, activa, created_at, updated_at)
VALUES
    (2, 2, 'Piscina Jardines del Aljarafe',
     'Piscina comunitaria de urbanización por bloques',
     '11:30:00', '21:30:00', 'uploads/piscinas/jardines-aljarafe.jpg',
     1, NOW(), NOW());

INSERT INTO bloque (id, urbanizacion_id, codigo)
VALUES
    (1, 2, 'Bloque A'),
    (2, 2, 'Bloque B');

INSERT INTO vivienda
(id, urbanizacion_id, calle_id, bloque_id, identificador, planta, observaciones, max_invitados_diarios, created_at, updated_at)
VALUES
    (9, 2, NULL, 1, 'A', '1', 'Piso 1A', 2, NOW(), NOW()),
    (10, 2, NULL, 1, 'B', '1', 'Piso 1B', 2, NOW(), NOW()),
    (11, 2, NULL, 2, 'C', '2', 'Piso 2C', 3, NOW(), NOW());

INSERT INTO persona
(id, nombre, apellidos, dni, telefono, email, activo, created_at, updated_at)
VALUES
    (7, 'Pablo', 'Navarro Torres', '66666666F', '666666666', 'pablo.navarro@test.com', 1, NOW(), NOW()),
    (8, 'Ana', 'Ramos Pérez', '77777777G', '677777777', 'ana.ramos@test.com', 1, NOW(), NOW()),
    (9, 'Diego', 'Santos Molina', '88888888H', '688888888', 'diego.santos@test.com', 1, NOW(), NOW());

INSERT INTO vivienda_persona
(id, persona_id, vivienda_id, rol_en_vivienda, principal, fecha_alta, fecha_baja)
VALUES
    (7, 7, 9, 'PROPIETARIO', 1, CURDATE(), NULL),
    (8, 8, 10, 'PROPIETARIO', 1, CURDATE(), NULL),
    (9, 9, 11, 'HABITANTE', 1, CURDATE(), NULL);

-- =========================
-- TURNOS
-- =========================

INSERT INTO turno_piscina
(piscina_id, socorrista_id, fecha, hora_inicio, hora_fin, estado)
VALUES
    (1, 2, CURDATE(), '12:00:00', '22:00:00', 'EN_CURSO'),
    (2, 2, CURDATE(), '11:30:00', '21:30:00', 'PROGRAMADO');

-- =========================
-- ACCESOS
-- =========================

INSERT INTO acceso
(piscina_id, vivienda_id, persona_id, hora_entrada, hora_salida, registrado_por, comentario)
VALUES
    (1, 4, 1, CONCAT(CURDATE(), ' 12:20:00'), NULL, 2, 'Blanca actualmente dentro'),
    (1, 5, 2, CONCAT(CURDATE(), ' 12:45:00'), CONCAT(CURDATE(), ' 14:30:00'), 2, 'Entrada y salida normal'),
    (1, 5, 3, CONCAT(CURDATE(), ' 16:10:00'), NULL, 2, 'Actualmente dentro'),
    (1, 6, 4, CONCAT(CURDATE(), ' 17:05:00'), NULL, 2, 'Entra con un invitado'),
    (1, 7, 5, DATE_SUB(CONCAT(CURDATE(), ' 18:00:00'), INTERVAL 1 DAY), DATE_SUB(CONCAT(CURDATE(), ' 20:00:00'), INTERVAL 1 DAY), 2, 'Acceso de ayer'),
    (2, 9, 7, CONCAT(CURDATE(), ' 13:15:00'), CONCAT(CURDATE(), ' 15:00:00'), 2, 'Acceso correcto en Jardines');

-- =========================
-- INCIDENCIAS / OBSERVACIONES
-- =========================

INSERT INTO incidencia
(piscina_id, vivienda_id, persona_id, acceso_id, categoria, tipo, prioridad, descripcion, estado, creada_por, created_at, cerrada_por, cerrada_at)
VALUES
    (1, 4, 1, NULL, 'OBSERVACION', 'OTRO', 'BAJA',
     'Vecina registrada correctamente como habitante de la vivienda Londres 46.',
     'ABIERTA', 2, NOW(), NULL, NULL),

    (1, 6, 4, NULL, 'OBSERVACION', 'INVITADOS', 'MEDIA',
     'La vivienda Madrid 14 ha traído un invitado. Revisar si se repite mucho.',
     'ABIERTA', 2, NOW(), NULL, NULL),

    (1, NULL, NULL, NULL, 'INCIDENCIA', 'MATERIAL', 'ALTA',
     'Una ducha exterior pierde agua.',
     'ABIERTA', 2, NOW(), NULL, NULL),

    (2, NULL, NULL, NULL, 'INCIDENCIA', 'CONFLICTO', 'MEDIA',
     'Discusión leve entre vecinos cerca de la zona de hamacas.',
     'CERRADA', 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 1, NOW());

-- =========================
-- REGISTRO DE INVITADOS
-- =========================

INSERT INTO registro_invitados
(piscina_id, vivienda_id, fecha, cantidad_invitados, registrado_por, observacion, supera_limite)
VALUES
    (1, 4, CURDATE(), 0, 2, 'Sin invitados', 0),
    (1, 6, CURDATE(), 1, 2, 'Un invitado registrado correctamente', 0),
    (1, 7, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3, 2, 'Tres invitados el día anterior', 0),
    (2, 9, CURDATE(), 2, 2, 'Dos invitados en Jardines', 0);

-- =========================
-- ESTADO DIARIO PISCINA
-- =========================

INSERT INTO estado_piscina_dia
(piscina_id, fecha, abierta, confirmacion_ok, nota, actualizado_por)
VALUES
    (1, CURDATE(), 1, 1, 'Piscina Real de Valdomina abierta y revisada.', 2),
    (2, CURDATE(), 0, 0, 'Pendiente de apertura.', 2);

-- =========================
-- AJUSTE AUTO_INCREMENT
-- =========================

ALTER TABLE usuario AUTO_INCREMENT = 10;
ALTER TABLE urbanizacion AUTO_INCREMENT = 10;
ALTER TABLE piscina AUTO_INCREMENT = 10;
ALTER TABLE calle AUTO_INCREMENT = 10;
ALTER TABLE bloque AUTO_INCREMENT = 10;
ALTER TABLE vivienda AUTO_INCREMENT = 20;
ALTER TABLE persona AUTO_INCREMENT = 20;
ALTER TABLE vivienda_persona AUTO_INCREMENT = 20;