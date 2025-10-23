-- Add emociones column to beneficiarios table
-- Add emociones column (MySQL compatible)
ALTER TABLE beneficiarios 
ADD COLUMN IF NOT EXISTS emociones JSON DEFAULT '[]';

-- Note: MySQL does not support GIN indexes. If you need to index specific JSON keys,
-- consider using generated columns and indexing them, for example:
-- ALTER TABLE beneficiarios ADD COLUMN emociones_key VARCHAR(255) GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(emociones, '$[0]'))) VIRTUAL;
-- CREATE INDEX idx_beneficiarios_emociones_key ON beneficiarios (emociones_key);
