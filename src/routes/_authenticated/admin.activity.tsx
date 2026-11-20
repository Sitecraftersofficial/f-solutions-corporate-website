import { supabase } from "@/integrations/supabase/browser";
import { useCachedData } from "@/lib/query";
import { useSeo } from "@/lib/seo";
export function ActivityAdminPage() {
  useSeo("Activity Log", "Recent F-Solutions Ltd administrator actions.");
  const { data = [], isPending, error } = useCachedData({ key: "admin:activity", queryFn: async (signal) => { const r = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(200).abortSignal(signal); if (r.error) throw r.error; return r.data; } });
  return <section><h1 className="text-3xl font-bold text-primary-deep">Activity Log</h1>{error && <p role="alert" className="mt-5 text-destructive">Could not load activity.</p>}{isPending ? <p className="mt-6">Loading…</p> : <div className="mt-6 divide-y divide-border">{data.map((r) => <div key={r.id} className="flex flex-wrap justify-between gap-3 py-4"><div><p className="font-semibold">{r.action} <span className="font-normal text-muted-foreground">{r.entity?.replace(/_/g, " ")}</span></p><p className="mt-1 break-words text-sm text-muted-foreground">{r.details}</p></div><time className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</time></div>)}{!data.length && <p className="py-8 text-muted-foreground">No activity recorded yet.</p>}</div>}</section>;
}