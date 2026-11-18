import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { contentQuery } from "@/lib/data";
import { seo } from "@/lib/seo";

type S = { division?: "human_health" | "agrovet" };
export const Route = createFileRoute("/_site/contact")({
  validateSearch: (s: Record<string, unknown>): S => ({ division: s.division === "human_health" || s.division === "agrovet" ? s.division : undefined }),
  head: () => seo("Contact Us", "Contact F-Solutions Ltd in Kigali, Rwanda, for product information, quotations, bulk supply or partnerships. Email info@fsolutions.rw."),
  component: Contact,
});

function Contact() {
  const { data: c = {} } = useQuery(contentQuery);
  const { division } = Route.useSearch();
  const wa = c.contact_whatsapp?.replace(/[^\d]/g, "");
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact Us">Request product information, availability, quotations, bulk supply or discuss a partnership.</PageHero>
      <section className="container-site grid gap-10 py-14 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-5">
          <div className="rounded-lg bg-secondary p-6">
            <h2 className="text-xl font-bold text-primary-deep">F-Solutions Ltd</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><MapPin className="size-5 shrink-0 text-primary" />{c.contact_address ? `${c.contact_address}, ` : ""}{c.contact_location}</li>
              <li className="flex gap-2"><Mail className="size-5 shrink-0 text-primary" /><a className="hover:text-primary" href={`mailto:${c.contact_email}`}>{c.contact_email}</a></li>
              {c.contact_phone && <li className="flex gap-2"><Phone className="size-5 shrink-0 text-primary" /><a className="hover:text-primary" href={`tel:${c.contact_phone.replace(/\s/g, "")}`}>{c.contact_phone}</a></li>}
              {wa && <li className="flex gap-2"><MessageCircle className="size-5 shrink-0 text-primary" /><a className="hover:text-primary" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>}
            </ul>
          </div>
          <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
            <p><strong className="text-health">Human Health:</strong> pharmaceuticals, reproductive health, medical devices and diagnostics.</p>
            <p className="mt-2"><strong className="text-agro">Agrovet:</strong> veterinary medicines, vaccines, animal nutrition and farm health products.</p>
          </div>
        </aside>
        <div className="rounded-lg border border-border bg-card p-6 shadow-card md:p-8">
          <h2 className="mb-6 text-2xl font-bold text-primary-deep">Send us an enquiry</h2>
          <EnquiryForm key={division} division={division ?? "general"} />
        </div>
      </section>
    </>
  );
}
