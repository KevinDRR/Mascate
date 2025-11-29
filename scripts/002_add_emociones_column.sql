ALTER TABLE beneficiarios 
ADD COLUMN IF NOT EXISTS emociones JSON DEFAULT '[]';

