-- ==============================================================
-- KIRIS PLATAFORMA - MIGRACIÓN ADMIN V2
-- Actualización del esquema: eliminación de horarios y tareas, 
-- adición de image_url y ordenamiento de recomendaciones.
-- ==============================================================

-- 1. Eliminar campo de horarios en auxiliaturas (solicitado: 'yo me lo sé')
ALTER TABLE IF EXISTS public.auxiliaries DROP COLUMN IF EXISTS schedule;

-- 2. Añadir soporte de imagen de portada / avatar en auxiliaturas
ALTER TABLE IF EXISTS public.auxiliaries ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Añadir soporte de imagen y ordenamiento en recomendaciones
ALTER TABLE IF EXISTS public.recommendations ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE IF EXISTS public.recommendations ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0;

-- 4. Añadir soporte de imagen en enlaces sociales
ALTER TABLE IF EXISTS public.social_links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 5. Eliminar tabla de tareas administrativas (módulo descartado)
DROP TABLE IF EXISTS public.admin_tasks CASCADE;

-- 6. Notificar finalización
COMMENT ON TABLE public.auxiliaries IS 'Auxiliaturas universitarias con enlaces directos a Google Drive e imágenes';
COMMENT ON TABLE public.recommendations IS 'Recursos y herramientas de IA curadas ordenadas por categoría y posición';
