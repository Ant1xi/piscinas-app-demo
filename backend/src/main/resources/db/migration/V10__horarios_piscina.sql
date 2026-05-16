CREATE TABLE piscina_horario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    piscina_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dias_semana VARCHAR(20) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (piscina_id) REFERENCES piscina(id) ON DELETE CASCADE
);

INSERT INTO piscina_horario (piscina_id, nombre, dias_semana, hora_apertura, hora_cierre)
SELECT id, 'Horario principal', 'LMXJVSD', hora_apertura, hora_cierre
FROM piscina
WHERE hora_apertura IS NOT NULL;
