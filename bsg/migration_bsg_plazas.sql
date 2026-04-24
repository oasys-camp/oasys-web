-- ================================================================
-- MIGRACIÓN bsg_plazas · El Bosque Sagrado
-- Ejecutar en: Supabase → SQL Editor → Run
-- Seguro re-ejecutar: usa IF NOT EXISTS / ON CONFLICT DO NOTHING
-- Probado contra la estructura real detectada vía API REST (2026-04-24):
--   columnas existentes → id (integer PK), tipo (text)
--   filas actuales      → 0
-- ================================================================


-- ================================================================
-- 1. AÑADIR COLUMNAS QUE FALTAN
-- ================================================================
-- La tabla está vacía, por lo que NOT NULL en numero_plaza es seguro.
-- Si ya ejecutaste esto antes, IF NOT EXISTS evita errores duplicados.

ALTER TABLE public.bsg_plazas
  ADD COLUMN IF NOT EXISTS numero_plaza     integer        UNIQUE NOT NULL,
  ADD COLUMN IF NOT EXISTS nombre_fundador  text,
  ADD COLUMN IF NOT EXISTS nif              text,
  ADD COLUMN IF NOT EXISTS domicilio_fiscal text,
  ADD COLUMN IF NOT EXISTS email            text,
  ADD COLUMN IF NOT EXISTS telefono         text,
  ADD COLUMN IF NOT EXISTS nombre_mascota   text,
  ADD COLUMN IF NOT EXISTS especie_raza     text,
  ADD COLUMN IF NOT EXISTS peso_kg          numeric(6,2),
  ADD COLUMN IF NOT EXISTS especie_arbol    text           DEFAULT 'sin preferencia',
  ADD COLUMN IF NOT EXISTS nota             text           DEFAULT '',
  ADD COLUMN IF NOT EXISTS fecha_reserva    timestamptz,
  ADD COLUMN IF NOT EXISTS created_at       timestamptz    NOT NULL DEFAULT now();

-- Default y constraint de tipo
ALTER TABLE public.bsg_plazas
  ALTER COLUMN tipo SET DEFAULT 'libre';

ALTER TABLE public.bsg_plazas
  DROP CONSTRAINT IF EXISTS bsg_plazas_tipo_check;

ALTER TABLE public.bsg_plazas
  ADD CONSTRAINT bsg_plazas_tipo_check
    CHECK (tipo IN ('libre', 'pendiente', 'confirmada'));


-- ================================================================
-- 2. INSERTAR LAS 50 PLAZAS
-- ================================================================
-- No especificamos id para respetar la secuencia identity de Supabase.
-- ON CONFLICT en numero_plaza hace el INSERT idempotente.

INSERT INTO public.bsg_plazas (numero_plaza, tipo)
SELECT gs, 'libre'
FROM   generate_series(1, 50) AS gs
ON CONFLICT (numero_plaza) DO NOTHING;


-- ================================================================
-- 3. ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE public.bsg_plazas ENABLE ROW LEVEL SECURITY;

-- Permisos de tabla al rol anon.
-- SELECT: acceso completo a nivel de tabla; RLS restringe a filas libres.
GRANT SELECT ON public.bsg_plazas TO anon;

-- UPDATE: columnas de datos del formulario únicamente.
-- numero_plaza e id quedan excluidos → el anon key no puede reasignarlos.
GRANT UPDATE (
  tipo,
  nombre_fundador,
  nif,
  domicilio_fiscal,
  email,
  telefono,
  nombre_mascota,
  especie_raza,
  peso_kg,
  especie_arbol,
  nota,
  fecha_reserva
) ON public.bsg_plazas TO anon;

-- Limpiar políticas previas
DROP POLICY IF EXISTS "anon_select_libres" ON public.bsg_plazas;
DROP POLICY IF EXISTS "anon_update_libres" ON public.bsg_plazas;

-- SELECT: el anon key solo ve filas donde tipo = 'libre'.
-- El JS necesita numero_plaza de estas filas para saber cuál reservar.
-- Las filas pendiente/confirmada (con datos personales) son invisibles.
CREATE POLICY "anon_select_libres"
  ON public.bsg_plazas
  FOR SELECT
  TO anon
  USING (tipo = 'libre');

-- UPDATE:
--   USING     → solo puede modificar filas que HOY son 'libre'
--   WITH CHECK → después del PATCH, tipo DEBE ser 'pendiente'
-- Combinado: solo permite la transición libre → pendiente.
-- Impide: leer datos de reservas ajenas, volver a 'libre', saltar a 'confirmada'.
CREATE POLICY "anon_update_libres"
  ON public.bsg_plazas
  FOR UPDATE
  TO anon
  USING     (tipo = 'libre')
  WITH CHECK (tipo = 'pendiente');


-- ================================================================
-- 4. VERIFICACIÓN (descomentar y ejecutar por separado)
-- ================================================================

-- 50 filas, todas tipo='libre':
-- SELECT numero_plaza, tipo FROM public.bsg_plazas ORDER BY numero_plaza;

-- Políticas activas:
-- SELECT policyname, cmd, roles, qual, with_check
-- FROM   pg_policies WHERE tablename = 'bsg_plazas';

-- Columnas reales de la tabla:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM   information_schema.columns
-- WHERE  table_schema = 'public' AND table_name = 'bsg_plazas'
-- ORDER  BY ordinal_position;


-- ================================================================
-- BUGS DETECTADOS EN bsg/index.html  (no bloquean la migración)
-- ================================================================
--
-- BUG 1 — especie_raza recibe el valor del árbol, no de la mascota:
--   Línea JS:  especie_raza: g('especie')
--   g('especie') apunta a <select name="especie"> (árbol nominal).
--   El campo <input name="especie_mascota"> (raza real) nunca se envía.
--
-- BUG 2 — especie_arbol y especie_raza reciben el mismo valor:
--   Línea JS:  especie_arbol: form.querySelector('select')?.value
--   form.querySelector('select') también devuelve <select name="especie">.
--   Ambas columnas quedan con el mismo dato de árbol.
--
-- Corrección en el JS (dos líneas a cambiar):
--   especie_raza:  g('especie_mascota'),   // ← era g('especie')
--   especie_arbol: g('especie'),            // ← era form.querySelector('select')?.value
