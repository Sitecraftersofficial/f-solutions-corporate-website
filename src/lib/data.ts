import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Division = "human_health" | "agrovet";
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type AnimalType = Database["public"]["Tables"]["animal_types"]["Row"];
export type Partner = Database["public"]["Tables"]["partners"]["Row"];
export type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
export type ProductWithRefs = Product & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
  product_animals: { animal_type_id: string }[];
};

export const DIVISION_LABEL: Record<string, string> = {
  human_health: "Human Health",
  agrovet: "Agrovet",
  general: "General",
};

/** Default copy used until the database responds; database values always win. */
export const CONTENT_DEFAULTS: Record<string, string> = {
  hero_headline: "Reliable Healthcare & Agrovet Supply Solutions in Rwanda",
  hero_subtext:
    "Delivering high-quality pharmaceuticals, medical devices, and veterinary products through compliant, efficient, and trusted distribution systems.",
  motto: "One World. One Health. One Solution.",
  contact_email: "info@fsolutions.rw",
  contact_location: "Kigali, Rwanda",
};

export const contentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_content").select("key,value");
    if (error) throw error;
    const map: Record<string, string> = { ...CONTENT_DEFAULTS };
    for (const r of data ?? []) if (r.value !== "" || !(r.key in map)) map[r.key] = r.value;
    return map;
  },
  staleTime: 60_000,
});

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const animalsQuery = queryOptions({
  queryKey: ["animal_types"],
  queryFn: async () => {
    const { data, error } = await supabase.from("animal_types").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

const PRODUCT_SELECT = "*, categories(id,name,slug), product_animals(animal_type_id)";

export const productsQuery = (division?: Division) =>
  queryOptions({
    queryKey: ["products", "public", division ?? "all"],
    queryFn: async () => {
      let q = supabase.from("products").select(PRODUCT_SELECT).eq("published", true).order("name");
      if (division) q = q.eq("division", division);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as ProductWithRefs[];
    },
  });

export const productBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ProductWithRefs | null;
    },
  });

export const partnersQuery = queryOptions({
  queryKey: ["partners", "public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("visible", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const complianceDocsQuery = queryOptions({
  queryKey: ["compliance_documents", "public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("compliance_documents")
      .select("*")
      .eq("visible", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Filters a product list by free-text search, category, brand and animal type. */
export function filterProducts(
  list: ProductWithRefs[],
  f: { q?: string; category?: string; brand?: string; animal?: string },
) {
  const q = f.q?.trim().toLowerCase();
  return list.filter((p) => {
    if (q && !`${p.name} ${p.brand ?? ""} ${p.short_description ?? ""}`.toLowerCase().includes(q))
      return false;
    if (f.category && p.category_id !== f.category) return false;
    if (f.brand && (p.brand ?? "") !== f.brand) return false;
    if (f.animal && !p.product_animals.some((a) => a.animal_type_id === f.animal)) return false;
    return true;
  });
}
