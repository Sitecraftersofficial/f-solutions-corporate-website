import { FileText, ShieldCheck } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { complianceDocsQuery, contentQuery } from "@/lib/data";
import { useSeo } from "@/lib/seo";
import { useCachedData } from "@/lib/query";

const PILLARS = [
  {
    t: "Rwanda Food and Drugs Authority requirements",
    d: "We are committed to working in line with the requirements of the Rwanda FDA for the products we import and distribute.",
  },
  {
    t: "Good Distribution Practices (GDP)",
    d: "Storage, handling and transport practices designed to protect product quality across the supply chain.",
  },
  {
    t: "Good Manufacturing Practices (GMP)",
    d: "Sourcing from manufacturers whose processes follow GMP, where applicable to the relevant supply chain.",
  },
  {
    t: "Relevant ISO standards",
    d: "Valuing internationally recognised quality and management standards among our suppliers and partners.",
  },
  {
    t: "Approved dossiers and documentation",
    d: "Maintaining product dossiers and documentation required for market access.",
  },
  {
    t: "Product traceability",
    d: "Tracking products through procurement, storage and distribution.",
  },
  {
    t: "Quality assurance",
    d: "Checks and controls focused on safe, effective products reaching our customers.",
  },
  {
    t: "Responsible sourcing and distribution",
    d: "Working with trusted manufacturers and distributing responsibly.",
  },
];

export function QualityPage() {
  useSeo(
    "Quality & Compliance",
    "Our commitment to Rwanda FDA requirements, Good Distribution Practices, product traceability and responsible sourcing.",
  );
  const { data: c = {} } = useCachedData(contentQuery);
  const { data: docs = [] } = useCachedData(complianceDocsQuery);
  return (
    <>
      <PageHero eyebrow="Our commitment" title="Quality & Compliance">
        {c.quality_intro}
      </PageHero>
      <section className="container-site py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.t} className="rounded-lg border border-border bg-card p-5 shadow-card">
              <ShieldCheck className="size-6 text-primary" />
              <h2 className="mt-3 font-semibold text-primary-deep">{p.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
      {docs.length > 0 && (
        <section className="bg-muted py-14">
          <div className="container-site">
            <SectionHeading title="Certificates & documents" />
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {docs.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 rounded-lg bg-card p-4 shadow-card hover:text-primary"
                  >
                    <FileText className="size-5 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">{d.title}</span>
                      {d.description && (
                        <span className="block text-sm text-muted-foreground">{d.description}</span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
