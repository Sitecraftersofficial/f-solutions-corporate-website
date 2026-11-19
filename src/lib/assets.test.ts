import { describe, expect, it } from "vitest";
import { resolveProductImageUrl } from "./assets";

describe("resolveProductImageUrl", () => {
  it("resolves product bucket paths to their public Supabase Storage URL", () => {
    const result = new URL(
      resolveProductImageUrl("/product-images/acon/on-call-express-family.png"),
    );
    expect(result.origin).toBe(new URL(import.meta.env.VITE_SUPABASE_URL).origin);
    expect(result.pathname).toBe(
      "/storage/v1/object/public/product-images/acon/on-call-express-family.png",
    );
  });

  it("preserves absolute image URLs", () => {
    const imageUrl = "https://cdn.example.com/product.png";
    expect(resolveProductImageUrl(imageUrl)).toBe(imageUrl);
  });
});
