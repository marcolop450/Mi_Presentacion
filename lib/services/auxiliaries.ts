import { createClient } from "@/lib/supabase/client";
import { defaultAuxiliaries } from "@/lib/data/initialData";
import { Auxiliary } from "@/types/database";

export async function getAuxiliaries(): Promise<Auxiliary[]> {
  try {
    const supabase = createClient();
    if (!supabase) return defaultAuxiliaries;

    const { data, error } = await supabase
      .from("auxiliaries")
      .select("*")
      .eq("is_active", true)
      .order("subject_name", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultAuxiliaries;
    }
    return data as Auxiliary[];
  } catch {
    return defaultAuxiliaries;
  }
}
