-- Crear tabla de beneficiarios
-- Crear tabla de beneficiarios (MySQL / XAMPP compatible)
CREATE TABLE IF NOT EXISTS beneficiarios (
  id CHAR(36) NOT NULL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Sección 1: Datos de Registro del Contacto
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  caso_numero VARCHAR(255) NOT NULL,
  forma_contacto TEXT,
  tipo_contacto TEXT,
  lugar_contacto TEXT,
  localidad TEXT,
  barrio TEXT,

  -- Sección 2: Información del Beneficiario
  mismo_beneficiario TEXT,
  fuente_nombre TEXT,
  fuente_vinculo TEXT,
  fuente_telefono TEXT,
  nombre_apellido VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE,
  genero TEXT,
  direccion TEXT,
  telefono TEXT,
  grupo_etnico TEXT,
  poblaciones_especiales JSON DEFAULT '[]',

  -- Sección 3: Entorno Familiar y Social
  estado_civil TEXT,
  numero_hijos VARCHAR(50),
  convive_con TEXT,
  redes_apoyo JSON DEFAULT '[]',

  -- Sección 4: Educación y Ocupación
  escolaridad TEXT,
  usa_computador TEXT,
  ocupacion TEXT,

  -- Sección 5: Bienestar y Estilo de Vida
  apoyo_salud_mental TEXT,
  alimentacion TEXT,
  practica_deporte TEXT,
  cual_deporte TEXT,
  participacion_comunitaria TEXT,
  ha_participado TEXT,

  -- Sección 6: Situaciones Presentes
  situaciones_salud JSON DEFAULT '[]',
  situaciones_consumo JSON DEFAULT '[]',
  situaciones_entorno JSON DEFAULT '[]',
  situaciones_economicas JSON DEFAULT '[]',
  situaciones_legales JSON DEFAULT '[]',

  -- Sección 7: Peticiones y Necesidades
  peticiones_apoyo JSON DEFAULT '[]',
  peticiones_necesidades JSON DEFAULT '[]',
  peticiones_capacitacion JSON DEFAULT '[]',
  peticiones_asesoria JSON DEFAULT '[]',

  -- Sección 8: Descripción Abierta del Caso
  descripcion_caso TEXT,

  -- Sección 9: Datos de Quien Diligencia
  nombre_diligencia VARCHAR(255) NOT NULL,
  rol_diligencia VARCHAR(255) NOT NULL,
  telefono_diligencia VARCHAR(50) NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Trigger para asignar UUID automáticamente si no se proporciona
DELIMITER $$
CREATE TRIGGER beneficiarios_before_insert
BEFORE INSERT ON beneficiarios
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_beneficiarios_fecha ON beneficiarios(fecha);
CREATE INDEX idx_beneficiarios_caso_numero ON beneficiarios(caso_numero);
CREATE INDEX idx_beneficiarios_nombre_apellido ON beneficiarios(nombre_apellido);
