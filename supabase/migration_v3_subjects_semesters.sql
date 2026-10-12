-- ============================================================================
-- KIRIS PLATAFORMA - MIGRACIÓN V3: NORMALIZACIÓN DE MATERIAS Y SEMESTRES
-- Resuelve violaciones de BD (desacoplamiento de Materias y Semestres de Auxiliaturas)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA MAESTRA: SEMESTRES ACADÉMICOS (semesters)
CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,       -- Ej: "II-2026", "I-2026"
    name VARCHAR(100) NOT NULL,             -- Ej: "Segundo Semestre 2026"
    is_current BOOLEAN NOT NULL DEFAULT false, -- Indica si es el período activo
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA MAESTRA: CATÁLOGO DE MATERIAS (subjects)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,             -- Ej: "Estructuras de Datos I"
    code VARCHAR(50) NOT NULL UNIQUE,       -- Ej: "INF-220" (Sigla única)
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_subjects_category ON public.subjects(category_id);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);
CREATE INDEX IF NOT EXISTS idx_semesters_current ON public.semesters(is_current);
CREATE INDEX IF NOT EXISTS idx_semesters_order ON public.semesters(display_order);

-- 4. MIGRACIÓN DE DATOS PREVIOS EN AUXILIATURAS (SI EXISTIERAN)
-- Insertar semestres únicos a partir de auxiliaries existentes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auxiliaries' AND column_name='semester') THEN
        INSERT INTO public.semesters (code, name, is_current, display_order)
        SELECT DISTINCT 
            COALESCE(NULLIF(TRIM(semester), ''), 'II-2026'),
            'Semestre ' || COALESCE(NULLIF(TRIM(semester), ''), 'II-2026'),
            true,
            1
        FROM public.auxiliaries
        WHERE semester IS NOT NULL
        ON CONFLICT (code) DO NOTHING;
    END IF;

    -- Si no hay semestres, crear el actual por defecto
    INSERT INTO public.semesters (code, name, is_current, display_order)
    VALUES ('II-2026', 'Segundo Semestre 2026', true, 1)
    ON CONFLICT (code) DO NOTHING;
END $$;

-- Insertar materias únicas a partir de auxiliaries existentes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auxiliaries' AND column_name='subject_code') THEN
        INSERT INTO public.subjects (code, name, image_url, description)
        SELECT DISTINCT ON (TRIM(UPPER(subject_code)))
            TRIM(UPPER(subject_code)),
            TRIM(subject_name),
            image_url,
            description
        FROM public.auxiliaries
        WHERE subject_code IS NOT NULL AND subject_name IS NOT NULL
        ON CONFLICT (code) DO UPDATE 
        SET 
            name = EXCLUDED.name,
            image_url = COALESCE(EXCLUDED.image_url, public.subjects.image_url);
    END IF;
END $$;

-- 5. ACTUALIZAR TABLA AUXILIARIES CON CLAVES FORÁNEAS
ALTER TABLE public.auxiliaries ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE;
ALTER TABLE public.auxiliaries ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES public.semesters(id) ON DELETE RESTRICT;

-- Enlazar registros antiguos con sus nuevos IDs
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auxiliaries' AND column_name='subject_code') THEN
        UPDATE public.auxiliaries a
        SET subject_id = s.id
        FROM public.subjects s
        WHERE TRIM(UPPER(a.subject_code)) = s.code AND a.subject_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auxiliaries' AND column_name='semester') THEN
        UPDATE public.auxiliaries a
        SET semester_id = sem.id
        FROM public.semesters sem
        WHERE TRIM(a.semester) = sem.code AND a.semester_id IS NULL;
    END IF;

    -- Para cualquier registro sin semestre_id, asignar el semestre actual
    UPDATE public.auxiliaries a
    SET semester_id = (SELECT id FROM public.semesters WHERE is_current = true LIMIT 1)
    WHERE a.semester_id IS NULL;
END $$;

-- Crear restricción de unicidad para evitar duplicar el mismo grupo en el mismo semestre
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_auxiliary_subject_semester_group'
    ) THEN
        ALTER TABLE public.auxiliaries 
        ADD CONSTRAINT uq_auxiliary_subject_semester_group 
        UNIQUE (subject_id, semester_id, group_code);
    END IF;
END $$;

-- 6. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admin full access on semesters" ON public.semesters;
DROP POLICY IF EXISTS "Public read subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admin full access on subjects" ON public.subjects;

CREATE POLICY "Public read semesters" 
ON public.semesters FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on semesters" 
ON public.semesters FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read subjects" 
ON public.subjects FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on subjects" 
ON public.subjects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
