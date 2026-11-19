import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/human-health", label: "Human Health" },
  { to: "/agrovet", label: "Agrovet" },
  { to: "/partners", label: "Our Partners" },
  { to: "/quality", label: "Quality & Compliance" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="F-Solutions home">
          <Logo className="h-14" />
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary ${isActive ? "text-primary" : ""}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/contact">Send an Enquiry</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo className="mb-6 h-16" />
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    end={n.to === "/"}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-3 font-medium hover:bg-muted ${isActive ? "bg-secondary text-primary-deep" : ""}`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              <Button asChild className="mt-6 w-full">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Send an Enquiry
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
