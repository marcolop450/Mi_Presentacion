export interface SocialLink {
  id: string;
  label: string;
  icon_name: string;
  url: string;
  is_active: boolean;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  display_order: number;
}

export interface Recommendation {
  id: string;
  category_id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  category?: Category;
}

export interface DriveLinkItem {
  title: string;
  url: string;
  type?: 'general' | 'practicas' | 'clases' | 'guias' | 'otro';
}

export interface Auxiliary {
  id: string;
  subject_name: string;
  subject_code: string; // e.g. "SIS-214"
  group_code: string;   // e.g. "SA"
  schedule?: string;    // e.g. "Mar/Jue 14:00 - 16:00"
  semester?: string;    // e.g. "II-2026"
  description?: string;
  drive_links: DriveLinkItem[];
  is_active: boolean;
  created_at: string;
}

export interface AdminTask {
  id: string;
  title: string;
  description?: string;
  priority: 'baja' | 'media' | 'alta';
  status: 'pendiente' | 'en_progreso' | 'completada';
  due_date?: string;
  created_at: string;
}
