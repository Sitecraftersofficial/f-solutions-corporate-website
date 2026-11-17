import { useQuery } from "@tanstack/react-query";
import logoAsset from "@/assets/fsolutions-logo.jpg.asset.json";
import { contentQuery } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Official F-Solutions logo; admins can replace it via Website Content (logo_url). */
export function Logo({ className }: { className?: string }) {
  const { data } = useQuery(contentQuery);
  const src = data?.logo_url || logoAsset.url;
  return (
    <img
      src={src}
      alt="F-Solutions Ltd — One World, One Health, One Solution"
      className={cn("h-12 w-auto object-contain", className)}
    />
  );
}
