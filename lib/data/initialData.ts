import { SocialLink, Category, Recommendation, Auxiliary, AdminTask } from "@/types/database";

export const defaultSocialLinks: SocialLink[] = [
  {
    id: "1",
    label: "GitHub",
    icon_name: "github",
    url: "https://github.com/marcolop450",
    is_active: true,
    display_order: 1,
  },
  {
    id: "2",
    label: "Correo",
    icon_name: "mail",
    url: "mailto:marcolop450@gmail.com",
    is_active: true,
    display_order: 2,
  },
  {
    id: "3",
    label: "WhatsApp",
    icon_name: "whatsapp",
    url: "https://wa.me/59178491823",
    is_active: true,
    display_order: 3,
  },
  {
    id: "4",
    label: "AWS Cloud",
    icon_name: "aws",
    url: "https://aws.amazon.com",
    is_active: true,
    display_order: 4,
  },
];

export const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "WEB",
    slug: "web",
    description: "Herramientas, frameworks y librerías modernas de desarrollo web",
    color: "#00A3FF",
    display_order: 1,
  },
  {
    id: "cat-2",
    name: "CLASES",
    slug: "clases",
    description: "Materiales complementarios, apuntes y grabaciones de clases",
    color: "#10B981",
    display_order: 2,
  },
  {
    id: "cat-3",
    name: "CANALES DE YOUTUBE",
    slug: "canales-youtube",
    description: "Canales educativos recomendados en tecnología e IA",
    color: "#EF4444",
    display_order: 3,
  },
  {
    id: "cat-4",
    name: "INTELIGENCIA ARTIFICIAL",
    slug: "ia",
    description: "Modelos, prompts, herramientas y fundamentos de IA",
    color: "#8B5CF6",
    display_order: 4,
  },
];

export const defaultRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    category_id: "cat-3",
    title: "DotCSV - Divulgación de Inteligencia Artificial",
    description: "Explicaciones visuales y rigurosas sobre redes neuronales, deep learning y avances en IA.",
    url: "https://www.youtube.com/@DotCSV",
    tags: ["IA", "Redes Neuronales", "Educación"],
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "rec-2",
    category_id: "cat-1",
    title: "Next.js y React Moderno",
    description: "Documentación oficial del framework fullstack líder para aplicaciones web de alto rendimiento.",
    url: "https://nextjs.org",
    tags: ["Web", "React", "TypeScript"],
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "rec-3",
    category_id: "cat-4",
    title: "Hugging Face - Repositorio de Modelos Open Source",
    description: "Ecosistema global para experimentar con modelos de visión por computadora y procesamiento de lenguaje natural.",
    url: "https://huggingface.co",
    tags: ["Modelos", "Open Source", "NLP"],
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "rec-4",
    category_id: "cat-2",
    title: "NeetCode - Algoritmos y Estructuras de Datos",
    description: "Resolución de problemas de algoritmos, complejidad Big-O y patrones de codificación limpia.",
    url: "https://neetcode.io",
    tags: ["Algoritmos", "Clean Code", "Entrevistas"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

export const defaultAuxiliaries: Auxiliary[] = [
  {
    id: "aux-1",
    subject_name: "Estructuras de Datos I",
    subject_code: "INF-220",
    group_code: "SA",
    schedule: "Martes y Jueves 14:00 - 16:00",
    semester: "II-2026",
    description: "Auxiliatura oficial centrada en memoria dinámica, listas enlazadas, recursión, pilas, colas y árboles binarios.",
    drive_links: [
      {
        title: "📁 Carpeta Principal de Google Drive",
        url: "https://drive.google.com",
        type: "general",
      },
      {
        title: "🎥 Grabaciones de Clases Virtuales",
        url: "https://drive.google.com",
        type: "clases",
      },
      {
        title: "📝 Prácticas Resueltas y Modelos",
        url: "https://drive.google.com",
        type: "practicas",
      },
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "aux-2",
    subject_name: "Sistemas de Información I",
    subject_code: "SIS-214",
    group_code: "SC",
    schedule: "Miércoles y Viernes 16:00 - 18:00",
    semester: "II-2026",
    description: "Auxiliatura universitaria sobre diseño de bases de datos relacionales, diagramación UML y metodologías de desarrollo.",
    drive_links: [
      {
        title: "📁 Repositorio de Material en Drive",
        url: "https://drive.google.com",
        type: "general",
      },
      {
        title: "📑 Guías de Laboratorio y Prácticas",
        url: "https://drive.google.com",
        type: "guias",
      },
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "aux-3",
    subject_name: "Programación II",
    subject_code: "INF-120",
    group_code: "SB",
    schedule: "Lunes y Miércoles 10:00 - 12:00",
    semester: "II-2026",
    description: "Fundamentos de programación orientada a objetos (POO), abstracción, polimorfismo y manejo de archivos.",
    drive_links: [
      {
        title: "📁 Acceso a la Carpeta Drive",
        url: "https://drive.google.com",
        type: "general",
      },
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const defaultAdminTasks: AdminTask[] = [
  {
    id: "task-1",
    title: "Subir notas de la Práctica 1 de Estructuras de Datos I",
    description: "Revisar envíos del grupo SA y actualizar planilla de calificaciones en Drive.",
    priority: "alta",
    status: "en_progreso",
    due_date: "2026-10-20",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Publicar grabación de la auxiliatura del Jueves",
    description: "Exportar video de Meet y compartir enlace público en la tarjeta de la auxiliatura.",
    priority: "media",
    status: "pendiente",
    due_date: "2026-10-18",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Añadir enlaces de documentación de AWS y PyTorch a Recomendaciones",
    description: "Crear categoría de Cloud Computing y agregar los recursos destacados.",
    priority: "baja",
    status: "completada",
    due_date: "2026-10-15",
    created_at: new Date().toISOString(),
  },
];
