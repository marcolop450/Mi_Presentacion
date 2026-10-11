-- ==============================================================
-- KIRIS PLATAFORMA - ESQUEMA DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- Innovación en Razonamiento e Inteligencia de Sistemas
-- ==============================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: REDES Y PERFILES SOCIALES (social_links)
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'globe', -- github, aws, whatsapp, facebook, linkedin, mail, etc.
    url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: CATEGORÍAS DE RECOMENDACIONES (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(30) DEFAULT '#00A3FF',
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: RECOMENDACIONES (recommendations)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: AUXILIATURAS Y MATERIAL EN DRIVE (auxiliaries)
CREATE TABLE IF NOT EXISTS public.auxiliaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_name VARCHAR(255) NOT NULL,     -- Ej: "Estructuras de Datos I"
    subject_code VARCHAR(50) NOT NULL,      -- Ej: "INF-220"
    group_code VARCHAR(50) NOT NULL,        -- Ej: "SA" o "SB"
    schedule VARCHAR(150),                  -- Ej: "Mar/Jue 14:00 - 16:00"
    semester VARCHAR(50) DEFAULT 'II-2026', -- Ej: "II-2026"
    description TEXT,
    drive_links JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de { "title": "...", "url": "...", "type": "..." }
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA: TAREAS PRIVADAS DEL ADMINISTRADOR (admin_tasks)
CREATE TABLE IF NOT EXISTS public.admin_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'media', -- baja, media, alta
    status VARCHAR(30) NOT NULL DEFAULT 'pendiente', -- pendiente, en_progreso, completada
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON public.recommendations(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_featured ON public.recommendations(is_featured);
CREATE INDEX IF NOT EXISTS idx_auxiliaries_active ON public.auxiliaries(is_active);
CREATE INDEX IF NOT EXISTS idx_social_links_active ON public.social_links(is_active, display_order);

-- ==============================================================
-- 8. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auxiliaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;

-- Reglas para social_links:
-- Visitantes: solo lectura de enlaces activos
CREATE POLICY "Public read active social links" 
ON public.social_links FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

-- Admin autenticado: control total (crear, editar, eliminar)
CREATE POLICY "Admin full access on social links" 
ON public.social_links FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para categories:
-- Visitantes: solo lectura
CREATE POLICY "Public read categories" 
ON public.categories FOR SELECT 
USING (true);

-- Admin autenticado: control total
CREATE POLICY "Admin full access on categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para recommendations:
-- Visitantes: solo lectura
CREATE POLICY "Public read recommendations" 
ON public.recommendations FOR SELECT 
USING (true);

-- Admin autenticado: control total
CREATE POLICY "Admin full access on recommendations" 
ON public.recommendations FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para auxiliaries:
-- Visitantes: solo lectura de auxiliaturas activas
CREATE POLICY "Public read active auxiliaries" 
ON public.auxiliaries FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

-- Admin autenticado: control total
CREATE POLICY "Admin full access on auxiliaries" 
ON public.auxiliaries FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para admin_tasks:
-- Visitantes: NINGÚN ACCESO (totalmente privado)
-- Admin autenticado: acceso exclusivo
CREATE POLICY "Admin exclusive access on tasks" 
ON public.admin_tasks FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
