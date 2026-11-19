import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Syringe, ShieldPlus, Wheat, Stethoscope } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Catalogue } from "@/components/site/Catalogue";
import { CtaBand } from "@/components/site/CtaBand";
import { animalsQuery, contentQuery } from "@/lib/data";
import { useSeo } from "@/lib/seo";
import { useCachedData } from "@/lib/query";
import agroImg from "@/assets/agrovet.jpg";

const AREAS = [
  {
    icon: Stethoscope,
    t: "Veterinary Medicines",
    d: "Veterinary medicines, animal health treatments and other veterinary pharmaceutical products.",
  },
  {
    icon: Syringe,
    t: "Vaccines & Disease Prevention",
    d: "Veterinary vaccines and farm animal disease prevention and protection products.",
  },
  {
    icon: Wheat,
    t: "Animal Nutrition",
    d: "Animal feed, nutritional supplements, feed-related products and livestock nutrition solutions.",
  },
  {
    icon: ShieldPlus,
    t: "Farm Health Products",
    d: "Poultry and livestock health support products and other Agrovet supplies.",
  },
];
const SERVICES = [
  "Veterinary product supply and distribution",
  "Animal health product support",
  "Poultry and livestock production support",
  "Technical product guidance and customer support",
  "Supply chain solutions for farms and agro-dealers",
];
const CUSTOMERS = [
  "Veterinary pharmacies",
  "Agro-dealers",
  "Poultry farms",
  "Livestock farms",
  "Agricultural enterprises",
  "Farmers' cooperatives",
  "Agricultural distributors and institutions",
];

export function AgrovetPage() {
  useSeo(
    "Agrovet Division",
    "Veterinary medicines, vaccines, animal nutrition and farm health products for poultry, cattle, goats, sheep and livestock farms in Rwanda.",
  );
  const { data: c = {} } = useCachedData(contentQuery);
  const { data: animals = [] } = useCachedData(animalsQuery);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const animal = searchParams.get("animal") ?? undefined;
  const navigate = useNavigate();
  return (
    <>
      <PageHero eyebrow="Division" title="Agrovet" image={c.agrovet_image_url || agroImg}>
        {c.agrovet_intro}
      </PageHero>
      <section className="container-site py-14">
        <SectionHeading eyebrow="Farm animals" title="Supporting livestock production">
          Our Agrovet division focuses on farm animals and livestock.
        </SectionHeading>
        <div className="mt-6 flex flex-wrap gap-3">
          {animals.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("animal", a.id);
                navigate({ pathname: "/agrovet", search: params.toString(), hash: "catalogue" });
              }}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${animal === a.id ? "border-agro bg-agro text-primary-foreground" : "border-border bg-agro-soft text-primary-deep hover:border-agro"}`}
            >
              {a.name}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map(({ icon: I, t, d }) => (
            <div
              key={t}
              className="rounded-lg border border-border border-t-4 border-t-agro bg-card p-6 shadow-card"
            >
              <I className="size-8 text-agro" />
              <h2 className="mt-3 text-lg font-bold text-primary-deep">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-agro-soft py-14">
        <div className="container-site grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading title="Our services" />
            <ul className="mt-5 space-y-2">
              {SERVICES.map((s) => (
                <li key={s} className="flex gap-2">
                  <CheckCircle2 className="size-5 shrink-0 text-agro" />
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
        <SectionHeading eyebrow="Catalogue" title="Agrovet products">
          Filter by category, animal type or brand and request information on any product.
        </SectionHeading>
        <div className="mt-6">
          <Catalogue
            key={`${category}-${animal}`}
            division="agrovet"
            initialCategory={category}
            initialAnimal={animal}
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
