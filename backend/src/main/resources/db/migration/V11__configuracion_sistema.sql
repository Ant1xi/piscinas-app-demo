CREATE TABLE configuracion_sistema (
  clave VARCHAR(100) PRIMARY KEY,
  valor VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500)
);

INSERT INTO configuracion_sistema VALUES
('cierre_automatico_hora', '23', 'Hora del cierre automático nocturno'),
('cierre_automatico_minuto', '59', 'Minuto del cierre automático nocturno');
