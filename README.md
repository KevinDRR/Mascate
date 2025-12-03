# formulario-beneficiarios

Proyecto migrado para usar MySQL (XAMPP) en local en lugar de Supabase.

## Configuración local (XAMPP / MySQL)

1. Instala XAMPP e inicia Apache y MySQL.
2. Crea la base de datos (puedes usar phpMyAdmin o la CLI): por ejemplo `beneficiarios`.
3. Ejecuta los scripts SQL en la carpeta `scripts/` en este orden:
   - `001_create_beneficiarios_table.sql`
   - `002_add_emociones_column.sql`
   - `003_insert_sample_beneficiarios.sql` (opcional)

   Puedes importarlos desde phpMyAdmin o con la CLI:

```powershell
# Ajusta usuario/contraseña si es necesario
mysql -u root -p < .\scripts\001_create_beneficiarios_table.sql
mysql -u root -p < .\scripts\002_add_emociones_column.sql
mysql -u root -p < .\scripts\003_insert_sample_beneficiarios.sql
```

4. Configura tus variables de entorno locales creando `.env.local` (NO subirlo a git):

```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=beneficiarios
```

5. Instala dependencias y arranca la app:

```powershell
pnpm install
pnpm dev
```

(si usas npm/yarn sustituye los comandos correspondientes).

## Notas
- Los scripts originales estaban escritos para PostgreSQL/Supabase; se han convertido a MySQL compatible.
- Para indexar campos dentro de JSON en MySQL, crea columnas generadas y añade índices sobre ellas.

# Resumen

## Dependecias
npm install -g pnpm

## Descargar todas las dependencias que el proyecto necesita
npm install

## Iniciar entorno
venv\Scripts\Activate.ps1

## Iniciar el proyecto
npm run dev

## Url de acceso
http://localhost:3000
-http://localhost:5500
-http://localhost:3060


pnpm install --frozen-lockfile; pnpm run build

pnpm run start