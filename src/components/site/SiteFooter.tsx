import { Link } from "react-router-dom";
import { useCachedData } from "@/lib/query";
import { Mail, MapPin, Phone } from "lucide-react";
import { contentQuery } from "@/lib/data";
import { Logo } from "./Logo";
import { NAV } from "./SiteHeader";
import { currentUserQuery } from "@/lib/auth";

export function SiteFooter() {
  const { data: c = {} } = useCachedData(contentQuery);
  const { data: user } = useCachedData(currentUserQuery);
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-block rounded-lg bg-background p-3">
            <Logo className="h-20" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-primary-deep">
            F-Solutions Ltd
          </p>
          <p className="text-sm font-semibold text-primary">{c.motto}</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{c.footer_text}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-primary-deep">Navigation</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-primary">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-primary-deep">Contact</h2>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              {c.contact_address ? `${c.contact_address}, ` : ""}
              {c.contact_location}
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${c.contact_email}`} className="hover:text-primary">
                {c.contact_email}
              </a>
            </li>
            {c.contact_phone && (
              <li className="flex gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href={`tel:${c.contact_phone.replace(/\s/g, "")}`}
                  className="hover:text-primary"
                >
                  {c.contact_phone}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site flex flex-wrap justify-between gap-3 py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} F-Solutions Ltd. All rights reserved.
          <Link to={user?.isAdmin ? "/admin" : "/auth"} className="hover:text-primary">
            {user?.isAdmin ? "Admin dashboard" : "Administrator sign in"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
