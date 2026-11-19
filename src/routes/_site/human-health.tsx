import { useSearchParams } from "react-router-dom";
import { Pill, HeartHandshake, Microscope, CheckCircle2 } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Catalogue } from "@/components/site/Catalogue";
import { CtaBand } from "@/components/site/CtaBand";
import { contentQuery } from "@/lib/data";
import { useSeo } from "@/lib/seo";
import { useCachedData } from "@/lib/query";
import hhImg from "@/assets/human-health.jpg";

const AREAS = [
  {
    icon: Pill,
    t: "Pharmaceuticals",
    items: [
      "Prescription medicines",
      "Over-the-counter medicines",
      "Other pharmaceutical products",
      "Pharmaceutical supply and distribution",
    ],
  },
  {
    icon: HeartHandshake,
    t: "Reproductive Health",
    items: [
      "Male condoms",
      "Lubricants",
      "Contraceptives",
      "Other reproductive health products and commodities",
    ],
  },
  {
    icon: Microscope,
    t: "Medical Devices & Diagnostics",
    items: [
      "Blood glucose monitoring devices",
      "HbA1c, CRP and ACR testing systems",
      "Laboratory and in-vitro diagnostic (IVD) products",
      "Diagnostic strips, accessories and consumables",
    ],
  },
];
const SERVICES = [
  "Pharmaceutical importation and distribution",
  "Product promotion and professional education",
  "Medical device and diagnostic equipment distribution",
  "Product sourcing and supply chain support",
  "Healthcare product availability and supply solutions",
];
const CUSTOMERS = [
  "Hospitals",
  "Pharmacies",
  "Pharmaceutical wholesalers and distributors",
  "Public and private clinics",
  "Laboratories and diagnostic centers",
  "Healthcare professionals and institutions",
  "NGOs and healthcare organizations",
];

export function HumanHealthPage() {
  useSeo(
    "Human Health Division",
    "Pharmaceuticals, reproductive health products, medical devices and diagnostics for hospitals, pharmacies, clinics and laboratories in Rwanda.",
  );
  const { data: c = {} } = useCachedData(contentQuery);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  return (
    <>
      <PageHero eyebrow="Division" title="Human Health" image={c.human_health_image_url || hhImg}>
        {c.human_health_intro}
      </PageHero>
      <section className="container-site py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {AREAS.map(({ icon: I, t, items }) => (
            <div
              key={t}
              className="rounded-lg border border-border border-t-4 border-t-health bg-card p-6 shadow-card"
            >
              <I className="size-8 text-health" />
              <h2 className="mt-3 text-xl font-bold text-primary-deep">{t}</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-health-soft py-14">
        <div className="container-site grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading title="Our services" />
            <ul className="mt-5 space-y-2">
              {SERVICES.map((s) => (
                <li key={s} className="flex gap-2">
                  <CheckCircle2 className="size-5 shrink-0 text-health" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Who we serve" />
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {CUSTOMERS.map((s) => (
                <li key={s} className="rounded-md bg-card px-3 py-2 text-sm shadow-card">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="container-site py-14" id="catalogue">
        <SectionHeading eyebrow="Catalogue" title="Human Health products">
          Search and filter our product range, then send us an enquiry for availability or a
          quotation.
        </SectionHeading>
        <p className="mt-4 rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
          Prescription medicines are supplied to licensed healthcare institutions and professionals
          only. Always use medicines under the guidance of a qualified healthcare professional.
        </p>
        <div className="mt-6">
          <Catalogue key={category} division="human_health" initialCategory={category} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
