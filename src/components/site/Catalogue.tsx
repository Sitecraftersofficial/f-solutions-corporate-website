import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  animalsQuery,
  categoriesQuery,
  filterProducts,
  productsQuery,
  type Division,
} from "@/lib/data";
import { useCachedData } from "@/lib/query";
import { ProductCard } from "./ProductCard";

const selectCls = "h-9 rounded-md border border-input bg-background px-3 text-sm";

export function Catalogue({
  division,
  initialCategory,
  initialAnimal,
}: {
  division: Division;
  initialCategory?: string;
  initialAnimal?: string;
}) {
  const { data: products = [], isLoading } = useCachedData(productsQuery(division));
  const { data: cats = [] } = useCachedData(categoriesQuery);
  const { data: animals = [] } = useCachedData(animalsQuery);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [brand, setBrand] = useState("");
  const [animal, setAnimal] = useState(initialAnimal ?? "");

  const divCats = cats.filter((c) => c.division === division);
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort() as string[],
    [products],
  );
  const list = filterProducts(products, { q, category, brand, animal });

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search products"
            placeholder="Search by product name or brand…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-background pl-9"
          />
        </div>
        <select
          aria-label="Filter by category"
          className={selectCls}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {divCats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {division === "agrovet" && (
          <select
            aria-label="Filter by animal"
            className={selectCls}
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
          >
            <option value="">All animals</option>
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        )}
        <select
          aria-label="Filter by brand"
          className={selectCls}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading products…</p>
        ) : list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="font-semibold text-primary-deep">
              {products.length === 0
                ? "Our product catalogue is being updated."
                : "No products match your filters."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact us for current product availability and quotations.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
