import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye, Target, CheckCircle2 } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { contentQuery } from "@/lib/data";
import { seo } from "@/lib/seo";
import heroImg from "@/assets/hero-distribution.jpg";

export const Route = createFileRoute("/_site/about")({
  head: () => seo("About Us", "F-Solutions Ltd is a Kigali-based importer and distributor of pharmaceuticals, medical devices and veterinary products. Our vision, mission and values."),
  component: About,
});

const WHY = ["Expertise across Human Health and Agrovet", "Commitment to quality and compliance", "Reliable supply chain approach", "Market-driven product portfolio", "Strong partnership orientation", "Focus on long-term customer relationships", "Commitment to growth and innovation"];

function About() {
  const { data: c = {} } = useQuery(contentQuery);
  const values = (c.core_values ?? "").split("\n").map((v) => v.trim()).filter(Boolean);
  return (
    <>
      <PageHero eyebrow="About F-Solutions" title="Who we are" image={heroImg}>{c.motto}</PageHero>
      <section className="container-site py-14">
        <p className="max-w-3xl text-lg leading-relaxed text-foreground/85">{c.about_who}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-secondary p-8"><Eye className="size-8 text-primary" /><h2 className="mt-3 text-2xl font-bold text-primary-deep">Our Vision</h2><p className="mt-2 text-foreground/80">{c.vision}</p></div>
          <div className="rounded-lg bg-primary-deep p-8 text-primary-foreground"><Target className="size-8 text-sidebar-primary" /><h2 className="mt-3 text-2xl font-bold">Our Mission</h2><p className="mt-2 text-primary-foreground/85">{c.mission}</p></div>
        </div>
      </section>
      <section className="bg-muted py-14">
        <div className="container-site">
          <SectionHeading eyebrow="What guides us" title="Our core values" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v} className="rounded-lg bg-card p-5 shadow-card"><span className="font-display text-sm font-bold text-primary">0{i + 1}</span><p className="mt-1 font-semibold text-primary-deep">{v}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-site py-14">
        <SectionHeading title="Why choose F-Solutions?" />
        <ul className="mt-6 grid gap-3 md:grid-cols-2">{WHY.map((w) => <li key={w} className="flex gap-2"><CheckCircle2 className="size-5 shrink-0 text-primary" />{w}</li>)}</ul>
        <p className="mt-8 max-w-3xl text-muted-foreground">F-Solutions is based in Kigali, Rwanda, with Rwanda as its primary market and an ambition to grow across East Africa.</p>
      </section>
      <CtaBand />
    </>
  );
}
