pnpm install --frozen-lockfile; pnpm run build
pnpm run start
# formulario-beneficiarios

El proyecto está preparado para trabajar con Supabase como base de datos (PostgreSQL administrado).

## Configuración con Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Desde el **Table Editor** crea una tabla `beneficiarios` con los campos que usa la aplicación. Para acelerar este paso abre el **SQL Editor** de Supabase y pega el contenido de `supabase/schema.sql`; el script crea la tabla con todos los campos y extensiones necesarias.
3. En el panel de **Project Settings → API** copia las claves:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Crea tu archivo `.env.local` (no lo subas a git) con:

```
SUPABASE_URL=<https://xxxxx.supabase.co>
SUPABASE_ANON_KEY=<tu anon key>
SUPABASE_SERVICE_ROLE_KEY=<tu service role key>
NEXT_DISABLE_DEV_INDICATORS=1
```

5. (Opcional) Para contar con datos de ejemplo abre nuevamente el **SQL Editor** y ejecuta `supabase/seed.sql`, que inserta 10 beneficiarios ficticios.

6. Instala dependencias y ejecuta la app:

```powershell
pnpm install
pnpm dev
```

Para producción (por ejemplo en Render) utiliza:

```bash
pnpm install && pnpm run build
pnpm run start
```

# Resumen

- Instalación de pnpm global (opcional): `npm install -g pnpm`
- Instalar dependencias del proyecto: `pnpm install`
- Ejecutar en desarrollo: `pnpm dev`
- Construir la aplicación: `pnpm run build`
- Arrancar en modo producción: `pnpm run start`

Acceso local por defecto: `http://localhost:3000`