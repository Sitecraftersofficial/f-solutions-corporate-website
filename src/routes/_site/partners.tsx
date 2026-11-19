import { PageHero } from "@/components/site/PageHero";
import { PartnerGrid } from "@/components/site/PartnerGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { useSeo } from "@/lib/seo";

export function PartnersPage() {
  useSeo(
    "Our Partners",
    "F-Solutions works with DKT International, ACON Laboratories and WAFI across reproductive health, diagnostics and animal health.",
  );
  return (
    <>
      <PageHero eyebrow="Partnerships" title="Our Partners">
        We work with manufacturers to bring quality health and animal health products to Rwanda.
      </PageHero>
      <section className="container-site py-14">
        <PartnerGrid detailed />
      </section>
      <CtaBand />
    </>
  );
}
