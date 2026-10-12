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
  type?: 'general' | 'practicas' | 'clases' | 'guias' | 'otro';
}

export interface Auxiliary {
  id: string;
  subject_name: string;
  subject_code: string; // e.g. "INF-220"
  group_code: string;   // e.g. "SA"
  image_url?: string;
  semester?: string;    // e.g. "II-2026"
  description?: string;
  drive_links: DriveLinkItem[];
  is_active: boolean;
  created_at: string;
}
