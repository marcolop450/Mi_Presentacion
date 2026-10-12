-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE ADMINISTRADOR SUPABASE (KIRIS)
-- Usuario: marcolop450@gmail.com
-- Contraseña por defecto: KirisAdmin2026!
-- ============================================================================
-- INSTRUCCIONES DE USO:
-- 1. Abre el panel de tu proyecto en Supabase (https://supabase.com/dashboard).
-- 2. Entra a la sección "SQL Editor" en el menú lateral izquierdo.
-- 3. Crea una "New query", pega TODO este script y haz clic en "Run".
-- ============================================================================

-- Paso 1: Asegurar extensión de criptografía (bcrypt) y UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Paso 2: Registrar o Actualizar el Administrador en auth.users y auth.identities
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
  v_email TEXT := 'marcolop450@gmail.com';
  v_password TEXT := 'KirisAdmin2026!'; -- Contraseña configurada
BEGIN
  -- Generar hash bcrypt seguro
  v_encrypted_pw := crypt(v_password, gen_salt('bf'));

  -- Verificar si el usuario ya existe en auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;

  IF v_user_id IS NULL THEN
    -- Generar nuevo UUID para el usuario
    v_user_id := gen_random_uuid();

    -- Insertar en auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_email,
      v_encrypted_pw,
      NOW(),                  -- Email confirmado de inmediato
      NULL,
      '',
      NULL,
      '',
      NULL,
      '',
      '',
      NULL,
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Marco Alejandro Lopez Velasquez", "role": "admin"}',
      FALSE,
      NOW(),
      NOW(),
      NULL,
      NULL,
      '',
      '',
      NULL,
      '',
      0,
      NULL,
      '',
      NULL,
      FALSE,
      NULL
    );

    -- Insertar en auth.identities (requerido por Supabase GoTrue para login email/password)
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

    RAISE NOTICE '✓ Administrador registrado exitosamente: %', v_email;
  ELSE
    -- Si ya existe, actualizamos su contraseña y confirmación
    UPDATE auth.users
    SET 
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      raw_user_meta_data = '{"name": "Marco Alejandro Lopez Velasquez", "role": "admin"}'
    WHERE id = v_user_id;

    -- Verificar si existe en auth.identities
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_user_id) THEN
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
    END IF;

    RAISE NOTICE '✓ Contraseña de administrador actualizada para: %', v_email;
  END IF;
END $$;

-- Paso 3: Confirmación de consulta
SELECT 
  id, 
  email, 
  role, 
  email_confirmed_at, 
  created_at, 
  updated_at 
FROM auth.users 
WHERE email = 'marcolop450@gmail.com';
