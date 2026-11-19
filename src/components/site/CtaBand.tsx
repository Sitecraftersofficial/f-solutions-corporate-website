import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="bg-primary-deep">
      <div className="container-site flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
            Need product information, availability or a quotation?
          </h2>
          <p className="mt-2 text-primary-foreground/80">
            Talk to our team about supply, bulk orders or partnerships.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </section>
  );
}
