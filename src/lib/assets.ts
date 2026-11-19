import { supabase } from "@/integrations/supabase/browser";

const PRODUCT_STORAGE_PREFIX = "/product-images/";

export function resolveProductImageUrl(url: string | null | undefined) {
  if (!url) return "";
  if (!url.startsWith(PRODUCT_STORAGE_PREFIX)) return url;

  const path = url.slice(PRODUCT_STORAGE_PREFIX.length);
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}
