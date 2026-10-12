-- ============================================================================
-- KIRIS PLATAFORMA - SCRIPT DE LIMPIEZA COMPLETA DE DATOS (RESET TOTAL)
-- Propósito: Vaciar todas las tablas de contenido y restaurar la base de datos a un
--            estado 100% limpio y funcional, preservando la cuenta del administrador
--            sin errores 500 de autenticación.
--
-- ADMIN CREDENCIALES:
--   Usuario:    marcolop450@gmail.com
--   Contraseña: KirisAdmin2026!
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASO 1: VACIADO TOTAL DE TABLAS EN ORDEN DE INTEGRIDAD REFERENCIAL
-- ----------------------------------------------------------------------------
-- Desactivar temporalmente disparadores y truncar tablas con cascada
DO $$
BEGIN
    -- 1. Eliminar asignaciones transaccionales de auxiliaturas
    DELETE FROM public.auxiliaries;
    
    -- 2. Eliminar recursos y recomendaciones de IA
    DELETE FROM public.recommendations;
    
    -- 3. Eliminar catálogo de materias
    DELETE FROM public.subjects;
    
    -- 4. Eliminar semestres académicos
    DELETE FROM public.semesters;
    
    -- 5. Eliminar categorías temáticas
    DELETE FROM public.categories;
    
    -- 6. Eliminar redes sociales y enlaces de contacto
    DELETE FROM public.social_links;

    -- 7. Eliminar cualquier tabla heredada o tareas administrativas obsoletas
    DROP TABLE IF EXISTS public.admin_tasks CASCADE;

    RAISE NOTICE '✓ Todas las tablas de datos han sido vaciadas exitosamente.';
END $$;

-- ----------------------------------------------------------------------------
-- PASO 2: SEMESTRE ACTIVO INICIAL POR DEFECTO (OPCIONAL Y RECOMENDADO)
-- ----------------------------------------------------------------------------
INSERT INTO public.semesters (code, name, is_current, display_order)
VALUES ('II-2026', 'Segundo Semestre 2026', true, 1)
ON CONFLICT (code) DO UPDATE
SET is_current = true, name = 'Segundo Semestre 2026';

-- ----------------------------------------------------------------------------
-- PASO 3: REASEGURAMIENTO DEL ADMINISTRADOR (marcolop450@gmail.com)
-- ----------------------------------------------------------------------------
-- Previene y soluciona cualquier error 500 ("Database error finding user")
-- asegurando que todos los tokens de GoTrue sean cadenas vacías '' y no NULL.
DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_pw TEXT := crypt('KirisAdmin2026!', gen_salt('bf'));
  v_email TEXT := 'marcolop450@gmail.com';
BEGIN
  -- Limpiar registro anterior del usuario para garantizar consistencia
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = v_email);
  DELETE FROM auth.users WHERE email = v_email;

  -- Reinsertar usuario administrador completamente sano
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

  RAISE NOTICE '✓ Usuario administrador marcolop450@gmail.com reconfigurado y listo para ingresar.';
END $$;

-- ----------------------------------------------------------------------------
-- FIN DEL SCRIPT: BASE DE DATOS LIMPIA Y OPERATIVA
-- ----------------------------------------------------------------------------
