# 🚀 KIRIS - Innovación en Razonamiento e Inteligencia de Sistemas

> **"Inteligencia Artificial para el día a día"**  
> Plataforma oficial de presentación, repositorio de auxiliaturas universitarias (UAGRM - FICCT) con enlaces a Google Drive, catálogo de recomendaciones tecnológicas y panel de control administrativo.

---

## 👤 Autor & Desarrollador
* **Marco Alejandro Lopez Velasquez (KIRIS)**
* **Institución:** Estudiante de Ingeniería Informática • **UAGRM - FICCT** (Santa Cruz, Bolivia)
* **Contacto:** [marcolop450@gmail.com](mailto:marcolop450@gmail.com)
* **GitHub:** [github.com/marcolop450](https://github.com/marcolop450)

---

## 🌟 Características Principales

1. **Landing de Presentación Tecnológica**:
   * Banner oficial e isotipo de KIRIS con diseño espacial nocturno (`#060B14`, `#0B1528`, acentos en cian `#00A3FF`).
   * Presentación del perfil, stack de tecnologías (Java, C++, C#, Python, Delphi, Next.js, Supabase) y terminal ASCII interactiva.
   * Botonera dinámica de redes y perfiles (GitHub, Correo, WhatsApp, AWS Cloud) administrable sin tocar código.

2. **Módulo de Auxiliaturas Universitarias (Google Drive)**:
   * Filtros dinámicos en tiempo real por **Materia**, **Sigla** (ej. `INF-220`, `SIS-214`) y **Grupo** (ej. `SA`, `SC`).
   * **Múltiples enlaces a Google Drive por auxiliatura**: Carpetas principales, grabaciones de clases en Meet/Zoom, prácticas resueltas y guías en PDF.

3. **Catálogo de Recomendaciones**:
   * Clasificación interactiva por pestañas (`WEB`, `CLASES`, `CANALES DE YOUTUBE`, `INTELIGENCIA ARTIFICIAL` y categorías personalizadas).
   * Enlaces externos seguros con `rel="noopener noreferrer" target="_blank"`.

4. **Panel de Administración Seguro (`/admin`)**:
   * Acceso exclusivo para el administrador protegido con autenticación de Supabase Auth.
   * **CRUD Completo**:
     * Registro y edición de auxiliaturas con múltiples enlaces a Google Drive.
     * Creación de nuevas categorías y recursos recomendados.
     * Configuración dinámica de enlaces de redes y perfiles sociales.
     * **Gestor de Tareas (Task Manager)** privado para seguimiento de actividades y pendientes académicos.

5. **Seguridad Multi-Capa**:
   * **Row Level Security (RLS)** en PostgreSQL: los usuarios anónimos únicamente pueden leer (`SELECT`); solo el administrador autenticado puede crear, modificar o eliminar registros.
   * Sanitización de entradas, prevención contra XSS y secretos protegidos mediante `.env.local` y `.gitignore`.

---

## 🛠️ Stack Tecnológico

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React Icons.
* **Backend as a Service**: Supabase (PostgreSQL, Supabase Auth, Row Level Security).
* **Despliegue Recomendado**: Vercel (soporte serverless de alta velocidad e ISR).

---

## ⚙️ Configuración Paso a Paso

### 1. Clonar el repositorio y ejecutar localmente
```bash
git clone https://github.com/marcolop450/Mi_Presentacion.git
cd Mi_Presentacion
npm install
npm run dev
```
Abre tu navegador en `http://localhost:3000`.

### 2. Configurar Supabase (1 Clic)
1. Ingresa a tu proyecto en [supabase.com](https://supabase.com).
2. Ve a la pestaña **SQL Editor** en el menú lateral izquierdo.
3. Copia todo el contenido del archivo [`supabase/schema.sql`](./supabase/schema.sql) y pulsa **Run**.
4. ¡Listo! Se habrán creado las tablas, las políticas de seguridad RLS y los datos iniciales de prueba.

### 3. Conectar las Credenciales
1. En tu panel de Supabase, dirígete a **Project Settings $\rightarrow$ API**.
2. Copia la `Project URL` y la `anon / public key`.
3. Crea un archivo `.env.local` en la raíz del proyecto (basado en `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

---

## 🚀 Despliegue en Vercel

1. Sube tu código a GitHub:
   ```bash
   git add .
   git commit -m "feat: plataforma web kiris completa"
   git push origin main
   ```
2. Entra en [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **Add New... $\rightarrow$ Project** y selecciona el repositorio `Mi_Presentacion`.
4. En **Environment Variables**, añade:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Pulsa **Deploy** y tu plataforma estará en línea en segundos.
