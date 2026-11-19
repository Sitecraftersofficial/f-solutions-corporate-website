import { useCachedData } from "@/lib/query";
import { partnersQuery } from "@/lib/data";

export function PartnerGrid({ detailed = false }: { detailed?: boolean }) {
  const { data = [] } = useCachedData(partnersQuery);
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {data.map((p) => (
        <div
          key={p.id}
          className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-card"
        >
          <div className="flex h-20 items-center">
            {p.logo_url ? (
              <img
                src={p.logo_url}
                alt={`${p.name} logo`}
                loading="lazy"
                className="max-h-16 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-2xl font-bold text-primary-deep">{p.name}</span>
            )}
          </div>
          {p.logo_url && <h3 className="font-semibold text-primary-deep">{p.name}</h3>}
          <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
          {detailed && p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Visit website
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
