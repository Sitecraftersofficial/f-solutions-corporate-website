import { Link } from "react-router-dom";
import { Package, Inbox, Handshake, FileCheck2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/browser";
import { Button } from "@/components/ui/button";
import { useCachedData } from "@/lib/query";
export function DashboardPage() {
  const { data, isPending, error } = useCachedData({
    key: "admin:dashboard",
    queryFn: async (signal) => {
      const results = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).abortSignal(signal),
        supabase
          .from("enquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending")
          .abortSignal(signal),
        supabase.from("partners").select("id", { count: "exact", head: true }).abortSignal(signal),
        supabase
          .from("compliance_documents")
          .select("id", { count: "exact", head: true })
          .abortSignal(signal),
        supabase
          .from("enquiries")
          .select("id,full_name,product_name,status,created_at")
          .order("created_at", { ascending: false })
          .limit(5)
          .abortSignal(signal),
      ]);
      for (const r of results) if (r.error) throw r.error;
      return {
        counts: results.slice(0, 4).map((r) => r.count ?? 0),
        recent: results[4].data as {
          id: string;
          full_name: string;
          product_name: string | null;
          status: string;
          created_at: string;
        }[],
      };
    },
  });
  return (
    <>
      <p className="eyebrow">F-Solutions Ltd</p>
      <h1 className="mt-2 text-3xl font-bold text-primary-deep">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">One World. One Health. One Solution.</p>
      {error && (
        <p role="alert" className="mt-6 text-destructive">
          Could not load dashboard. Please refresh.
        </p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", icon: Package, to: "/admin/products" },
          { label: "Pending enquiries", icon: Inbox, to: "/admin/enquiries" },
          { label: "Partners", icon: Handshake, to: "/admin/partners" },
          { label: "Compliance documents", icon: FileCheck2, to: "/admin/documents" },
        ].map(({ label, icon: Icon, to }, i) => (
          <div key={label} className="rounded-lg border border-border p-5">
            <Icon className="size-6 text-primary" />
            <p className="mt-4 text-3xl font-bold">{isPending ? "—" : (data?.counts[i] ?? "—")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            <Button variant="link" asChild className="mt-2 px-0">
              <Link to={to}>
                Manage <ArrowRight />
              </Link>
            </Button>
          </div>
        ))}
      </div>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">Recent enquiries</h2>
          <Button asChild variant="ghost">
            <Link to="/admin/enquiries">
              View all <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {data?.recent.map((r) => (
            <Link
              key={r.id}
              to="/admin/enquiries"
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-semibold">{r.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {r.product_name || "General enquiry"} ·{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm text-primary">{r.status.replace(/_/g, " ")}</span>
            </Link>
          ))}
          {!isPending && !data?.recent.length && (
            <p className="py-8 text-muted-foreground">No enquiries yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
