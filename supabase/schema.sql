-- Supabase schema for beneficiarios data collected by the application
-- Run this script in the Supabase SQL editor (SQL -> New query)
-- Adjust types/defaults if you customise the form fields.

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

create table if not exists public.beneficiarios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  fecha date,
  hora time,
  caso_numero integer unique,

  forma_contacto text,
  tipo_contacto text,
  lugar_contacto text,
  localidad text,
  barrio text,

  mismo_beneficiario text,
  fuente_nombre text,
  fuente_vinculo text,
  fuente_telefono text,

  nombre_apellido text,
  fecha_nacimiento date,
  genero text,
  direccion text,
  telefono text,
  grupo_etnico text,

  poblaciones_especiales text[] default array[]::text[],
  estado_civil text,
  numero_hijos text,
  convive_con text,

  apoyo_social_personas smallint,
  apoyo_social_interes smallint,
  apoyo_social_vecinos smallint,
  apoyo_social_puntaje smallint,
  apoyo_social_nivel text,

  escolaridad text,
  usa_computador text,
  ocupacion text,
  alimentacion text,
  practica_deporte text,
  cual_deporte text,
  participacion_comunitaria text,
  ha_participado text,

  situaciones_salud text[] default array[]::text[],
  situaciones_consumo text[] default array[]::text[],
  situaciones_entorno text[] default array[]::text[],
  situaciones_economicas text[] default array[]::text[],
  situaciones_legales text[] default array[]::text[],

  peticiones_apoyo text[] default array[]::text[],
  peticiones_necesidades text[] default array[]::text[],
  peticiones_capacitacion text[] default array[]::text[],
  peticiones_asesoria text[] default array[]::text[],

  descripcion_caso text,
  nombre_diligencia text,
  rol_diligencia text,
  telefono_diligencia text,

  emociones jsonb default '[]'::jsonb
);
