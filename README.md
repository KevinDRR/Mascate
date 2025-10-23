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
- Si quieres revertir a Supabase, conserva los archivos en `lib/supabase` antes de borrarlos; actualmente se han eliminado para evitar confusión.
- Para indexar campos dentro de JSON en MySQL, crea columnas generadas y añade índices sobre ellas.
