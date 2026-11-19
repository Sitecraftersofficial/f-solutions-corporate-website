import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { adminModules, safeWebUrl, type ManagedTable } from "@/lib/admin-config";
import { animalsQuery, categoriesQuery, slugify, DIVISION_LABEL } from "@/lib/data";
import { logAction } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssetInput } from "./AssetInput";

type Row = Record<string, string | number | boolean | null>;
export function RecordsManager({ table }: { table: ManagedTable }) {
  const config = adminModules[table]; const qc = useQueryClient();
  const { data: rows = [], isPending, error } = useQuery({ queryKey: ["admin", table], queryFn: async () => { const r = await supabase.from(table).select("*").order("created_at", { ascending: false }); if (r.error) throw r.error; return r.data as unknown as Row[]; } });
  const { data: cats = [] } = useQuery(categoriesQuery); const { data: animals = [] } = useQuery(animalsQuery);
  const [editing, setEditing] = useState<Row | null>(null); const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [q, setQ] = useState(""); const [busy, setBusy] = useState(false);
  const [remove, setRemove] = useState<Row | null>(null);
  function change(key: string, value: string | number | boolean) { setEditing((r) => r ? { ...r, [key]: value, ...(key === "name" && !r.id ? { slug: slugify(String(value)) } : {}) } : r); }
  async function edit(row: Row) {
    setEditing({ ...row }); setSelectedAnimals([]);
    if (table === "products" && typeof row.id === "string") { const r = await supabase.from("product_animals").select("animal_type_id").eq("product_id", row.id); if (r.error) toast.error(r.error.message); else setSelectedAnimals(r.data.map((a) => a.animal_type_id)); }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!editing) return;
    const payload: Row = {};
    for (const f of config.fields) { const v = editing[f.key]; if (["url", "image", "document"].includes(f.type ?? "") && !safeWebUrl(String(v ?? ""))) { toast.error("Enter a full website address starting with https://"); return; } payload[f.key] = f.type === "checkbox" ? Boolean(v) : f.type === "number" ? Number(v ?? 0) : v || null; }
    setBusy(true);
    try {
      const values = payload as TablesInsert<ManagedTable>;
      const result = editing.id ? await supabase.from(table).update(values).eq("id", String(editing.id)).select("id").single() : await supabase.from(table).insert(values).select("id").single();
      if (result.error) throw result.error;
      if (table === "products") {
        const cleared = await supabase.from("product_animals").delete().eq("product_id", result.data.id); if (cleared.error) throw cleared.error;
        if (editing.division === "agrovet" && selectedAnimals.length) { const refs = await supabase.from("product_animals").insert(selectedAnimals.map((id) => ({ product_id: result.data.id, animal_type_id: id }))); if (refs.error) throw refs.error; }
      }
      await logAction(editing.id ? "Updated" : "Created", table, String(payload.name ?? payload.title));
      await qc.invalidateQueries(); setEditing(null); toast.success("Saved successfully");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save. Please check the fields and try again."); } finally { setBusy(false); }
  }
  return <section>
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold text-primary-deep">{config.title}</h1><Button onClick={() => { setSelectedAnimals([]); setEditing({ division: "human_health", visible: true }); }}><Plus />Add {table === "compliance_documents" ? "document" : table === "animal_types" ? "animal type" : table.replace(/s$/, "")}</Button></div>
    <Input aria-label={`Search ${config.title}`} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="my-6 max-w-md" />
    {error && <p role="alert" className="text-destructive">Could not load records. Please refresh.</p>}
    {isPending ? <p>Loading…</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted"><tr><th className="p-3">Name</th><th className="p-3">Division / status</th><th className="p-3 text-right">Actions</th></tr></thead><tbody>{rows.filter((r) => String(r.name ?? r.title).toLowerCase().includes(q.toLowerCase())).map((r) => <tr key={String(r.id)} className="border-b border-border"><td className="p-3 font-semibold">{String(r.name ?? r.title)}</td><td className="p-3 text-muted-foreground">{r.division ? DIVISION_LABEL[String(r.division)] : ""}{"published" in r ? (r.published ? " · Published" : " · Draft") : "visible" in r ? (r.visible ? "Visible" : "Hidden") : ""}</td><td className="p-3"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" aria-label={`Edit ${r.name ?? r.title}`} title="Edit" onClick={() => edit(r)}><Pencil /></Button><Button variant="ghost" size="icon" aria-label={`Delete ${r.name ?? r.title}`} title="Delete" onClick={() => setRemove(r)}><Trash2 className="text-destructive" /></Button></div></td></tr>)}</tbody></table>{!rows.length && <p className="py-12 text-center text-muted-foreground">No records yet.</p>}</div>}
    <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open && !busy) setEditing(null); }}><DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto"><DialogTitle>{editing?.id ? "Edit" : "Add"} {config.title.toLowerCase()}</DialogTitle><DialogDescription>F-Solutions Ltd</DialogDescription><form onSubmit={save} className="grid gap-4 sm:grid-cols-2">{editing && config.fields.map((f) => <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}><Label htmlFor={`edit-${f.key}`} className="mb-2 block">{f.label}</Label>{f.type === "checkbox" ? <input id={`edit-${f.key}`} type="checkbox" checked={Boolean(editing[f.key])} onChange={(e) => change(f.key, e.target.checked)} className="size-4 accent-primary" /> : f.type === "division" || f.type === "category" ? <select id={`edit-${f.key}`} value={String(editing[f.key] ?? "")} onChange={(e) => { change(f.key, e.target.value); if (f.type === "division") change("category_id", ""); }} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{f.type === "division" ? <><option value="human_health">Human Health</option><option value="agrovet">Agrovet</option></> : <><option value="">No category</option>{cats.filter((c) => c.division === editing.division).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</>}</select> : f.type === "textarea" ? <Textarea id={`edit-${f.key}`} value={String(editing[f.key] ?? "")} onChange={(e) => change(f.key, e.target.value)} rows={3} /> : f.type === "image" || f.type === "document" ? <AssetInput label={f.label} value={String(editing[f.key] ?? "")} onChange={(v) => change(f.key, v)} image={f.type === "image"} required={f.required} /> : <Input id={`edit-${f.key}`} type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"} required={f.required} value={String(editing[f.key] ?? "")} onChange={(e) => change(f.key, e.target.value)} />}</div>)}
      {table === "products" && editing?.division === "agrovet" && <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-medium">Animal types</legend><div className="flex flex-wrap gap-4">{animals.map((a) => <label key={a.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedAnimals.includes(a.id)} onChange={(e) => setSelectedAnimals((ids) => e.target.checked ? [...ids, a.id] : ids.filter((id) => id !== a.id))} />{a.name}</label>)}</div></fieldset>}
      <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" disabled={busy} onClick={() => setEditing(null)}>Cancel</Button><Button disabled={busy} type="submit">{busy ? "Saving…" : "Save"}</Button></div></form></DialogContent></Dialog>
    <Dialog open={Boolean(remove)} onOpenChange={(open) => { if (!open) setRemove(null); }}><DialogContent><DialogTitle>Delete {String(remove?.name ?? remove?.title ?? "record")}?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRemove(null)}>Cancel</Button><Button variant="destructive" disabled={busy} onClick={async () => { if (!remove?.id) return; setBusy(true); const r = await supabase.from(table).delete().eq("id", String(remove.id)); if (r.error) toast.error(r.error.message); else { await logAction("Deleted", table, String(remove.name ?? remove.title)); await qc.invalidateQueries(); setRemove(null); toast.success("Deleted"); } setBusy(false); }}>Delete</Button></div></DialogContent></Dialog>
  </section>;
}