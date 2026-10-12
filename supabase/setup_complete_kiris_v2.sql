-- ============================================================================
-- KIRIS PLATAFORMA - SCRIPT MAESTRO UNIFICADO DE BASE DE DATOS Y ADMIN (V2)
-- Ecosistema: Innovación en Razonamiento e Inteligencia de Sistemas
-- 
-- ADMIN CREDENCIALES:
--   Usuario:    marcolop450@gmail.com
--   Contraseña: KirisAdmin2026!
-- ============================================================================
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
-- 2. Entra en "SQL Editor" (menú lateral izquierdo).
-- 3. Crea una "New Query", pega TODO este script y pulsa "Run".
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASO 1: EXTENSIONES REQUERIDAS (UUID Y CRIPTOGRAFÍA BCRYPT)
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- PASO 2: ELIMINACIÓN DE MÓDULOS DESCARTADOS
-- ----------------------------------------------------------------------------
-- Eliminamos tabla de tareas administrativas (módulo descartado según solicitud)
DROP TABLE IF EXISTS public.admin_tasks CASCADE;

-- ----------------------------------------------------------------------------
-- PASO 3: TABLA CATEGORÍAS DE IA (categories)
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
-- PASO 4: TABLA RECURSOS Y RECOMENDACIONES DE IA (recommendations)
-- Con orden dinámico (display_order), imagen e integración por categoría
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

-- Si la tabla ya existía, aseguramos que tenga las nuevas columnas
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 1;

-- ----------------------------------------------------------------------------
-- PASO 5: TABLA AUXILIATURAS Y MATERIAL DE DRIVE (auxiliaries)
-- Sin campo de horarios (schedule removido), con soporte para imagen/avatar
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.auxiliaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_name VARCHAR(255) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    group_code VARCHAR(50) NOT NULL,
    semester VARCHAR(50) DEFAULT 'II-2026',
    image_url TEXT,
    description TEXT,
    drive_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Si la tabla ya existía, removemos schedule y agregamos image_url
ALTER TABLE public.auxiliaries DROP COLUMN IF EXISTS schedule;
ALTER TABLE public.auxiliaries ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ----------------------------------------------------------------------------
-- PASO 6: TABLA REDES SOCIALES Y CONTACTO (social_links)
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

-- Si ya existía, aseguramos image_url
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ----------------------------------------------------------------------------
-- PASO 7: ÍNDICES DE ALTO RENDIMIENTO
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON public.recommendations(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_order ON public.recommendations(display_order);
CREATE INDEX IF NOT EXISTS idx_recommendations_featured ON public.recommendations(is_featured);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_active ON public.auxiliaries(is_active);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links(display_order);

-- ----------------------------------------------------------------------------
-- PASO 8: POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auxiliaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas para evitar duplicidad al reejecutar
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
DROP POLICY IF EXISTS "Public read recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Admin full access on recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Public read active auxiliaries" ON public.auxiliaries;
DROP POLICY IF EXISTS "Admin full access on auxiliaries" ON public.auxiliaries;
DROP POLICY IF EXISTS "Public read active social links" ON public.social_links;
DROP POLICY IF EXISTS "Admin full access on social links" ON public.social_links;

-- CATEGORÍAS: Lectura pública, CRUD completo para admin autenticado
CREATE POLICY "Public read categories" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- RECOMENDACIONES: Lectura pública, CRUD completo para admin autenticado
CREATE POLICY "Public read recommendations" 
ON public.recommendations FOR SELECT 
USING (true);

CREATE POLICY "Admin full access on recommendations" 
ON public.recommendations FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- AUXILIATURAS: Lectura pública de activas (o todas si es admin), CRUD para admin
CREATE POLICY "Public read active auxiliaries" 
ON public.auxiliaries FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin full access on auxiliaries" 
ON public.auxiliaries FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- REDES SOCIALES: Lectura pública de activas, CRUD para admin
CREATE POLICY "Public read active social links" 
ON public.social_links FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin full access on social links" 
ON public.social_links FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- PASO 9: REGISTRO / ACTUALIZACIÓN DEL ADMINISTRADOR (marcolop450@gmail.com)
-- Con hash bcrypt seguro en auth.users y vinculación en auth.identities
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
  v_email TEXT := 'marcolop450@gmail.com';
  v_password TEXT := 'KirisAdmin2026!'; -- Contraseña configurada
BEGIN
  -- Generación de hash bcrypt
  v_encrypted_pw := crypt(v_password, gen_salt('bf'));

  -- 1. Limpiar registros previos incompletos que causan 'Database error finding user' (500)
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = v_email);
  DELETE FROM auth.users WHERE email = v_email;

  -- 2. Insertar usuario con TODOS los tokens inicializados a texto vacío '' (no NULL)
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
    v_encrypted_pw,
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

  -- 3. Vincular identidad oficial para inicio de sesión por email
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

-- ----------------------------------------------------------------------------
-- PASO 10: CONFIRMACIÓN FINAL DE ESTADO
-- ----------------------------------------------------------------------------
SELECT 
  id, 
  email, 
  role, 
  email_confirmed_at, 
  created_at 
FROM auth.users 
WHERE email = 'marcolop450@gmail.com';
