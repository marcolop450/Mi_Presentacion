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
    subject_code VARCHAR(50) NOT NULL,      -- Ej: "SIS-214"
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

-- ==============================================================
-- 7. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
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

-- Admin: control total (crear, editar, eliminar)
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

-- Admin: control total
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

-- Admin: control total
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

-- Admin: control total
CREATE POLICY "Admin full access on auxiliaries" 
ON public.auxiliaries FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para admin_tasks:
-- Visitantes: NINGÚN ACCESO (totalmente privado)
-- Admin: acceso exclusivo
CREATE POLICY "Admin exclusive access on tasks" 
ON public.admin_tasks FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ==============================================================
-- 8. DATOS INICIALES (SEED DATA)
-- ==============================================================

-- Perfiles iniciales de Marco Lopez Velasquez
INSERT INTO public.social_links (label, icon_name, url, display_order)
VALUES 
    ('GitHub', 'github', 'https://github.com/marcolop450', 1),
    ('Correo', 'mail', 'mailto:marcolop450@gmail.com', 2),
    ('WhatsApp', 'whatsapp', 'https://wa.me/591XXXXXXXX', 3),
    ('AWS Cloud', 'aws', 'https://aws.amazon.com', 4)
ON CONFLICT DO NOTHING;

-- Categorías iniciales
INSERT INTO public.categories (name, slug, description, color, display_order)
VALUES 
    ('WEB', 'web', 'Herramientas, frameworks y recursos de desarrollo web moderno', '#00A3FF', 1),
    ('CLASES', 'clases', 'Material complementario, tutoriales y cursos grabados', '#10B981', 2),
    ('CANALES DE YOUTUBE', 'canales-youtube', 'Canales formativos en tecnología e Inteligencia Artificial', '#EF4444', 3),
    ('INTELIGENCIA ARTIFICIAL', 'ia', 'Modelos, librerías, papers y herramientas de IA aplicada', '#8B5CF6', 4)
ON CONFLICT (slug) DO NOTHING;

-- Recomendaciones iniciales
DO $$
DECLARE
    cat_web UUID;
    cat_youtube UUID;
    cat_ia UUID;
BEGIN
    SELECT id INTO cat_web FROM public.categories WHERE slug = 'web' LIMIT 1;
    SELECT id INTO cat_youtube FROM public.categories WHERE slug = 'canales-youtube' LIMIT 1;
    SELECT id INTO cat_ia FROM public.categories WHERE slug = 'ia' LIMIT 1;

    IF cat_youtube IS NOT NULL THEN
        INSERT INTO public.recommendations (category_id, title, description, url, tags, is_featured)
        VALUES 
            (cat_youtube, 'DotCSV', 'Canal referente en español sobre Inteligencia Artificial, redes neuronales y machine learning.', 'https://www.youtube.com/@DotCSV', ARRAY['IA', 'Machine Learning', 'Educación'], true),
            (cat_youtube, 'Midudev', 'Desarrollo web moderno, JavaScript, React y novedades del ecosistema tecnológico.', 'https://www.youtube.com/@midudev', ARRAY['Web', 'JavaScript', 'Next.js'], false);
    END IF;

    IF cat_ia IS NOT NULL THEN
        INSERT INTO public.recommendations (category_id, title, description, url, tags, is_featured)
        VALUES 
            (cat_ia, 'Hugging Face Hub', 'La plataforma líder para descubrir modelos de IA abiertos, datasets y aplicaciones.', 'https://huggingface.co', ARRAY['Modelos', 'NLP', 'Open Source'], true);
    END IF;
END $$;

-- Auxiliaturas iniciales (UAGRM - FICCT) con múltiples enlaces a Drive
INSERT INTO public.auxiliaries (subject_name, subject_code, group_code, schedule, semester, description, drive_links)
VALUES 
    (
        'Estructuras de Datos I', 
        'INF-220', 
        'SA', 
        'Martes y Jueves 14:00 - 16:00', 
        'II-2026', 
        'Auxiliatura enfocada en listas enlazadas, pilas, colas, recursión y árboles en Java y C++.',
        '[
            {"title": "Carpeta Principal de Google Drive", "url": "https://drive.google.com", "type": "general"},
            {"title": "Grabaciones de Clases Virtuales", "url": "https://drive.google.com", "type": "clases"},
            {"title": "Prácticas Resueltas y Modelos de Examen", "url": "https://drive.google.com", "type": "practicas"}
        ]'::jsonb
    ),
    (
        'Sistemas de Información I', 
        'SIS-214', 
        'SC', 
        'Miércoles y Viernes 16:00 - 18:00', 
        'II-2026', 
        'Auxiliatura sobre metodologías ágiles, diseño de bases de datos relacionales y arquitectura de software.',
        '[
            {"title": "Carpeta de Recursos de la Materia", "url": "https://drive.google.com", "type": "general"},
            {"title": "Guías de Diagramación UML y Prácticas", "url": "https://drive.google.com", "type": "guias"}
        ]'::jsonb
    );
