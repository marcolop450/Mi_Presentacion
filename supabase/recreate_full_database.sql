-- ============================================================================
-- KIRIS PLATAFORMA - SCRIPT MAESTRO: DESTRUIR Y RECREAR TODA LA BD DESDE CERO
-- Ecosistema: Innovación en Razonamiento e Inteligencia de Sistemas (KIRIS)
-- Modelo: 3NF (Materias sin grupos, Semestres maestros, Auxiliaturas por grupo)
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
-- PASO 2: ELIMINACIÓN TOTAL Y LIMPIEZA DE TABLAS ANTERIORES (DROP CASCADE)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.auxiliaries CASCADE;
DROP TABLE IF EXISTS public.recommendations CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.semesters CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.admin_tasks CASCADE;

-- ----------------------------------------------------------------------------
-- PASO 3: TABLA CATEGORÍAS DE RECURSOS EXTERNOS (categories)
-- ----------------------------------------------------------------------------
-- Clasifica los recursos y recomendaciones externas (herramientas de IA, cursos,
-- plataformas y enlaces) para el filtrado temático de los estudiantes.
CREATE TABLE public.categories (
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
-- Períodos lectivos universitarios oficiales (ej: II-2026, I-2026)
CREATE TABLE public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,          -- Sigla oficial (ej: "II-2026")
    name VARCHAR(100) NOT NULL,                -- Nombre descriptivo (ej: "Segundo Semestre 2026")
    is_current BOOLEAN NOT NULL DEFAULT false, -- Semestre actualmente en curso
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Semestre activo por defecto para iniciar limpiamente
INSERT INTO public.semesters (code, name, is_current, display_order)
VALUES ('II-2026', 'Segundo Semestre 2026', true, 1);

-- ----------------------------------------------------------------------------
-- PASO 5: TABLA CATÁLOGO DE MATERIAS (subjects)
-- ----------------------------------------------------------------------------
-- Asignaturas formales de la carrera con Sigla única (ej: INF110, INF220)
-- NO contiene grupo; los grupos se asignan en las auxiliaturas.
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,                -- Ej: "Estructuras de Datos I"
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ej: "INF-220"
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- PASO 6: TABLA RECURSOS Y RECOMENDACIONES DE IA (recommendations)
-- ----------------------------------------------------------------------------
CREATE TABLE public.recommendations (
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
-- Asignación transaccional: Materia + Semestre + Grupo (ej: INF110 en II-2026 Grupo SA)
CREATE TABLE public.auxiliaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE RESTRICT,
    group_code VARCHAR(50) NOT NULL,           -- Grupo universitario (ej: "SA", "SB")
    description TEXT,
    drive_links JSONB NOT NULL DEFAULT '[]'::jsonb, -- Enlaces a carpetas oficiales de Google Drive
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Restricción estricta de unicidad: No puede haber 2 registros del mismo grupo en el mismo semestre
    CONSTRAINT uq_auxiliary_subject_semester_group UNIQUE (subject_id, semester_id, group_code)
);

-- ----------------------------------------------------------------------------
-- PASO 8: TABLA REDES SOCIALES Y CONTACTO (social_links)
-- ----------------------------------------------------------------------------
CREATE TABLE public.social_links (
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
-- PASO 9: ÍNDICES DE RENDIMIENTO (BÚSQUEDAS Y ORDENAMIENTOS INSTANTÁNEOS)
-- ----------------------------------------------------------------------------
CREATE INDEX idx_categories_order ON public.categories(display_order);
CREATE INDEX idx_semesters_current ON public.semesters(is_current);
CREATE INDEX idx_subjects_code ON public.subjects(code);
CREATE INDEX idx_recommendations_category ON public.recommendations(category_id);
CREATE INDEX idx_recommendations_featured ON public.recommendations(is_featured);
CREATE INDEX idx_auxiliaries_subject ON public.auxiliaries(subject_id);
CREATE INDEX idx_auxiliaries_semester ON public.auxiliaries(semester_id);
CREATE INDEX idx_auxiliaries_active ON public.auxiliaries(is_active);
CREATE INDEX idx_social_links_order ON public.social_links(display_order);

-- ----------------------------------------------------------------------------
-- PASO 10: POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auxiliaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública:
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public read active auxiliaries" ON public.auxiliaries FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public read active social links" ON public.social_links FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

-- Políticas de escritura exclusiva para el administrador autenticado:
CREATE POLICY "Admin full access on categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on semesters" ON public.semesters FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on subjects" ON public.subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on recommendations" ON public.recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on auxiliaries" ON public.auxiliaries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access on social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- PASO 11: CREACIÓN DEL ADMINISTRADOR (marcolop450@gmail.com)
-- ----------------------------------------------------------------------------
-- Limpia el usuario de auth y lo recrea con tokens no nulos ('' en lugar de NULL)
-- para garantizar que GoTrue nunca arroje error 500 ("Database error finding user")
DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_pw TEXT := crypt('KirisAdmin2026!', gen_salt('bf'));
  v_email TEXT := 'marcolop450@gmail.com';
BEGIN
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = v_email);
  DELETE FROM auth.users WHERE email = v_email;

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

  RAISE NOTICE '✓ Base de datos completamente recreada y administrador marcolop450@gmail.com listo.';
END $$;
