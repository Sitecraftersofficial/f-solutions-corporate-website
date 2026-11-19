import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import type { ProductWithRefs } from "@/lib/data";
import { resolveProductImageUrl } from "@/lib/assets";

export function ProductCard({ p }: { p: ProductWithRefs }) {
  return (
    <Link
      to={`/products/${encodeURIComponent(p.slug)}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="flex aspect-4/3 items-center justify-center bg-muted">
        {p.image_url ? (
          <img
            src={resolveProductImageUrl(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <Package className="size-12 text-muted-foreground/40" aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {p.categories?.name ?? "Uncategorised"}
        </p>
        <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">{p.name}</h3>
        {p.brand && <p className="text-sm text-muted-foreground">{p.brand}</p>}
        {p.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>
        )}
        <span className="mt-auto pt-3 text-sm font-semibold text-primary">View & enquire →</span>
      </div>
    </Link>
  );
}
