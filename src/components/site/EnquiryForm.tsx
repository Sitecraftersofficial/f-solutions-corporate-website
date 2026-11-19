import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { enquirySchema } from "@/lib/enquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = { productId?: string; productName?: string; division?: "human_health" | "agrovet" | "general" };

export function EnquiryForm({ productId, productName, division = "general" }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = enquirySchema.safeParse(fd);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    const v = parsed.data;
    const { error } = await supabase.from("enquiries").insert({
      full_name: v.full_name,
      organization: v.organization || null,
      email: v.email,
      phone: v.phone || null,
      division: v.division,
      product_id: productId ?? null,
      product_name: v.product_name || null,
      quantity: v.quantity || null,
      message: v.message,
    });
    setStatus(error ? "error" : "done");
  }

  if (status === "done")
    return (
      <div role="status" className="rounded-lg border border-primary/30 bg-secondary p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h3 className="mt-3 text-xl font-semibold text-primary-deep">Thank you — your enquiry has been received.</h3>
        <p className="mt-2 text-muted-foreground">Your message is saved for our team to review.</p>
        <Button variant="outline" className="mt-5" onClick={() => setStatus("idle")}>Send another enquiry</Button>
      </div>
    );

  const field = (name: string, label: string, el: React.ReactNode, required = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={`enq-${name}`}>{label}{required && <span className="text-destructive"> *</span>}</Label>
      {el}
      {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {field("full_name", "Full name", <Input id="enq-full_name" name="full_name" autoComplete="name" maxLength={120} />, true)}
      {field("organization", "Organization / company", <Input id="enq-organization" name="organization" autoComplete="organization" maxLength={160} />)}
      {field("email", "Email address", <Input id="enq-email" name="email" type="email" autoComplete="email" maxLength={255} />, true)}
      {field("phone", "Phone number", <Input id="enq-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />)}
      {field(
        "division",
        "Business division",
        <select id="enq-division" name="division" defaultValue={division} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option value="general">General enquiry</option>
          <option value="human_health">Human Health</option>
          <option value="agrovet">Agrovet</option>
        </select>,
      )}
      {field("product_name", "Product of interest", <Input id="enq-product_name" name="product_name" defaultValue={productName} maxLength={200} />)}
      <div className="sm:col-span-2">{field("quantity", "Quantity or estimated requirement", <Input id="enq-quantity" name="quantity" maxLength={200} />)}</div>
      <div className="sm:col-span-2">{field("message", "Message", <Textarea id="enq-message" name="message" rows={5} maxLength={3000} />, true)}</div>
      {status === "error" && <p className="text-sm text-destructive sm:col-span-2">Sorry, your enquiry could not be sent. Please try again or email us directly.</p>}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Submit Enquiry"}</Button>
      </div>
    </form>
  );
}
