import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/partners")({
  head: () => seo("Our Partners", "F-Solutions works with DKT International, ACON Laboratories and WAFI across reproductive health, diagnostics and animal health."),
  component: () => (
    <>
      <PageHero eyebrow="Partnerships" title="Our Partners">We work with manufacturers to bring quality health and animal health products to Rwanda.</PageHero>
      <section className="container-site py-14"><PartnerGrid detailed /></section>
      <CtaBand />
    </>
  ),
});
