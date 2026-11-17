import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children, image }: { eyebrow?: string; title: string; children?: ReactNode; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-primary-deep">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="container-site relative py-16 md:py-24">
        {eyebrow && <p className="eyebrow text-sidebar-primary">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary-foreground md:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-primary-foreground/85">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold text-primary-deep md:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-muted-foreground">{children}</p>}
    </div>
  );
}
