-- ==============================================================
-- KIRIS PLATAFORMA - ESQUEMA MAESTRO DE BASE DE DATOS (POSTGRESQL / SUPABASE)
-- Ecosistema: Innovación en Razonamiento e Inteligencia de Sistemas
-- Normalizado en 3NF (Materias y Semestres desacoplados de Auxiliaturas)
-- ==============================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: REDES Y PERFILES SOCIALES (social_links)
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'github',
    url TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: CATEGORÍAS (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(30) DEFAULT '#0d9488',
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: SEMESTRES ACADÉMICOS (semesters)
CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ej: "II-2026", "I-2026"
    name VARCHAR(100) NOT NULL,                -- Ej: "Segundo Semestre 2026"
    is_current BOOLEAN NOT NULL DEFAULT false, -- Marca el semestre activo
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: CATÁLOGO DE MATERIAS (subjects)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,                -- Ej: "Estructuras de Datos I"
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ej: "INF-220"
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA: RECOMENDACIONES Y RECURSOS DE IA (recommendations)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABLA: AUXILIATURAS Y MATERIAL DE DRIVE (auxiliaries)
-- Asignación por Grupo y Semestre vinculada a Materia
CREATE TABLE IF NOT EXISTS public.auxiliaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE RESTRICT,
    group_code VARCHAR(50) NOT NULL,           -- Ej: "SA", "SB"
    description TEXT,
    drive_links JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de { "title": "...", "url": "...", "type": "..." }
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_auxiliary_subject_semester_group UNIQUE (subject_id, semester_id, group_code)
);

-- 8. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_semesters_current ON public.semesters(is_current);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_category ON public.subjects(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON public.recommendations(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_featured ON public.recommendations(is_featured);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_subject ON public.auxiliaries(subject_id);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_semester ON public.auxiliaries(semester_id);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_active ON public.auxiliaries(is_active);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links(display_order);

-- 9. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auxiliaries ENABLE ROW LEVEL SECURITY;

-- Reglas para social_links:
CREATE POLICY "Public read active social links" 
ON public.social_links FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin full access on social links" 
ON public.social_links FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para categories:
CREATE POLICY "Public read categories" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para semesters:
CREATE POLICY "Public read semesters" 
ON public.semesters FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on semesters" 
ON public.semesters FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para subjects:
CREATE POLICY "Public read subjects" 
ON public.subjects FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on subjects" 
ON public.subjects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para recommendations:
CREATE POLICY "Public read recommendations" 
ON public.recommendations FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on recommendations" 
ON public.recommendations FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para auxiliaries:
CREATE POLICY "Public read active auxiliaries" 
ON public.auxiliaries FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin full access on auxiliaries" 
ON public.auxiliaries FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
