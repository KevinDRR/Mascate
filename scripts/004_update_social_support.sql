ALTER TABLE beneficiarios
  ADD COLUMN apoyo_social_personas TINYINT NULL AFTER convive_con,
  ADD COLUMN apoyo_social_interes TINYINT NULL AFTER apoyo_social_personas,
  ADD COLUMN apoyo_social_vecinos TINYINT NULL AFTER apoyo_social_interes,
  ADD COLUMN apoyo_social_puntaje TINYINT NULL AFTER apoyo_social_vecinos,
  ADD COLUMN apoyo_social_nivel TEXT NULL AFTER apoyo_social_puntaje;

ALTER TABLE beneficiarios
  DROP COLUMN redes_apoyo,
  DROP COLUMN apoyo_salud_mental;
