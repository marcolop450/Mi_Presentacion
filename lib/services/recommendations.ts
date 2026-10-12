import { createClient } from "@/lib/supabase/client";
import { defaultCategories, defaultRecommendations } from "@/lib/data/initialData";
import { Category, Recommendation } from "@/types/database";

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    if (!supabase) return defaultCategories;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultCategories;
    }
    return data as Category[];
  } catch {
    return defaultCategories;
  }
}

export async function getRecommendations(categoryId?: string): Promise<Recommendation[]> {
  try {
    const supabase = createClient();
    if (!supabase) {
      if (!categoryId || categoryId === "all") return defaultRecommendations;
      return defaultRecommendations.filter((r) => r.category_id === categoryId);
    }

    let query = supabase
      .from("recommendations")
      .select("*, category:categories(*)")
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (!categoryId || categoryId === "all") return defaultRecommendations;
      return defaultRecommendations.filter((r) => r.category_id === categoryId);
    }

    return data as Recommendation[];
  } catch {
    if (!categoryId || categoryId === "all") return defaultRecommendations;
    return defaultRecommendations.filter((r) => r.category_id === categoryId);
  }
}
