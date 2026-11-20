import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/browser";
import { useCachedData, useDataCache } from "@/lib/query";
import { useSeo } from "@/lib/seo";
import { logAction } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AssetInput } from "@/components/admin/AssetInput";

const groups = [
  { title: "Homepage", keys: ["hero_headline", "hero_subtext", "motto", "company_intro", "hero_image_url"] },
  { title: "About Us", keys: ["about_who", "vision", "mission", "core_values"] },
  { title: "Business divisions", keys: ["human_health_intro", "human_health_image_url", "agrovet_intro", "agrovet_image_url"] },
  { title: "Quality & Compliance", keys: ["quality_intro"] },
  { title: "Contact information", keys: ["contact_email", "contact_location", "contact_phone", "contact_whatsapp", "contact_address"] },
  { title: "Company identity & footer", keys: ["logo_url", "footer_text"] },
];
const labels: Record<string, string> = { hero_headline: "Homepage headline", hero_subtext: "Supporting statement", motto: "Company motto", company_intro: "Company introduction", about_who: "Who we are", vision: "Vision", mission: "Mission", core_values: "Core values", human_health_intro: "Human Health introduction", agrovet_intro: "Agrovet introduction", quality_intro: "Quality introduction", contact_email: "Email address", contact_location: "Location", contact_phone: "Telephone", contact_whatsapp: "WhatsApp number", contact_address: "Street address", logo_url: "Official company logo", footer_text: "Footer text", hero_image_url: "Homepage image", human_health_image_url: "Human Health image", agrovet_image_url: "Agrovet image" };
export function ContentAdminPage() {
  useSeo("Manage Website Content", "Edit F-Solutions Ltd company content and images.");
  const cache = useDataCache(); const [draft, setDraft] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false);
  const { data = {}, isPending, error } = useCachedData({ key: "admin:content", queryFn: async (signal) => { const r = await supabase.from("site_content").select("key,value").abortSignal(signal); if (r.error) throw r.error; return Object.fromEntries(r.data.map((v) => [v.key, v.value])) as Record<string, string>; } });
  const known = new Set(groups.flatMap((g) => g.keys)); const extra = Object.keys(data).filter((key) => !known.has(key));
  return <section><h1 className="text-3xl font-bold text-primary-deep">Website Content</h1>{error && <p className="mt-5 text-destructive" role="alert">Could not load website content.</p>}{isPending ? <p className="mt-5">Loading…</p> : <form onSubmit={async (e) => { e.preventDefault(); if (!Object.keys(draft).length) return; setBusy(true); try { const r = await supabase.from("site_content").upsert(Object.entries(draft).map(([key, value]) => ({ key, value }))); if (r.error) throw r.error; await logAction("Updated website content", "site_content", Object.keys(draft).join(", ")); cache.invalidate(); setDraft({}); toast.success("Website content saved"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save content"); } finally { setBusy(false); } }}>
    {[...groups, ...(extra.length ? [{ title: "Additional content", keys: extra }] : [])].map((group) => <section key={group.title} className="mt-8 border-t border-border pt-6"><h2 className="mb-5 text-xl font-bold text-primary-deep">{group.title}</h2><div className="grid gap-5 md:grid-cols-2">{group.keys.map((key) => <div key={key}><Label htmlFor={`content-${key}`} className="mb-2 block">{labels[key] ?? key.replace(/_/g, " ")}</Label>{key.endsWith("_url") && (key.includes("image") || key.includes("logo")) ? <AssetInput label={labels[key] ?? key} image value={draft[key] ?? data[key] ?? ""} onChange={(value) => setDraft((d) => ({ ...d, [key]: value }))} /> : <Textarea id={`content-${key}`} rows={key.includes("intro") || key === "core_values" ? 5 : 2} value={draft[key] ?? data[key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))} />}</div>)}</div></section>)}
    <div className="sticky bottom-0 mt-8 border-t border-border bg-background py-4"><Button type="submit" disabled={busy || !Object.keys(draft).length}>{busy ? "Saving…" : "Save website content"}</Button></div>
  </form>}</section>;
}