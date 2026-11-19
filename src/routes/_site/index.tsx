import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Handshake,
  Layers,
  Users,
  Sprout,
  FileCheck2,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { SectionHeading } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, contentQuery, productsQuery } from "@/lib/data";
import { useSeo } from "@/lib/seo";
import { useCachedData } from "@/lib/query";
import heroImg from "@/assets/hero-distribution.jpg";
import hhImg from "@/assets/human-health.jpg";
import agroImg from "@/assets/agrovet.jpg";

const WHY = [
  { icon: Layers, t: "Expertise across Human Health and Agrovet" },
  { icon: ShieldCheck, t: "Commitment to quality and compliance" },
  { icon: Truck, t: "Reliable supply chain approach" },
  { icon: Boxes, t: "Market-driven product portfolio" },
  { icon: Handshake, t: "Strong partnership orientation" },
  { icon: Users, t: "Focus on long-term customer relationships" },
];

const APPROACH = [
  "Structured procurement and inventory management",
  "Regulatory adherence",
  "Reliable and efficient logistics",
  "Long-term relationships with manufacturers and customers",
  "Product sourcing and market access",
  "Responsible distribution practices",
];

export function HomePage() {
  useSeo(
    "Reliable Healthcare & Agrovet Supply Solutions in Rwanda",
    "F-Solutions Ltd imports and distributes pharmaceuticals, medical devices, diagnostics and veterinary products in Rwanda. One World. One Health. One Solution.",
  );
  const { data: c = {} } = useCachedData(contentQuery);
  const { data: cats = [] } = useCachedData(categoriesQuery);
  const { data: products = [] } = useCachedData(productsQuery());
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-primary-deep">
        <img
          src={c.hero_image_url || heroImg}
          alt="Pharmaceutical supplies stored in a distribution warehouse"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="container-site relative grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow text-sidebar-primary">{c.motto}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              {c.hero_headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">{c.hero_subtext}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/human-health">
                  Human Health <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/agrovet">
                  Agrovet <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="rounded-2xl bg-background p-6 shadow-2xl">
              <Logo className="h-56" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-site py-16 md:py-20">
        <SectionHeading eyebrow="Who we are" title="Integrated healthcare and Agrovet supply">
          {c.company_intro}
        </SectionHeading>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              to: "/human-health" as const,
              title: "Human Health",
              img: c.human_health_image_url || hhImg,
              alt: "Laboratory technician using a glucose monitoring device",
              text: c.human_health_intro,
              tone: "border-t-health",
              cta: "Explore Human Health",
            },
            {
              to: "/agrovet" as const,
              title: "Agrovet",
              img: c.agrovet_image_url || agroImg,
              alt: "Cattle, goats, sheep and poultry on a Rwandan farm",
              text: c.agrovet_intro,
              tone: "border-t-agro",
              cta: "Explore Agrovet",
            },
          ].map((d) => (
            <Link
              key={d.to}
              to={d.to}
              className={`group overflow-hidden rounded-xl border border-border border-t-4 ${d.tone} bg-card shadow-card`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={d.img}
                  alt={d.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary-deep">{d.title}</h3>
                <p className="mt-2 text-muted-foreground">{d.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-primary">
                  {d.cta} <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="container-site">
          <SectionHeading eyebrow="Product categories" title="What we supply" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((cat) => (
              <Link
                key={cat.id}
                to={`${cat.division === "agrovet" ? "/agrovet" : "/human-health"}?category=${encodeURIComponent(cat.id)}`}
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <p
                  className={`text-xs font-bold uppercase tracking-wide ${cat.division === "agrovet" ? "text-agro" : "text-health"}`}
                >
                  {cat.division === "agrovet" ? "Agrovet" : "Human Health"}
                </p>
                <h3 className="mt-1 font-semibold text-primary-deep">{cat.name}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{cat.description}</p>
              </Link>
            ))}
          </div>
          {featured.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-primary-deep">Featured products</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container-site py-16 md:py-20">
        <SectionHeading eyebrow="Our partners" title="Working with trusted manufacturers" />
        <div className="mt-8">
          <PartnerGrid />
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-20">
        <div className="container-site">
          <SectionHeading eyebrow="Why F-Solutions" title="Why choose F-Solutions" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(({ icon: I, t }) => (
              <div key={t} className="flex items-start gap-3 rounded-lg bg-card p-5 shadow-card">
                <I className="mt-0.5 size-6 shrink-0 text-primary" />
                <p className="font-medium">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site grid gap-12 py-16 md:py-20 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Quality & compliance"
            title="Quality at the centre of our supply chain"
          >
            {c.quality_intro}
          </SectionHeading>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              "Rwanda Food and Drugs Authority requirements",
              "Good Distribution Practices (GDP)",
              "Product traceability and documentation",
              "Responsible sourcing and distribution",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <FileCheck2 className="size-4 shrink-0 text-primary" />
                {x}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/quality">Our quality commitment</Link>
          </Button>
        </div>
        <div>
          <SectionHeading eyebrow="Our approach" title="How we operate">
            Based in Kigali, serving Rwanda, with a growth ambition across East Africa.
          </SectionHeading>
          <ol className="mt-6 grid gap-3">
            {APPROACH.map((a, i) => (
              <li key={a} className="flex items-center gap-3 rounded-md border border-border p-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sprout className="size-4 text-primary" />
            Customer-focused supply solutions for healthcare and agriculture.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
