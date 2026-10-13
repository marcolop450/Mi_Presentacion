export interface SocialLink {
  id: string;
  label: string;
  icon_name: string;
  url: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  display_order: number;
  created_at?: string;
}

export interface Recommendation {
  id: string;
  category_id: string;
  title: string;
  description: string;
  url: string;
  image_url?: string;
  tags: string[];
  is_featured: boolean;
  display_order?: number;
  created_at: string;
  category?: Category;
}

export interface DriveLinkItem {
  title: string;
  url: string;
  type?: "general" | "practicas" | "clases" | "guias" | "otro";
}

export interface Semester {
  id: string;
  code: string; // e.g. "II-2026"
  name: string; // e.g. "Segundo Semestre 2026"
  is_current: boolean;
  display_order: number;
  created_at?: string;
}

export interface Subject {
  id: string;
  name: string; // e.g. "Estructuras de Datos I"
  code: string; // e.g. "INF-220"
  semester_level?: number; // 1..10 o 11 (Electiva)
  image_url?: string;
  description?: string;
  created_at?: string;
}

export const SEMESTER_LEVELS = [
  { value: 1, label: "1er Semestre" },
  { value: 2, label: "2do Semestre" },
  { value: 3, label: "3er Semestre" },
  { value: 4, label: "4to Semestre" },
  { value: 5, label: "5to Semestre" },
  { value: 6, label: "6to Semestre" },
  { value: 7, label: "7mo Semestre" },
  { value: 8, label: "8vo Semestre" },
  { value: 9, label: "9no Semestre" },
  { value: 10, label: "10mo Semestre" },
  { value: 11, label: "Electiva" },
];

export function getSemesterLevelLabel(level?: number): string {
  if (!level) return "1er Semestre";
  const found = SEMESTER_LEVELS.find((s) => s.value === level);
  return found ? found.label : `${level}º Semestre`;
}

export interface Auxiliary {
  id: string;
  subject_id?: string;
  semester_id?: string;
  group_code: string; // e.g. "SA"
  description?: string;
  drive_links: DriveLinkItem[];
  is_active: boolean;
  created_at: string;
  subject?: Subject;
  semester?: Semester;
  // Campos computados / retrocompatibilidad
  subject_name?: string;
  subject_code?: string;
  image_url?: string;
  semester_code?: string;
}
