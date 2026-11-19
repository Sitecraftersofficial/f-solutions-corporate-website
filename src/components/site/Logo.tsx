import { useCachedData } from "@/lib/query";
import logoAsset from "@/assets/logo.jpeg";
import { contentQuery } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Uses the configured brand image when present; otherwise uses the local logo asset. */
export function Logo({ className }: { className?: string }) {
  const { data } = useCachedData(contentQuery);
  const src = data?.logo_url || logoAsset;
  return (
    <img
      src={src}
      alt="F-Solutions Ltd — One World, One Health, One Solution"
      className={cn("h-12 w-auto object-contain", className)}
    />
  );
}
