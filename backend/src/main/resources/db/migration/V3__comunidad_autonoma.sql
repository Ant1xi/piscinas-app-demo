/* =========================================================
 V3 - Comunidades Autónomas + relación con provincias
 ========================================================= */

-- =========================================================
-- 1) Tabla comunidad_autonoma
-- =========================================================
CREATE TABLE comunidad_autonoma (
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB;

-- =========================================================
-- 2) Añadir relación en provincia
-- =========================================================
ALTER TABLE provincia
    ADD COLUMN comunidad_id INT NOT NULL;

ALTER TABLE provincia
    ADD CONSTRAINT fk_provincia_comunidad
        FOREIGN KEY (comunidad_id) REFERENCES comunidad_autonoma(id);

-- =========================================================
-- 3) Insertar todas las comunidades autónomas de España
-- =========================================================
INSERT INTO comunidad_autonoma (nombre) VALUES
                                            ('Andalucía'),
                                            ('Aragón'),
                                            ('Asturias'),
                                            ('Illes Balears'),
                                            ('Canarias'),
                                            ('Cantabria'),
                                            ('Castilla-La Mancha'),
                                            ('Castilla y León'),
                                            ('Cataluña'),
                                            ('Comunitat Valenciana'),
                                            ('Extremadura'),
                                            ('Galicia'),
                                            ('Comunidad de Madrid'),
                                            ('Región de Murcia'),
                                            ('Comunidad Foral de Navarra'),
                                            ('País Vasco'),
                                            ('La Rioja'),
                                            ('Ceuta'),
                                            ('Melilla');

-- =========================================================
-- 4) Insertar todas las provincias de España
-- =========================================================
INSERT INTO provincia (nombre, comunidad_id) VALUES
                                                 ('Almería', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Cádiz', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Córdoba', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Granada', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Huelva', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Jaén', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Málaga', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),
                                                 ('Sevilla', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Andalucía')),

                                                 ('Huesca', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Aragón')),
                                                 ('Teruel', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Aragón')),
                                                 ('Zaragoza', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Aragón')),

                                                 ('Asturias', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Asturias')),

                                                 ('Illes Balears', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Illes Balears')),

                                                 ('Las Palmas', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Canarias')),
                                                 ('Santa Cruz de Tenerife', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Canarias')),

                                                 ('Cantabria', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Cantabria')),

                                                 ('Albacete', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla-La Mancha')),
                                                 ('Ciudad Real', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla-La Mancha')),
                                                 ('Cuenca', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla-La Mancha')),
                                                 ('Guadalajara', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla-La Mancha')),
                                                 ('Toledo', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla-La Mancha')),

                                                 ('Ávila', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Burgos', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('León', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Palencia', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Salamanca', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Segovia', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Soria', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Valladolid', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),
                                                 ('Zamora', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Castilla y León')),

                                                 ('Barcelona', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Cataluña')),
                                                 ('Girona', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Cataluña')),
                                                 ('Lleida', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Cataluña')),
                                                 ('Tarragona', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Cataluña')),

                                                 ('Alicante', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Comunitat Valenciana')),
                                                 ('Castellón', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Comunitat Valenciana')),
                                                 ('Valencia', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Comunitat Valenciana')),

                                                 ('Badajoz', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Extremadura')),
                                                 ('Cáceres', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Extremadura')),

                                                 ('A Coruña', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Galicia')),
                                                 ('Lugo', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Galicia')),
                                                 ('Ourense', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Galicia')),
                                                 ('Pontevedra', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Galicia')),

                                                 ('Madrid', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Comunidad de Madrid')),

                                                 ('Murcia', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Región de Murcia')),

                                                 ('Navarra', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Comunidad Foral de Navarra')),

                                                 ('Araba/Álava', (SELECT id FROM comunidad_autonoma WHERE nombre = 'País Vasco')),
                                                 ('Gipuzkoa', (SELECT id FROM comunidad_autonoma WHERE nombre = 'País Vasco')),
                                                 ('Bizkaia', (SELECT id FROM comunidad_autonoma WHERE nombre = 'País Vasco')),

                                                 ('La Rioja', (SELECT id FROM comunidad_autonoma WHERE nombre = 'La Rioja')),

                                                 ('Ceuta', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Ceuta')),
                                                 ('Melilla', (SELECT id FROM comunidad_autonoma WHERE nombre = 'Melilla'));

-- =========================================================
-- 5) Insertar municipios iniciales de la provincia de Sevilla
-- =========================================================
INSERT INTO municipio (provincia_id, nombre) VALUES
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Sevilla'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Dos Hermanas'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Alcalá de Guadaíra'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Utrera'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Mairena del Aljarafe'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Écija'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'La Rinconada'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Los Palacios y Villafranca'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Lebrija'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Coria del Río'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Camas'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Tomares'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Bormujos'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Castilleja de la Cuesta'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Gines'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Mairena del Alcor'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'El Viso del Alcor'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'San Juan de Aznalfarache'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Gelves'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Palomares del Río'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Bollullos de la Mitación'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Espartinas'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Umbrete'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Valencina de la Concepción'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Salteras'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Olivares'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Santiponce'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'La Algaba'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Almensilla'),
                                                 ((SELECT id FROM provincia WHERE nombre = 'Sevilla'), 'Villanueva del Ariscal');