import { createClient } from "@/lib/supabase/client";
import { defaultSocialLinks } from "@/lib/data/initialData";
import { SocialLink } from "@/types/database";

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = createClient();
    if (!supabase) return defaultSocialLinks;

    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultSocialLinks;
    }
    return data as SocialLink[];
  } catch {
    return defaultSocialLinks;
  }
}
