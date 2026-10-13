-- ============================================================================
-- KIRIS PLATAFORMA - SCRIPT MAESTRO UNIFICADO DE BASE DE DATOS Y ADMIN (V3)
-- Ecosistema: Innovación en Razonamiento e Inteligencia de Sistemas
-- Modelo Normalizado en 3NF: Materias, Semestres y Auxiliaturas Desacopladas
--
-- ADMIN CREDENCIALES:
--   Usuario:    marcolop450@gmail.com
--   Contraseña: KirisAdmin2026!
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASO 1: EXTENSIONES REQUERIDAS (UUID Y CRIPTOGRAFÍA BCRYPT)
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- PASO 2: ELIMINACIÓN Y LIMPIEZA DE TABLAS ANTERIORES (DROP CASCADE)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.auxiliaries CASCADE;
DROP TABLE IF EXISTS public.recommendations CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.semesters CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.admin_tasks CASCADE;

-- ----------------------------------------------------------------------------
-- PASO 3: TABLA CATEGORÍAS (categories)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(30) DEFAULT '#0d9488',
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PASO 4: TABLA SEMESTRES ACADÉMICOS (semesters)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ej: "II-2026", "I-2026"
    name VARCHAR(100) NOT NULL,                -- Ej: "Segundo Semestre 2026"
    is_current BOOLEAN NOT NULL DEFAULT false, -- Semestre en curso
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Semestre activo por defecto
INSERT INTO public.semesters (code, name, is_current, display_order)
VALUES ('II-2026', 'Segundo Semestre 2026', true, 1)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- PASO 5: TABLA CATÁLOGO DE MATERIAS (subjects)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,                -- Ej: "Estructuras de Datos I"
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ej: "INF-220"
    semester_level INT NOT NULL DEFAULT 1,     -- Nivel curricular (1 al 10, o 11 para Electiva)
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PASO 6: TABLA RECURSOS Y RECOMENDACIONES DE IA (recommendations)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- PASO 7: TABLA AUXILIATURAS Y MATERIAL DE DRIVE (auxiliaries)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.auxiliaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE RESTRICT,
    group_code VARCHAR(50) NOT NULL,           -- Ej: "SA", "SB"
    description TEXT,
    drive_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_auxiliary_subject_semester_group UNIQUE (subject_id, semester_id, group_code)
);

ALTER TABLE public.auxiliaries ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE;
ALTER TABLE public.auxiliaries ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES public.semesters(id) ON DELETE RESTRICT;
ALTER TABLE public.auxiliaries DROP COLUMN IF EXISTS schedule;

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

-- ----------------------------------------------------------------------------
-- PASO 8: TABLA REDES SOCIALES Y CONTACTO (social_links)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- PASO 9: ÍNDICES DE RENDIMIENTO
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_semesters_current ON public.semesters(is_current);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_semester_level ON public.subjects(semester_level);
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON public.recommendations(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_featured ON public.recommendations(is_featured);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_subject ON public.auxiliaries(subject_id);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_semester ON public.auxiliaries(semester_id);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_active ON public.auxiliaries(is_active);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links(display_order);

-- ----------------------------------------------------------------------------
-- PASO 10: POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auxiliaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
DROP POLICY IF EXISTS "Public read semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admin full access on semesters" ON public.semesters;
DROP POLICY IF EXISTS "Public read subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admin full access on subjects" ON public.subjects;
DROP POLICY IF EXISTS "Public read recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Admin full access on recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Public read active auxiliaries" ON public.auxiliaries;
DROP POLICY IF EXISTS "Admin full access on auxiliaries" ON public.auxiliaries;
DROP POLICY IF EXISTS "Public read active social links" ON public.social_links;
DROP POLICY IF EXISTS "Admin full access on social links" ON public.social_links;

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin full access on categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Admin full access on semesters" ON public.semesters FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admin full access on subjects" ON public.subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Admin full access on recommendations" ON public.recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read active auxiliaries" ON public.auxiliaries FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin full access on auxiliaries" ON public.auxiliaries FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read active social links" ON public.social_links FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin full access on social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- PASO 11: REGISTRO / REPARACIÓN DEL ADMINISTRADOR (marcolop450@gmail.com)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_pw TEXT := crypt('KirisAdmin2026!', gen_salt('bf'));
  v_email TEXT := 'marcolop450@gmail.com';
BEGIN
  -- Limpiar registro incompleto anterior
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = v_email);
  DELETE FROM auth.users WHERE email = v_email;

  -- Insertar con todos los tokens inicializados en '' (no NULL)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone_change,
    phone_change_token,
    email_change_token_current,
    reauthentication_token,
    email_change_confirm_status,
    is_sso_user,
    is_super_admin,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    v_pw,
    NOW(),
    '', '', '', '', '', '', '', '',
    0,
    FALSE,
    FALSE,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"name": "Marco Alejandro Lopez Velasquez", "role": "admin"}'::jsonb,
    NOW(),
    NOW()
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    format('{"sub": "%s", "email": "%s"}', v_user_id, v_email)::jsonb,
    'email',
    v_email,
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE '✓ Administrador registrado y configurado sin campos nulos: %', v_email;
END $$;
