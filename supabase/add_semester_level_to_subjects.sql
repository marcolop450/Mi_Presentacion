-- ====================================================================
-- MIGRACIÓN: AGREGAR SEMESTRE CURRICULAR A LA TABLA SUBJECTS (MATERIAS)
-- ====================================================================
-- Ejecuta este script en el SQL Editor de tu panel de Supabase.
-- Permite indicar si la materia pertenece al 1er, 2do ... 10mo Semestre o Electiva,
-- ordenando las auxiliaturas de menor a mayor de forma natural y limpia.

ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS semester_level INTEGER DEFAULT 1;

COMMENT ON COLUMN public.subjects.semester_level IS 'Semestre o nivel curricular de la materia (1 al 10, o 11 para Electiva)';

CREATE INDEX IF NOT EXISTS idx_subjects_semester_level ON public.subjects(semester_level);

-- Verificación de estado
SELECT 'Migración completada: Columna semester_level agregada correctamente a public.subjects' AS resultado;
