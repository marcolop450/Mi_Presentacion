# 🌐 KIRIS - Plataforma Académica & Hub de Recursos

> **Innovación en Razonamiento e Inteligencia de Sistemas**  
> Plataforma web oficial para la centralización de auxiliaturas universitarias (FICCT - UAGRM), repositorio de enlaces a Google Drive, curaduría de recursos de programación e inteligencia artificial, y panel administrativo modular.

---

## 👤 Autor

* **Marco Alejandro Lopez Velasquez (KIRIS)**
* **Rol:** Estudiante de Ingeniería Informática • Auxiliar de Cátedra • Desarrollador con IA
* **Institución:** Universidad Autónoma Gabriel René Moreno (**UAGRM - FICCT**), Santa Cruz de la Sierra, Bolivia.
* **Contacto:** [marcolop450@gmail.com](mailto:marcolop450@gmail.com)
* **GitHub:** [github.com/marcolop450](https://github.com/marcolop450)

---

## 🧭 Estructura del Proyecto

### 🏛️ 1. Portal Público
* **Inicio (`/`)**: Presentación oficial, estadísticas de acceso y navegación rápida hacia los módulos clave.
* **Auxiliaturas (`/auxiliaturas`)**: Repositorio de materiales y carpetas en Google Drive organizadas por materia, sigla (`INF-XXX`), grupo (`SA`, `SB`) y semestre lectivo. Incluye buscador en tiempo real y paginación fluida.
* **Recursos & Programación (`/recursos`)**: Colección seleccionada de herramientas de desarrollo, canales educativos de YouTube, plataformas de práctica de lógica y documentación de IA clasificada por categorías temáticas.
* **Sobre Mí (`/sobre-mi`)**: Ficha de presentación profesional, perfil académico y canales directos de contacto.

### 🛡️ 2. Panel de Administración Modular (`/admin/dashboard`)
Panel privado de alta seguridad estructurado en páginas independientes con URLs dedicadas:

* **Resumen General (`/admin/dashboard`)**: Métricas KPI en tiempo real y accesos rápidos de gestión.
* **Semestres (`/admin/dashboard/semestres`)**: Gestión de períodos académicos y selección del semestre lectivo en curso.
* **Catálogo de Materias (`/admin/dashboard/materias`)**: Registro maestro de asignaturas con código único oficial.
* **Auxiliaturas (`/admin/dashboard/auxiliaturas`)**: Asignación de grupos, semestres y gestión de múltiples enlaces a Google Drive.
* **Categorías (`/admin/dashboard/categorias`)**: Organización temática exclusiva para clasificar recomendaciones y herramientas externas.
* **Recursos & Recomendaciones (`/admin/dashboard/recomendaciones`)**: Publicación de enlaces con validación estricta de protocolo (`http://`, `https://`) y destacado.
* **Redes y Canales (`/admin/dashboard/redes`)**: Configuración dinámica de perfiles sociales y medios de contacto.

---

## ⚡ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components y Streaming) |
| **Librería UI** | [React 19](https://react.dev/) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) con tipado estricto |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) (diseño responsivo, modo claro/oscuro) |
| **Iconos** | [Lucide React](https://lucide.dev/) |
| **Base de Datos & Auth** | [Supabase](https://supabase.com/) (PostgreSQL con Row Level Security) |
| **Despliegue** | [Vercel](https://vercel.com/) |

---

## 🔒 Arquitectura de Seguridad

1. **Middleware en el Servidor (`middleware.ts`)**: Protección automática sobre todas las rutas `/admin/*` (excepto `/admin/login`). Redirección instantánea si no existe cookie de autenticación válida.
2. **Row Level Security (RLS)**: Las tablas de PostgreSQL permiten únicamente consultas de lectura (`SELECT`) a visitantes anónimos. Operaciones de escritura (`INSERT`, `UPDATE`, `DELETE`) están restringidas al usuario administrador autenticado.
3. **Manejo de Errores Resiliente**: Los fallos de conexión o base de datos muestran un mensaje genérico *"Problemas de Servidor"*, evitando la exposición de detalles internos o códigos SQL en la interfaz.

---

## 🚀 Despliegue en Vercel (Paso a Paso)

### Paso 1: Configurar la Base de Datos en Supabase
1. Ingresa a tu panel en [supabase.com](https://supabase.com) y crea un proyecto.
2. Ve al **SQL Editor** en el menú izquierdo.
3. Abre el archivo [`supabase/setup_complete_kiris_v2.sql`](./supabase/setup_complete_kiris_v2.sql) de este repositorio, copia su contenido, pégalo en el editor y presiona **Run**.
   *(Opcional: Si deseas reiniciar la base de datos limpia desde cero, usa [`supabase/recreate_full_database.sql`](./supabase/recreate_full_database.sql)).*
4. En **Project Settings $\rightarrow$ API**, copia tu **Project URL** y tu **anon public key**.

### Paso 2: Importar en Vercel
1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New... $\rightarrow$ Project**.
3. Selecciona el repositorio `Mi_Presentacion`.
4. En la sección **Environment Variables**, agrega las dos variables de Supabase:
   * `NEXT_PUBLIC_SUPABASE_URL` = `https://tu-proyecto.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `tu-clave-anon-aqui`
5. Haz clic en **Deploy**. Vercel compilará la aplicación y generará la URL pública de producción en segundos.

---

## 💻 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/marcolop450/Mi_Presentacion.git
cd Mi_Presentacion

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crea un archivo .env.local con tus credenciales:
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Ejecutar suite de pruebas
npm test
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT para fines educativos y de la comunidad universitaria FICCT - UAGRM.
