import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronLeft, FileText, Package } from "lucide-react";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { animalsQuery, DIVISION_LABEL, productBySlugQuery } from "@/lib/data";

export const Route = createFileRoute("/_site/products/$slug")({
  head: () => ({ meta: [{ title: "Product details | F-Solutions Ltd" }, { name: "description", content: "Product information and enquiries from F-Solutions Ltd, Kigali, Rwanda." }, { property: "og:title", content: "Product details | F-Solutions Ltd" }, { property: "og:description", content: "Product information and enquiries from F-Solutions Ltd." }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary" }] }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery(productBySlugQuery(slug));
  const { data: animals = [] } = useQuery(animalsQuery);
  if (isLoading) return <div className="container-site py-20 text-muted-foreground">Loading…</div>;
  if (!p || !p.published)
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold text-primary-deep">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This product may no longer be listed.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-primary">Back to home</Link>
      </div>
    );
  const back = p.division === "agrovet" ? "/agrovet" : "/human-health";
  const animalNames = animals.filter((a) => p.product_animals.some((x) => x.animal_type_id === a.id)).map((a) => a.name);
  return (
    <div className="container-site py-10">
      <title>{`${p.name} | F-Solutions Ltd`}</title>
      <Link to={back} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><ChevronLeft className="size-4" />Back to {DIVISION_LABEL[p.division]}</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted">
          {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-contain p-8" /> : <Package className="size-20 text-muted-foreground/40" />}
        </div>
        <div>
          <p className={`eyebrow ${p.division === "agrovet" ? "text-agro" : "text-health"}`}>{DIVISION_LABEL[p.division]} · {p.categories?.name ?? "Uncategorised"}</p>
          <h1 className="mt-2 text-3xl font-bold text-primary-deep md:text-4xl">{p.name}</h1>
          {p.brand && <p className="mt-1 text-muted-foreground">Brand / manufacturer: <strong className="text-foreground">{p.brand}</strong></p>}
          {animalNames.length > 0 && <p className="mt-1 text-muted-foreground">For: {animalNames.join(", ")}</p>}
          {p.is_prescription && (
            <div className="mt-4 flex gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm"><AlertTriangle className="size-5 shrink-0 text-destructive" />Prescription-only product. Supplied to licensed healthcare institutions and professionals. Do not self-medicate.</div>
          )}
          {p.short_description && <p className="mt-4 text-lg text-foreground/85">{p.short_description}</p>}
          {p.details && <div className="mt-4 whitespace-pre-line text-foreground/80">{p.details}</div>}
          {p.specifications && (
            <div className="mt-6"><h2 className="text-lg font-semibold text-primary-deep">Specifications</h2><div className="mt-2 whitespace-pre-line rounded-md bg-muted p-4 text-sm">{p.specifications}</div></div>
          )}
          {p.document_url && <a href={p.document_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline"><FileText className="size-4" />{p.document_name || "Product document"}</a>}
          <a href="#enquire" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">Request a Quotation</a>
        </div>
      </div>
      <section id="enquire" className="mt-14 rounded-xl border border-border bg-card p-6 shadow-card md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-primary-deep">Enquire about this product</h2>
        <EnquiryForm productId={p.id} productName={p.name} division={p.division as "human_health" | "agrovet"} />
      </section>
    </div>
  );
}
